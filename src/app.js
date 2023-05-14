require("dotenv").config()
const fs = require('node:fs');
const path = require('node:path')
const discord = require("discord.js")
const fetch = require("node-fetch")


const commandPrefix = "!";
const intents = {
    intents: [
        discord.IntentsBitField.Flags.Guilds,
        discord.IntentsBitField.Flags.GuildMessages,
        discord.IntentsBitField.Flags.MessageContent,
    ]
}
const client = new discord.Client(intents)
const commandsPath = path.join(__dirname, '../commands');
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
    console.log(`[info]\tInvite url: https://discord.com/api/oauth2/authorize?client_id=${process.env.CLIENT_ID}&permissions=${process.env.PERMISSIONS}&scope=bot%20applications.commands`)

    // console.log(client.guilds.cache.get(process.env.SERVER_ID).users) //.get('382854499141812224').send("hello")
    client.guilds.cache.get(process.env.SERVER_ID).channels.cache.get(process.env.CHANNEL_ID).send("Henkers")
})

// and deploy your commands!
// async function test() {
// 	try {
// 		console.log(`Started refreshing ${commands.length} application (/) commands.`);

// 		// The put method is used to fully refresh all commands in the guild with the current set
// 		// const data = await rest.put(
// 		// 	discord.Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.SERVER_ID),
// 		// 	{ 
//         //         body: commands 
//         //     },
// 		// );

// 		// console.log(`Successfully reloaded ${data.length} application (/) commands.`);
// 	} catch (error) {
// 		// And of course, make sure you catch and log any errors!
// 		console.error(error);
// 	}
// }

// test()


client.on(discord.Events.MessageCreate, message => {
    console.log("henk")
    if (message.channel.id === process.env.CHANNEL_ID && !message.author.bot && message.content.startsWith(commandPrefix)) {
        // The message was sent in the specific channel
        console.log(`Message received in ${message.channel.name}: ${message.content}`)
        message.channel.send("Yo mamaaaa")
    }


    // message.guilds.cache.get(process.env.SERVER_ID).channels.cache.get(process.env.CHANNEL_ID).send("Je moeder")
    
})


client.on(discord.Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;
    console.log("Interaction create");
    console.log(interaction.commandName)

    const command = interaction.client.commands.get(interaction.commandName)
    if (!command) {
        console.error(`[error]\tNo matching command: ${interaction.commandName} was found!\n`)
    }

    try {
        await command.execute(interaction)
    } catch (error) {

    }
})


client.on('error', (error) => {
    console.error('Bot encountered an error:', error);
})


client.login(process.env.TOKEN)
