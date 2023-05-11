require("dotenv").config()
const discord = require("discord.js")
// const fetch = require("node-fetch")


const intents = {
    intents: [
        discord.IntentsBitField.Flags.Guilds
    ]
}
const client = new discord.Client(intents)


client.on("ready", () => {
    console.log("[info]\tDiscord bot werkt")
    console.log(`[info]\tInvite url: https://discord.com/api/oauth2/authorize?client_id=${process.env.CLIENT_ID}&permissions=${process.env.PERMISSIONS}&scope=applications.commands`)
})


client.on("message", msg => {
    if (msg.content === "ping") {
        msg.reply("pong")
    }
})


client.login(process.env.TOKEN)