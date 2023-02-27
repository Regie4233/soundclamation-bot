const { SlashCommandBuilder, ChannelType } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('join')
		.setDescription('Opens a request form')
        .addChannelOption((option) => option.setName('channel').setDescription('The channel to join').setRequired(true).addChannelTypes(ChannelType.GuildVoice) )
};