const { SlashCommandBuilder } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Gives back a list with all available commands!'),
    
    async execute(interaction) {
        await interaction.reply("Je moeder")
    }
}