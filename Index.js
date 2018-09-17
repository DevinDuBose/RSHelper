const companionApp = require('./CompanionApp');
const config = require('./Config');
const logger = require('./Logger');

const commandPrefix = config.configs.commandPrefix;
const app = new companionApp();

while (companionApp.connected == true) {
    companionApp.read();

    if (companionApp.readQueue.length > 0) {
        let currentCommand = companionApp.readQueue[0];
        let args = currentCommand.split(' ');

        //playername (prefix)command trailing_args go over here reeee
        if (args[1].startsWith(commandPrefix)) {
            let author = args[0];
            let commandName = args[1].replace(commandPrefix, '');
            Logger.trace("Found command name [" + commandName + "]");
            handleCommand(companionApp, commandName, args, author);
        }
    }
}

function handleCommand(companionApp, commandName, args, author) {
    try {
        require('./Commands/' + commandName)(companionApp, commandName, args, author);
    } catch (e) {
        Logger.trace("Failed to require command: " + e);
    }
}
