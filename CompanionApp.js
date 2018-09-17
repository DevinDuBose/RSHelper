const asyncBrowser = require('./AsyncBrowser');
const config = require('./Config');
const logger = require('./Logger');

class CompanionApp {

    constructor() {
        logger.debug("Constructing a companion app object.");
        var browser;
        var connected;
        var readQueue;
        var writeQueue;
        var index = -1;

        readQueue = new Array();
        writeQueue = new Array();
        this.connect();
    }

    connect() {
        this.browser = new asyncBrowser();
        if (this.browser.goTo("http://www.runescape.com/companion/comapp.ws")) {
            logger.trace("Launching companion app.");
            this.browser.setFrame(1);
            if (this.browser.waitForSelector("body:not(.initial-load)", 10000, false)) {
                this.login();
                if (this.browser.waitForSelector("div.modal-body.ng-scope", 15000, false)) {
                    if (this.browser.waitForSelector("div[ng-include=\"'partials/save_credentials.ws'\"]", 10000, false)) {
                        this.browser.click("a[ng-click='modalCancel()']"); // click on the "no" button on the save password dialog
                        if (this.browser.waitForSelector("div.modal-body.ng-scope", 5000, true)) {
                            logger.trace("Successfully connected to the RSCompanion app.");
                            this.browser.click("li.all-chat");
                            if (this.browser.waitForSelector("section.chat.all-chat.ng-scope", 10000, false)) {
                                this.openChatbox();
                            }
                        }
                    }
                }
            }
        }
    }

    disconnect() {
        this.browser.close();
        this.connected = false;
        logger.trace("Disconnected from the companion app.");
    }

    login() {
        this.browser.type("input#username", config.credentials.username);
        this.browser.type("input#password", config.credentials.password);
        this.browser.click("button.icon-login");
        logger.trace("You are logging in as " + config.credentials.username);
    }

    openChatbox() {
        if (config.configs.chatType === "clan") {
            this.browser.click("i.icon-clanchat:not(.icon)"); // click on the clan chat tab
        } else if (config.configs.chatType === "friends") {
            this.browser.click("i.icon-friendschat:not(.icon)"); // click on the friends chat tab
        } else {
            logger.trace("Not a valid chat type. must be \"clan\" or \"friends\"");
            disconnect();
            return;
        }

        logger.trace("Connected to " + config.configs.chatType + " chat.");
        this.connected = true;
    }

    async read() {
        return await this.browser.page.evaluate((index) => {
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

            logger.debug("get frame here hueheueueh");
            let div = this.browser.window.frames[0].document.getElementsByClassName("content push-top-double push-bottom-double").item(0);
            logger.debug("made it passed this.");

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

                        logger.debug("WOOP WOOP, read a message." + messageElement);
                        readQueue.push(authorElement.replace(" ", "_") + " " + messageElement);
                    }
                }
            } else {
                connected = false;
                logger.error ("The bot has been disconnected.");
            }
        }, index);
    }


    write() {

    }

}

module.exports = CompanionApp;
