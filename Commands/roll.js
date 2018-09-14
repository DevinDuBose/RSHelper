modules.exports = function (companionApp, commandName, args, author) {
    companionApp.writeQueue.push(author.replace('_', ' ') + ', you rolled a ' + Math.ceil(Math.random() * 100) + '!')
};
