const Discord = require('discord.js');
const client = new Discord.Client();

const roles = ["691714223960490004", "691714267614806027", "691714273822638091", "691714276552999024", "691714278008553474", "691714280394981488"]
const student = "691702077339992138";
const teacher = "691702216444215338";

console.log(client);

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    if (msg.content.startsWith('!!split') && msg.member.roles.highest.id === teacher) {
        msg.guild.members.fetch().then(function(result) {
            var members = result;
            members = activeStudents(members);
            members = shuffle(members);
            assignRandomRoles(members, msg.guild);
        });
        
        msg.reply('Students split into breakout rooms!');
    }

    if (msg.content.startsWith('!!combine') && msg.member.roles.highest.id === teacher) {
        msg.guild.members.fetch().then(function(result) {
            removeRoles(result, msg.guild);
        });

        msg.reply('Students removed from breakout rooms!');
    }
});

function removeRoles(members, guild) {
    for (const k of members.values()) {
        for (const r of k.roles.cache) {
            for (const i of roles) {
                if (r[0] === i) {
                    k.roles.remove(r);
                }
            }
        }
    }
}

function assignRandomRoles(members, guild) {
    var index = 0;
    for (const k of members.values()) {
        guild.roles.fetch(roles[index]).then(function (result) {
            k.roles.add(result);
        });
        
        index++;
        if (index > roles.length) {
            index = 0;
        }
    }
}

function activeStudents(map) {
    var newMap = []
    for (const k of map.values()) {
        if (k.presence.status === 'online' && k.roles.highest.id === student) {
            newMap.push(k);
        }
    }

    return newMap;
}

function shuffle(array) {
    var m = array.length, t, i
    while (m) {
        i = Math.floor(Math.random() * m--);
        t = array[m];
        array[m] = array[i];
        array[i] = t;
    }

    return array;
}

client.login(process.env.BOT_TOKEN);