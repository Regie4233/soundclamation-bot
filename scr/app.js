require('dotenv').config();
const { REST } = require('@discordjs/rest');
const commandJoin = require('./commands/join');
const { VoiceConnectionStatus, AudioPlayerStatus, createAudioPlayer, NoSubscriberBehavior, createAudioResource, joinVoiceChannel } = require('@discordjs/voice');
const { addSpeechEvent } = require("discord-speech-recognition");
const { Client, Events, GatewayIntentBits, Routes } = require('discord.js');
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates,
    ],
});
addSpeechEvent(client);

client.once(Events.ClientReady, c => {
    console.log(`Ready! Logged in as ${c.user.tag}`);

});

async function Initialize_Bot() {
    try {
        const commands = [
            commandJoin.data.toJSON()
        ];
        console.log('Started refreshing application (/) commands.');
        await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), { body: commands },);
        client.login(process.env.TOKEN);
    } catch (e) {
        console.log(e);
    }
}
Initialize_Bot();



client.on(Events.InteractionCreate, (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    if (interaction.commandName === 'join') {
        let audioRunning = false;
        const selectedChannel = interaction.options.getChannel('channel');

        const connection = joinVoiceChannel({
            channelId: selectedChannel.id,
            guildId: process.env.GUILD_ID,
            adapterCreator: interaction.guild.voiceAdapterCreator,
        });

        connection.on(VoiceConnectionStatus.Ready, (oldState, newState) => {
            console.log('Connection is in the Ready state!');
        });


            client.on("speech", (msg) => {
                if(audioRunning) {return;}
                const resource = createAudioResource('./scr/audio/joncena.mp3');
                const player = createAudioPlayer({
                    behaviors: {
                        noSubscriber: NoSubscriberBehavior.Pause,
                    },
                });

                connection.subscribe(player);

                if (msg.author.id === '726243976927248412') {
                    // console.log(msg.content);
                    const str = msg.content;
                    console.log(str);
                    if (str === undefined) { return; }
                    if (str.includes('john cena') || str.includes('cena') || str.includes('test')) {
                        player.play(resource);
                        console.log('cena activated');
                    }

                }


                player.on(AudioPlayerStatus.Idle, () => {
                    console.log('Audio player is in the IDLE state!');
                    audioRunning = false;
                });
                player.on(AudioPlayerStatus.Playing, () => {
                    console.log('Audio player is in the Playing state!');
                    audioRunning = true;

                });
            });
        

    }
});




// player.on(AudioPlayerStatus.Playing, (oldState, newState) => {
//     console.log('Audio player is in the Playing state!');
// });