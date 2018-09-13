const config = require("./config.json");

class Logger {
    static trace(message) {
        console.log("[" + getDateTime() + "][TRACE]: " + message);
    }

    static debug(message) {
        if (config.configs.debug == "true") {
            console.log("[" + getDateTime() + "][DEBUG]: " + message);
        }
    }

    static error(message) { //write this to a file later cba to now.
        console.log("[" + getDateTime() + "][ERROR]: " + message);
    }

    static getDateTime() {
        let date = new Date();
        return date.getUTCFullYear() + ":" + ("0" + (date.getUTCMonth() + 1)).slice(-2) + ":" + ("0" + date.getUTCDate()).slice(-2) + ":" + ("0" + date.getUTCHours()).slice(-2) + ":" + ("0" + date.getUTCMinutes()).slice(-2) + ":" + ("0" + date.getUTCSeconds()).slice(-2);
    }
}
