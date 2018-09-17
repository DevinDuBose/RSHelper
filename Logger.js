const config = require('./Config');

class Logger {
    static trace(message) {
        console.log("[" /*+ this.getDateTime()*/ + "][TRACE]: " + message);
    }

    static debug(message) {
        if (config.configs.debug == "true") {
            console.log("[" /*+ this.getDateTime()*/ + "][DEBUG]: " + message);

        }
    }

    static error(message) { //write this to a file later cba to now.
        console.log("[" + this.getDateTime() + "][ERROR]: " + message);
    }

    getDateTime() {
        let date = new Date();
        return date.getUTCFullYear() + ":" + ("0" + (date.getUTCMonth() + 1)).slice(-2) + ":" + ("0" + date.getUTCDate()).slice(-2) + ":" + ("0" + date.getUTCHours()).slice(-2) + ":" + ("0" + date.getUTCMinutes()).slice(-2) + ":" + ("0" + date.getUTCSeconds()).slice(-2);
    }
}

module.exports = Logger;
