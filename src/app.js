require("dotenv").config()
const fs = require('node:fs');
const path = require('node:path')
const discord = require("discord.js")
// const fetch = require("node-fetch")


const intents = {
    intents: [
        discord.IntentsBitField.Flags.Guilds
    ]
}
const client = new discord.Client(intents)
const commandsPath = path.join(__dirname, '../commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));


client.on(discord.Events.ClientReady, () => {
    console.log(`[info]\tBot has logged in as: ${client.user.tag}`)
    console.log(`[info]\tInvite url: https://discord.com/api/oauth2/authorize?client_id=${process.env.CLIENT_ID}&permissions=${process.env.PERMISSIONS}&scope=bot%20applications.commands`)
})


client.commands = new discord.Collection()
for (const file in commandFiles) {
    const filePath = path.join(commandsPath, file)
    const command = require(filePath)

    if ("data" in command && "execute" in command) {
        client.commands.set(command.data.name, command)
    } else {
        console.log(`[warning]\tThe command at ${filePath} is missing a required [data] or [execute] tag`)
    }
    
}

client.login(process.env.TOKEN)