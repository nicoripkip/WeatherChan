const { SlashCommandBuilder } = require("discord.js")


const data = new SlashCommandBuilder()
    .setName('help')
    .setDescription('Gives back a list with all available commands!')


async function execute(interaction){
    await interaction.reply("Je moeder");
}


module.exports = {
    data: data,
    execute
}