const browser = require("./AsyncBrowser");
const queue = require("./Queue");
const config = require("./Config.json");

class CompanionApp {
    let connected;
    let readQueue;
    let writeQueue;

    constructor() {
        readQueue = new Queue();
        writeQueue = new Queue();
        connect();
    }

    function connect() {
        browser = new Browser();
        if (browser.goTo("http://www.runescape.com/companion/comapp.ws")).then(() => {
            Logger.trace("Launching companion app.");
            browser.setFrame(1);
            if (browser.waitForSelector("body:not(.initial-load)", 10000, false)).then(() => {
                login();
                if (browser.waitForSelector("div.modal-body.ng-scope", 15000, false)).then(() => {
                    if (browser.waitForSelector("div[ng-include=\"'partials/save_credentials.ws'\"]", 10000, false)).then(() => {
                        browser.click("a[ng-click='modalCancel()']"); // click on the "no" button on the save password dialog
                        if (browser.waitForSelector("div.modal-body.ng-scope", 5000, true)).then(() => {
                            Logger.trace("Successfully connected to the RSCompanion app.");
                            browser.click("li.all-chat");
                            if (browser.waitForSelector("section.chat.all-chat.ng-scope", 10000, false)).then(() => {
                                openChatbox();
                            });
                        });
                    });
                });
            });
        });
    }

    function disconnect() {
        browser.close();
        connected = false;
        Logger.trace("Disconnected from the companion app.");
    }

    function login() {
        browser.type("input#username", config.credentials.username);
        browser.type("input#password", config.credentials.password);
        browser.click("button.icon-login");
        logger.trace("You are logging in as " + config.credentials.username);
    }

    function openChatbox() {
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

    function read() {

    }

    function write() {

    }

}
