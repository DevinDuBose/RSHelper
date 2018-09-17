const browser = require("./AsyncBrowser");
const queue = require("./Queue");
const config = require("./Config.json");

class CompanionApp {

    constructor() {
        var connected;
        var readQueue;
        var writeQueue;
        var index = -1;

        readQueue = new Queue();
        writeQueue = new Queue();
        connect();
    }

    connect() {
        browser = new Browser();
        if (browser.goTo("http://www.runescape.com/companion/comapp.ws")) {
            Logger.trace("Launching companion app.");
            browser.setFrame(1);
            if (browser.waitForSelector("body:not(.initial-load)", 10000, false)) {
                login();
                if (browser.waitForSelector("div.modal-body.ng-scope", 15000, false)) {
                    if (browser.waitForSelector("div[ng-include=\"'partials/save_credentials.ws'\"]", 10000, false)) {
                        browser.click("a[ng-click='modalCancel()']"); // click on the "no" button on the save password dialog
                        if (browser.waitForSelector("div.modal-body.ng-scope", 5000, true)) {
                            Logger.trace("Successfully connected to the RSCompanion app.");
                            browser.click("li.all-chat");
                            if (browser.waitForSelector("section.chat.all-chat.ng-scope", 10000, false)) {
                                openChatbox();
                            }
                        }
                    }
                }
            }
        }
    }

    disconnect() {
        browser.close();
        connected = false;
        Logger.trace("Disconnected from the companion app.");
    }

    login() {
        browser.type("input#username", config.credentials.username);
        browser.type("input#password", config.credentials.password);
        browser.click("button.icon-login");
        logger.trace("You are logging in as " + config.credentials.username);
    }

    openChatbox() {
        if (config.configs.chatType === "clan") {
            browser.click("i.icon-clanchat:not(.icon)"); // click on the clan chat tab
        } else if (config.configs.chatType === "friends") {
            browser.click("i.icon-friendschat:not(.icon)"); // click on the friends chat tab
        } else {
            Logger.trace("Not a valid chat type. must be \"clan\" or \"friends\"");
            disconnect();
            return;
        }

        Logger.trace("Connected to " + config.configs.chatType + " chat.");
        connected = true;
    }

    async read() {
        return await browser.page.evaluate((index) => {
            function getNextMessage(ul, index) {
                let list = ul.querySelectorAll("li.message.clearfix.ng-scope:not(.my-message):not(.historical)");
                if (index < list.length - 1) {
                    return list[++index];
                } else {
                    if (index >= list.length) {
                        index = list.length - 1;
                    }
                    return null;
                }
            }

            let div = browser.window.frames[0].document.getElementsByClassName("content push-top-double push-bottom-double").item(0);

            if (div != null) {
                let ul = div.getElementsByTagName("ul").item(0);

                if (ul != null) {
                    let lastMessage = getNextMessage(ul, index);

                    if (lastMessage !== null) {
                        let authorElement = lastMessage.getElementsByClassName("author").item(0);
                        let messageElement = lastMessage.getElementsByTagName("p").item(0);

                        if (authorElement != null) {
                            authorElement = authorElement.childNodes[0].nodeValue;
                            authorElement = authorElement.substring(0, (authorElement.length - 3));
                        } else {
                            authorElement = undefined;
                        }

                        if (messageElement != null) {
                            messageElement = messageElement.childNodes[0].nodeValue;
                        } else {
                            messageElement = undefined;
                        }

                        Logger.debug("WOOP WOOP, read a message." + messageElement);
                        readQueue.push(authorElement.replace(" ", "_") + " " + messageElement);
                    }
                }
            } else {
                connected = false;
                Logger.error ("The bot has been disconnected.");
            }
        }, index);
    }


    write() {

    }

}
