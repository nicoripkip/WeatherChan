const fs = require('node:fs');
const path = require('node:path')
const discord = require("discord.js")
const utils = require(path.join(__dirname, "utils.js"))
const config = require(path.join(__dirname, "config.js"))


const commandPrefix = "!";
const intents = {
    intents: [
        discord.IntentsBitField.Flags.Guilds,
        discord.IntentsBitField.Flags.GuildMessages,
        discord.IntentsBitField.Flags.MessageContent,
    ]
}
const client = new discord.Client(intents)
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath);



let commands = new discord.Collection()
for (const file in commandFiles) {
    const filePath = path.join(commandsPath, "help.js")
    // console.log(filePath)
    const command = require(filePath)

    // console.log(command.data.name)

    if ("data" in command && "execute" in command) { //382854499141812224
        commands.set(command.data.name, command)
        // console.log(`[henk]: ${commands.first().data}`)
    } else {
        console.log(`[warning]\tThe command at ${filePath} is missing a required [data] or [execute] tag`)
    }   
}


client.on(discord.Events.ClientReady, client => {
    console.log(`[info]\tBot has logged in as: ${client.user.tag}`)
    console.log(`[info]\tInvite url: https://discord.com/api/oauth2/authorize?client_id=${config.discord.clientID}&permissions=${config.discord.permissions}&scope=bot%20applications.commands`)
})


client.on(discord.Events.MessageCreate, message => {
    console.log("henk")
    if (message.channel.id === config.discord.channelID && !message.author.bot && message.content.startsWith(commandPrefix)) {
        // The message was sent in the specific channel
        console.log(`Message received in ${message.channel.name}: ${message.content}`)
        // message.channel.send("Yo mamaaaa")

            let messages = "lolz";
            message.channel.send(messages)
        })
    }


    // message.guilds.cache.get(process.env.SERVER_ID).channels.cache.get(process.env.CHANNEL_ID).send("Je moeder")
    
})


client.on('error', (error) => {
    console.error('Bot encountered an error:', error);
})


client.login(config.discord.token)
