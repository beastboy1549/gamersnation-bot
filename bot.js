const Discord = require("discord.js");
const footer = "Gamer Nation's Bot | Made and developed by Floxylak#7882"
const fs = require("fs");
const ms = require("ms");

const bot = new Discord.Client({disableEveryone: true});

bot.on("ready", async () => {
  console.log(`${bot.user.username} is online!`);
  //bot.user.setActivity("Elite Clan", {type: "WATCHING"});

  let statuses = [
    "gn!Help for help!",
    `over ${bot.users.size} users!`,
    `Dm me with Help to create a ticket!`
  ]

  setInterval(function() {
    let status = statuses[Math.floor(Math.random() * statuses.length)];
    bot.user.setActivity(status, {type: "WATCHING"});
  }, 5000)

});

bot.on("guildMemberAdd", member =>{

  let role = member.guild.roles.find(role => role.name === "Unverified");
  let welcomechannel = member.guild.channels.find(channel => channel.name === "👋join-leave👋")
  member.addRole(role.id);

  let joinembed = new Discord.RichEmbed()
  .setColor("#1dff00")
  .addField(`Welcome to the army, ${member.user.username}!`, `Please have a look at the rules (<#567301256226537492>), keep the chat friendly. Welcome to GamersNation`)
  .setFooter(footer)
  .setThumbnail(`${member.user.avatarURL}`)
  .setTimestamp();
  welcomechannel.send(joinembed);

  let dmjoinembed = new Discord.RichEmbed()
  .setColor("#1dff00")
  .addField("Welcome to GamersNation", `please have a look at <#567301256226537492>. do gn!agree at <#567301256226537492> to verify and view the whole cool server!`)
  .setFooter(footer)
  .setThumbnail(`${member.user.avatarURL}`)
  .setTimestamp();
  member.send(dmjoinembed);
});

bot.on('guildMemberRemove', member => {

  let welcomechannel = member.guild.channels.find(channel => channel.name === "👋join-leave👋")

  let joinembed = new Discord.RichEmbed()
  .setColor("#f44242")
  .addField(`Our true member ${member.user.username} left us alone.`, `One person leaves, two persons cry.
     :cry: F in the chat for ${member.user.username} :cry: `)
  .setFooter(footer)
  .setThumbnail(`${member.user.avatarURL}`)
  .setTimestamp();
  welcomechannel.send(joinembed);

  let dmjoinembed = new Discord.RichEmbed()
  .setColor("#f44242")
  .addField("You left the gang!", `You left us alone crying. Join back using this invite please.`)
  .setFooter(footer)
  .setThumbnail(`${member.user.avatarURL}`)
  .setTimestamp();
  member.user.send(dmjoinembed);
  member.user.send("https://discord.gg/NVyuUvx");
});

bot.on("message", async message => {
  if (message.author.bot) return;

  let prefix = "gn!"
  let messageArray = message.content.split(" ");
  let cmd = messageArray[0].toLowerCase();
  let args = messageArray.slice(1);
  var msg = message.content.toLowerCase();


  if(cmd === `${prefix}info`){

      let sicon = message.guild.iconURL;
      let serverembed = new Discord.RichEmbed()
      .setDescription("Server Information")
      .setColor("#15f153")
      .setThumbnail(sicon)
      .addField("Server Name", message.guild.name, true)
      .addField("Owned By :", message.guild.owner, true)
      .addField("Created On", message.guild.createdAt, true)
      .addField("You Joined", message.member.joinedAt, true)
      .addField("Total Members", message.guild.memberCount, true)
      .setFooter(footer)
      .setTimestamp();

       message.channel.send(serverembed);
  }


  if(cmd === `${prefix}8ball`){
  if (!args[2]) return message.reply("Please ask a full question");
  let replies = ["Yes.", "No.", "I Dont Know.", "Ask Again Later"];

  let result = Math.floor((Math.random() * replies.length));
  let question = args.slice(1).join(" ");

  let ballembed = new Discord.RichEmbed()
  .setAuthor(message.author.tag)
  .setColor("#FF9900")
  .addField("Answer", replies[result]);

  message.channel.send(ballembed);


  }

  if(cmd === `${prefix}mute`){
    let tomute = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(!tomute) {
      let nouserlol = new Discord.RichEmbed()
      .setColor("#ff0000")
      .addField("Usage", `${prefix}mute <user> <time>`)
      .setFooter(footer)
      .setTimestamp();
      message.channel.send(nouserlol);
    }
    if(tomute.hasPermission("MANAGE_MESSAGES")) return message.reply("Can't mute them!");
    let muterole = message.guild.roles.find(`name`, "muted");
    let normalrole = message.guild.roles.find(`name`, "Member");
    //start of create role
    if(!muterole){
      try{
        muterole = await message.guild.createRole({
          name: "muted",
          color: "#000000",
          permissions:[]
        })
        message.guild.channels.forEach(async (channel, id) => {
          await channel.overwritePermissions(muterole, {
            SEND_MESSAGES: false,
            ADD_REACTIONS: false
          });
        });
      }catch(e){
        console.log(e.stack);
      }
    }
    //end of create role
    let mutetime = args[1];
    if(!mutetime) return message.reply("You didn't specify a time!");

    await(tomute.addRole(muterole.id));
    await(tomute.removeRole(normalrole.id));
    message.reply(`<@${tomute.id}> has been muted for ${ms(ms(mutetime))}`);
    tomute.send(`You were muted in ||**${message.guild.name}**|| by **${message.author.username}#${message.author.discriminator}** for ` +  "``" + `${mutetime}` + "``!")

    setTimeout(function(){
      tomute.removeRole(muterole.id);
      tomute.addRole(normalrole.id);
      message.channel.send(`<@${tomute.id}> has been unmuted!`)
    }, ms(mutetime));


  }


  if (message.channel.type === "dm") {
    if(message.content.includes("Help")){
           const filter = m => m.author.id === message.author.id;
           let Cguild =  bot.guilds.get("519070256849879041")
           let UserS = message.author.username.toLowerCase();
           let alreadychannel = Cguild.channels.find(channel => channel.name === UserS);
           if(alreadychannel){
             message.reply("Help channel already opened.")
           }
           if(!alreadychannel){
           message.reply("Hello, How can i help you? type ``cancel`` to cancel it.").then(r => r.delete(40000));

           await message.channel.awaitMessages(filter, {max: 1, time: 60000}).then(async collected => {
             if (collected.first().content === 'cancel') {
             return message.reply("Canceled.");
           }

             let rquestion = collected.first().content
             let guild =  bot.guilds.get("519070256849879041")
             var channel;
             var Member;
             channel = await guild.createChannel(`${message.author.username}`, "text").catch(ex => console.error(ex));
             channel.setParent('569134936137662479')
             var newMessage = await channel.send("To close this ticket, Please follow it with a ``gn!close`` command!")
             var Roles = bot.guilds.find(x => x.id === "519070256849879041").roles.array();
             var AuthorRole = await newMessage.guild.createRole({
               name: message.author.username.toLowerCase()
             }).catch(ex => console.error(ex));
             Roles.forEach(async(role) => {
               await channel.overwritePermissions(role,{
                 READ_MESSAGES: false,
                 VIEW_CHANNEL: false,
               });
             });
             channel.overwritePermissions(AuthorRole, {
               READ_MESSAGES: true,
               VIEW_CHANNEL: true
             });
             let plr = bot.guilds.get("519070256849879041").member(message.author)
             let RoleID = AuthorRole.id
             plr.addRole(AuthorRole);
             let playerEmbed = new Discord.RichEmbed()
              .setAuthor("Ticket")
              .setColor("#fc6400")
              .setDescription("Ticket Opened message")
              .addField("Ticket opened Successfully", "A Mod will be in contact with you soon!")
              .addField("Question", rquestion)
              .addField("Mod Response", "You will be notified once responded")

              let modEmbed = new Discord.RichEmbed()
             .setAuthor("Ticket Opened")
             .setColor("#006bb3")
             .setDescription("New Ticket Opened")
             .addField("Question", rquestion)
             .addField("Opened By", message.author.username)

             message.reply(playerEmbed)
             channel.send(modEmbed)



           }).catch(err => {
             console.log(err)
           })
         }
         }
         }

         if (cmd === `${prefix}close`) {
           let RoleID = message.guild.roles.find(role => role.name === message.channel.name)
           let closerole = message.guild.roles.get(`${RoleID.id}`)
           let userticket = message.guild.members.find(member => member.displayName.toLowerCase() === message.channel.name.toLowerCase());
           if(message.channel.parentID === "569134936137662479"){
             if(userticket){
               userticket.send("Your ticket was closed.")
             }
           if(!userticket){
             message.guild.owner.send(`I couldn't find the user of the ticket named: (${message.channel.name}), With an ID of: (${message.channel.id}). I'm sorry for not being able to dm him, boss.`)
           }
           message.channel.delete()
           closerole.delete()
           }

         }



         if(cmd === `${prefix}unmute`){
           let tounmute = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
           let normalrole = message.guild.roles.find(`name`, "Member");
           if(!tounmute){
             let nomuserlol = new Discord.RichEmbed()
             .setColor("#ff0000")
             .addField("Usage", `${prefix}unmute <user>`)
             .setFooter(footer)
             .setTimestamp();
             message.channel.send(nomuserlol);
           }
           if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("Cant do That..");
           let tounmuteroles = tounmute.roles.find(role => role.name === "muted")
           if(!tounmuteroles) return message.reply("That user doesnt seem muted.");
           let muterole = message.guild.roles.find(`name`, "muted");

           await(tounmute.removeRole(muterole.id));
           tounmute.addRole(normalrole.id);
           message.reply(`<@${tounmute.id}> has been unmuted.`);
         }


         if(cmd === `${prefix}kick`){
         let KUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
         if(!KUser){
           let NotFoundEmbed = new Discord.RichEmbed()
           .setColor("#ff0000")
           .addField("Usage:", `${prefix}kick <user> <reason>`)
           .setFooter(footer)
           .setTimestamp();
           message.channel.send(NotFoundEmbed);
         }
         let kreason = args.join(" ").slice(22);
         if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("No can do pal!");
         if(KUser.hasPermission("MANAGE_MESSAGES")) return message.channel.send("That person can't be kicked!");


         let kickEmbed = new Discord.RichEmbed()
         .setDescription("~~Kick~~")
         .setColor("#e56b00")
         .addField("Kicked User", `${KUser} with ID ${KUser.id}`)
         .addField("Kicked By", `<@${message.author.username}> with ID ${message.author.id}`)
         .addField("Kicked in", message.channel)
         .addField("Time", message.createdAt)
         .addField("Reason", kreason);

         let kickChannel = message.guild.channels.find(`name`, "moderation-log");
         if(!kickChannel) return message.channel.send("Can't find the log channel.");
         KUser.send(`You were kicked From ${message.guild.name} For ${kreason} By ${message.author.username} + ${message.author.discriminator}.`)


         message.guild.member(KUser).kick(kreason);
         kickChannel.send(kickEmbed);
         message.channel.send(`${KUser} was successfully kicked from this server.`)


   return;
 }


if(cmd === `${prefix}ban`){
  let bUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(!bUser){
      let NotFoundBEmbed = new Discord.RichEmbed()
      .setColor("#ff0000")
      .addField("Usage:", `${prefix}ban <user> <reason>`)
      .setFooter(footer)
      .setTimestamp();
      message.channel.send(NotFoundBEmbed);
    }
    let bReason = args.join(" ").slice(22);
    if(!message.member.hasPermission("MANAGE_MEMBERS")) return message.channel.send("No can do pal!");
    if(bUser.hasPermission("MANAGE_MESSAGES")) return message.channel.send("That person can't be kicked!");

    let banEmbed = new Discord.RichEmbed()
    .setDescription("~Ban~")
    .setColor("#bc0000")
    .addField("Banned User", `${bUser} with ID ${bUser.id}`)
    .addField("Banned By", `<@${message.author.id}> with ID ${message.author.id}`)
    .addField("Banned In", message.channel)
    .addField("Time", message.createdAt)
    .addField("Reason", bReason);

    let incidentchannel = message.guild.channels.find(`name`, "moderation-log");
        bUser.send(`You were banned From ${message.guild.name} For ${breason} By ${message.author.username} + ${message.author.discriminator}.`)
    if(!incidentchannel) return message.channel.send("Can't find the log channel.");

    message.guild.member(bUser).ban(bReason);
    incidentchannel.send(banEmbed);
    message.channel.send(`${BUser} was successfully BANNED from this server.`)


    return;
}


if(cmd === `${prefix}shout`){
  if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("You don't have permission to use this command.")
  let shout = args.join(" ")
  if(!shout){
    let NotFoundSEmbed = new Discord.RichEmbed()
    .setColor("#ff0000")
    .addField("Usage:", `${prefix}shout <Your shout>`)
    .setFooter(footer)
    .setTimestamp();
    message.channel.send(NotFoundSEmbed);
  }
  message.reply("Successfully Shouted your announcement.")
  bot.guilds.get(message.guild.id).members.forEach(member1 => {
    console.log("Dm'ed one person.")
    member1.send(shout)
  })

}



if(cmd === `${prefix}agree`){
  if(message.channel.id === '567301256226537492'){

    const fanrole = message.guild.roles.find(`name`, "Member");
    const UV = message.guild.roles.find(`name`, "Unverified")
    let verifieduser = message.author.username
    await(message.member.addRole(fanrole.id));
    await(message.member.removeRole(UV.id));
    message.delete()
    message.author.send(`You got verified in GamersNation Hangout.`);
} return;
}

if(!message.content.includes(`${prefix}agree`)){
  if(message.channel.name === "❕rules❕"){
    message.delete()
  }
}

if(cmd === `${prefix}avatar`){
  let avaterPlr = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
  if(!avaterPlr){
    let NotFoundOEmbed = new Discord.RichEmbed()
    .setColor("#ff0000")
    .addField("Usage:", `${prefix}avatar <user>`)
    .setFooter(footer)
    .setTimestamp();
    message.channel.send(NotFoundOEmbed);
  }

  let avaterEmbed = new Discord.RichEmbed()
  .setColor("#e56b00")
  .setAuthor(avaterPlr.user.username + "'s Avater Picture", message.guild.iconURL)
  .setImage(avaterPlr.user.displayAvatarURL)
  .setTimestamp()
  .setFooter(bot.user.username, bot.user.displayAvaterURL);

  message.channel.send(avaterEmbed);
}

if(cmd === `${prefix}help`){

  message.author.send("``GamersNation Bot Commands, Made By Floxylak#7882.``")
  let helpembed = new Discord.RichEmbed()
  .setColor("#00ff08")
  .setDescription("Thank you for choosing GamersNation.")
  .addField(`Fun commands`, `gn!8ball <Question> - **Asks the bot a question.**
    ↽————————⇁
    gn!cat - **Gets a random photo of a cat.**
    ↽————————⇁
    gn!dog - **Gets a random photo of a dog**
    ↽————————⇁
    gn!meme - **Gets a random meme**
    ↽————————⇁
    gn!rps - **Plays rock, papar, and CIZZORZ**
    ↽————————⇁
    gn!avater <user> - **Gets the avatar of the user**
    ↽————————⇁
    gn!joke - **Says a random joke.**
    ↽————————⇁
    gn!updates - **Gets the latest bot + server updates.**`, true)
  .addField(`-----------------------------------------------
    Mod commands`, `gn!Mute <user> <time> - **Mutes a user.**
    ↽————————⇁
    gn!warn <user> <reason> - **Warns a user**
    ↽————————⇁
    gn!ban <user> <reason> - **Bans a user**
    ↽————————⇁
    gn!clearwarns <user> - **Clears warns**
    ↽————————⇁
    gn!clear <amount> - **Purges a certain amount of messages**
    ↽————————⇁
    gn!unmute <user> - **unmutes a user**
    ↽————————⇁
    gn!unban <user> - **unbans a user**
    ↽————————⇁
    gn!report <user> <report> - **reports an admin/user.**
    ↽————————⇁
    gn!kick <user> <reason> - **kicks a user**`, true)
    .setFooter(footer)
    .setTimestamp();

    let loltruelmao = new Discord.RichEmbed()
    .setColor("#00ff08")
    .setDescription(`✅ Sent a DM containing help information!`)
    .setFooter(footer)
    .setTimestamp();

    message.react('💯')
    message.channel.send(loltruelmao)
    message.author.send(helpembed);
}

if(cmd === `${prefix}clear`){
  message.delete()
  if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("You dont seem to have the permission.").then(msg => msg.delete(2000));
  if(!args[0]) return message.reply("Please add a valid number.").then(msg => msg.delete(2000))
  if(args[0] > 100) return message.channel.send("Please supply a number less than 100.").then(msg => msg.delete(2000));
  message.channel.bulkDelete(args[0]).then(() => {
    message.channel.send(`Cleared ${args[0]} messages.`).then(msg => msg.delete(2000));
  });

}

if(cmd === `${prefix}updates`){
  let UpdatesEmbed = new Discord.RichEmbed()
  .addField("Updates:", `- Added new rps command! Play rock, Paper, and cizzorz with the bot! Charge on the new rps command.
  - Added new report command! You can now report users/admins or anyone for breaking the rules!
  - Added new joke command! Do gn!joke for a random joke :wink:`)
  .setColor("#00faff")
  .setFooter(footer)
  .setTimestamp();
  message.channel.send(UpdatesEmbed)
}

if(cmd === `${prefix}rps`){
  let replies = ["Rock", "Paper", "cizzorz"];

  let result = Math.floor((Math.random() * replies.length));
  let question = args.slice(1).join(" ");

  let ballembed = new Discord.RichEmbed()
  .setAuthor(message.author.tag)
  .setColor("#FF9900")
  .addField("Answer", replies[result]);

  message.channel.send(ballembed);
}

if(cmd === `${prefix}report`){


    let rUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(!rUser){
      let NotFoundLEmbed = new Discord.RichEmbed()
      .setColor("#ff0000")
      .addField("Usage:", `${prefix}report <user> <reason/report>`)
      .setFooter(footer)
      .setTimestamp();
      message.channel.send(NotFoundLEmbed);
    }
    let rreason = args.join(" ").slice(22);

    let reportEmbed = new Discord.RichEmbed()
    .setDescription("Reports")
    .setColor("#15f153")
    .addField("Reported User", `${rUser} with ID: ${rUser.id}`)
    .addField("Reported By", `${message.author} with ID: ${message.author.id}`)
    .addField("Channel", message.channel)
    .addField("Time", message.createdAt)
    .addField("Reason", rreason);

    let reportschannel = message.guild.channels.find(`name`, "reports");
    if(!reportschannel) return message.channel.send("Couldn't find reports channel.");

    message.delete().catch(O_o=>{});
    message.channel.send("Successfully Reported " + `${rUser.id}` + " for " + rreason)
    reportschannel.send(reportEmbed);
  }

if(cmd === `${prefix}xgjfguhgkkk`){
  message.delete()
  let LOChannel = bot.channels.get("567302787327852554")
  LOChannel.send("The bot was just updated! Do gn!updates, To look at the new features!")
}

if(cmd === `${prefix}joke`){
  message.channel.send("Your life is a joke.")
}

});

bot.login(process.env.BOT_TOKEN);
