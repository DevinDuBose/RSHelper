const puppeteer = require("puppeteer");

class AsyncBrowser {
    let browser;
    let page;
    let frame;

    constructor() {
        browser = await puppeteer.launch({
            args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-web-security", "--user-data-dir"]
        });
        page = await browser.newPage();
        Logger.trace("Browser launched.");
    }

    close() {
        browser.close();
        Logger.trace("Browser closed.");
    }

    async goTo(url) {
        try {
            await page.goto(url);
            return true;
        } catch (e) {
            Logger.trace("Failed to navigate to: " + url);
            return false;
        }
    }

    async setFrame(index) {
        try {
            frame = await page.frames()[index];
            return true;
        } catch (e) {
            Logger.trace("Failed to set the frame from the requested page.");
            return false;
        }
    }

    async type(frame, selector, input) {
        try {
            await frame.type(selector, input);
            return true;
        } catch (e) {
            let nullFrame = frame == undefined ? true : false;
            nullFrame == true ? Logger.trace("Unable to type to input in a null frame.") : Logger.trace("Failed to type input in the selector: " + selector);
            return false;
        }
    }

    async click(frame, selector) {
        try {
            await frame.click(selector);
            return true;
        } catch (e) {
            let nullFrame = frame == undefined ? true : false;
            nullFrame == true ? Logger.trace("Unable to click buttons in a null frame.") : Logger.trace("Failed to click a selector with the value: " + selector);
            return false;
        }
    }

    async function waitForSelector(selector, timeout, hidden) {
        try {
            await frame.waitForSelector(selector, {
                timeout: timeout,
                hidden: hidden
            });
            return true;
        } catch (e) {
            Logger.trace("Taking too long to load, timed out.");
            return false;
        }
    }

}
