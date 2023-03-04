require('dotenv').config();
const { REST } = require('@discordjs/rest');
const commandJoin = require('./commands/join');
const { VoiceConnectionStatus, AudioPlayerStatus, createAudioPlayer, NoSubscriberBehavior, createAudioResource, joinVoiceChannel } = require('@discordjs/voice');
const { addSpeechEvent } = require("discord-speech-recognition");
const { Client, Events, GatewayIntentBits, Routes, GuildHubType } = require('discord.js');
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
const player = createAudioPlayer({
    behaviors: {
        noSubscriber: NoSubscriberBehavior.Pause,
    },
});
let audioRunning = false;
client.on("speech", (msg) => {
    const str = msg.content;
    if (audioRunning) { return; }
    if (msg.author.id === '723447508407156817' || msg.author.id === '726243976927248412') {

        console.log(str);
        if (str === undefined) { return; }
        if (str.includes('John Cena')) {
            const resc = createAudioResource('./scr/audio/joncena.mp3');
            player.play(resc);
            console.log('cena activated');
        } else if (str.includes('camper') || str.includes('tunnel') || str.includes('camping')) {
            const resc = createAudioResource('./scr/audio/boring.mp3');
            player.play(resc);
            console.log('boring activated');
        } else if (str.includes(`let's go`) || str.includes('the house')) {
            const resc = createAudioResource('./scr/audio/airhorn.mp3');
            player.play(resc);
            console.log('horn activated');
        } else if (str.includes('drum roll')) {
            const resc = createAudioResource('./scr/audio/drumroll.mp3');
            player.play(resc);
            console.log('drum activated');
        } else if (str.includes('amazing')) {
            const resc = createAudioResource('./scr/audio/omgwow.mp3');
            player.play(resc);
            console.log('omg activated');
        } else if (str.includes('forever') || str.includes('too slow')) {
            const resc = createAudioResource('./scr/audio/twohours.mp3');
            player.play(resc);
            console.log('2hrs activated');
        } else if (str.includes('number one stun') || str.includes('stunner')) {
            const resc = createAudioResource('./scr/audio/stunner.mp3');
            player.play(resc);
            console.log('stunner activated');
        } else if (str.includes('kidding') || str.includes('joke') || str.includes('joking')) {
            const resc = createAudioResource('./scr/audio/jokedrum.mp3');
            player.play(resc);
            console.log('joke drum activated');
        } else if (str.includes('give it up') || str.includes('applause')) {
            const resc = createAudioResource('./scr/audio/applause.mp3');
            player.play(resc);
            console.log('applause activated');
        } else if (str.includes(`I'm coming`) || str.includes(`i'm coming`)) {
            const resc = createAudioResource('./scr/audio/yamate.mp3');
            player.play(resc);
            console.log('yamate activated');
        } else if (str.includes('but why') || str.includes('why did you')) {
            const resc = createAudioResource('./scr/audio/haiya.mp3');
            player.play(resc);
            console.log('haiya activated');
        } else if (str.includes('eat this') || str.includes('eat it') || str.includes('suck it')) {
            const resc = createAudioResource('./scr/audio/gulp.mp3');
            player.play(resc);
            console.log('gulp activated');
        } else if (str.includes('here run') || str.includes('time to run')) {
            const resc = createAudioResource('./scr/audio/run.mp3');
            player.play(resc);
            console.log('run activated');
        } else if (str.includes('awesome')) {
            const resc = createAudioResource('./scr/audio/animewow.mp3');
            player.play(resc);
            console.log('animewow activated');
        } else if (str.includes('sexy')) {
            const resc = createAudioResource('./scr/audio/whispers.mp3');
            player.play(resc);
            console.log('careless whisper activated');
        } else if (str.includes('booty') || str.includes('butt') || str.includes('ass')) {
            const resc = createAudioResource('./scr/audio/wiggle.mp3');
            player.play(resc);
            console.log('wiggle activated');
        } else if (str.includes('thug') || str.includes('gangster')) {
            const resc = createAudioResource('./scr/audio/snoopy.mp3');
            player.play(resc);
            console.log('snoopdpg activated');
        } else if (str.includes('money') || str.includes('rich')) {
            const resc = createAudioResource('./scr/audio/kaching.mp3');
            player.play(resc);
            console.log('kaching activated');
        } else if (str.includes('celebration')) {
            const resc = createAudioResource('./scr/audio/celebration.mp3');
            player.play(resc);
            console.log('celebration whisper activated');
        } else if (str.includes('give it to me') || str.includes('give it to you')) {
            const resc = createAudioResource('./scr/audio/yesdaddy.mp3');
            player.play(resc);
            console.log('yes daddy activated');
        }
    }
});

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

        const resc = createAudioResource('./scr/audio/dahub.mp3');
        player.play(resc);

        const selectedChannel = interaction.options.getChannel('channel');

        const connection = joinVoiceChannel({
            channelId: selectedChannel.id,
            guildId: process.env.GUILD_ID,
            adapterCreator: interaction.guild.voiceAdapterCreator,
        });

        connection.on(VoiceConnectionStatus.Ready, (oldState, newState) => {
            console.log('Connection is in the Ready state!');
        });

        connection.subscribe(player);
        player.on(AudioPlayerStatus.Idle, () => {
            console.log('Audio player is in the IDLE state!');
            audioRunning = false;
        });
        player.on(AudioPlayerStatus.Playing, () => {
            console.log('Audio player is in the Playing state!');
            audioRunning = true;

        });

        
    }
});



