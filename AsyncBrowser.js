const puppeteer = require("puppeteer");
const logger = require('./Logger');

class AsyncBrowser {

    constructor() {
        var browser;
        var page;
        var frame;

        this.launch();
        logger.debug("Constructing a browser object.");

    }

    async launch() {
        this.browser = await puppeteer.launch({
            args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-web-security", "--user-data-dir"]
        });
        this.page = await this.browser.newPage();
        logger.debug("Browser launched.");
    }

    close() {
        this.browser.close();
        logger.trace("Browser closed.");
    }

    async goTo(url) {
        try {
            await this.page.goto(url);
            return true;
        } catch (e) {
            logger.trace("Failed to navigate to: " + url);
            return false;
        }
    }

    async setFrame(index) {
        try {
            this.frame = await page.frames()[index];
            return true;
        } catch (e) {
            logger.trace("Failed to set the frame from the requested page.");
            return false;
        }
    }

    async type(selector, input) {
        try {
            await this.frame.type(selector, input);
            return true;
        } catch (e) {
            let nullFrame = this.frame == undefined ? true : false;
            nullFrame == true ? logger.trace("Unable to type to input in a null frame.") : logger.trace("Failed to type input in the selector: " + selector);
            return false;
        }
    }

    async click(selector) {
        try {
            await this.frame.click(selector);
            return true;
        } catch (e) {
            let nullFrame = this.frame == undefined ? true : false;
            nullFrame == true ? logger.trace("Unable to click buttons in a null frame.") : logger.trace("Failed to click a selector with the value: " + selector);
            return false;
        }
    }

    async waitForSelector(selector, timeout, hidden) {
        try {
            await this.frame.waitForSelector(selector, {
                timeout: timeout,
                hidden: hidden
            });
            return true;
        } catch (e) {
            logger.trace("Taking too long to load, timed out.");
            return false;
        }
    }

}

module.exports = AsyncBrowser;
