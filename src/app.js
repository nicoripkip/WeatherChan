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
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath);
const knmiApiUrls = [
    `https://api.dataplatform.knmi.nl/open-data/v1/datasets/Actuele10mindataKNMIstations/versions/2/files`,
    `https://api.dataplatform.knmi.nl/open-data/v1/datasets/radar_forecast/versions/1.0/files`,
]


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




async function getWeatherData(token) {
    const headers = {
        'Authorization':token
    }
    const response = await fetch(knmiApiUrls[1], { headers })
        .then(response => response.json())
        .then(data => {
            console.log(`[info]\tData: ${JSON.stringify(data)}`)
        })
        .catch(error => {
            console.error(error)
        })

    // if (response.status == 200) {
    //     console.log(`[info]\tGot weather data from KNMI!`)
    //     console.log(`[info]\tHeader: ${response.json()}`)
    // }
}


client.on(discord.Events.ClientReady, client => {
    console.log(`[info]\tBot has logged in as: ${client.user.tag}`)
    console.log(`[info]\tInvite url: https://discord.com/api/oauth2/authorize?client_id=${process.env.CLIENT_ID}&permissions=${process.env.PERMISSIONS}&scope=bot%20applications.commands`)

    getWeatherData(process.env.WEATHER_API_TOKEN)
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


client.on('error', (error) => {
    console.error('Bot encountered an error:', error);
})


client.login(process.env.TOKEN)
