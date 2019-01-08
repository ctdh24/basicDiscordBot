const Discord = require('discord.js')
const client = new Discord.Client()

client.on('ready', () => {
    // list all servers
    console.log("Servers:")
    client.guilds.forEach((guild) => {
        console.log(" - " + guild.name)
        // List all channels
        guild.channels.forEach((channel) => {
            console.log(` -- ${channel.name} (${channel.type}) - ${channel.id}`)

            // say hello to specific channel on start
            if(channel.name === "general" && channel.type === "text"){
                var generalChannel = client.channels.get(channel.id)
                generalChannel.send("Hello, world!")
            }
        })
    })
})

  client.on('message', (receivedMessage) => {
      if (receivedMessage.author == client.user) { // Prevent bot from responding to its own messages
          return
      }

      if (receivedMessage.content.startsWith("!")) {
          processCommand(receivedMessage)
      }
  })

function processCommand(receivedMessage){
    let fullCommand = receivedMessage.content.substr(1) // Remove the leading exclamation mark
    let splitCommand = fullCommand.split(" ") // Split the message up in to pieces for each space
    let primaryCommand = splitCommand[0] // The first word directly after the exclamation is the command
    let arguments = splitCommand.slice(1) // All other words are arguments/parameters/options for the command

    console.log("Command received: " + primaryCommand)
    console.log("Arguments: " + arguments) // There may not be any arguments

    if (primaryCommand == "?") {
        helpCommand(arguments, receivedMessage)
    } else if (primaryCommand == "multiply") {
        multiplyCommand(arguments, receivedMessage)
    } else if (primaryCommand == "roll") {
        rollCommand(arguments, receivedMessage)
    } else if (primaryCommand == "stats"){
        rollStatsCommand(arguments, receivedMessage)
    } else {
        receivedMessage.channel.send("I don't understand the command. Type `!?` for a list of commands.")
    }
}

function helpCommand(arguments, receivedMessage) {
    receivedMessage.channel.send("`!roll [dice notation]`")
}

//test command
function multiplyCommand(arguments, receivedMessage) {
    if (arguments.length < 2) {
        receivedMessage.channel.send("Not enough values to multiply. Try `!multiply 2 4 10` or `!multiply 5.2 7`")
        return
    }
    let product = 1
    arguments.forEach((value) => {
        product = product * parseFloat(value)
    })
    receivedMessage.channel.send("The product of " + arguments + " multiplied together is: " + product.toString())
}

//!roll
function rollCommand(arguments, receivedMessage) {
    if (arguments === ""){
        receivedMessage.channel.send("Not enough dice to roll. Try `!roll 1d6` to roll 1 six-sided dice")
        return
    }
    else{
        var sum = 0;
        var resultString = "";
        arguments.forEach((value)=>{
            var regex = /^(\d*)d(\d+)([-+]\d+)*x*(\d+)*/;
            values = value.match(regex).slice(1),
            a = parseInt(values[0]) || 1,
            b = parseInt(values[1]),
            c = parseInt(values[2]) || 0,
            d = parseInt(values[3]) || 1;
            //console.log(d)
            for (j = 0; j < d; j++){
                for (i = 0; i < a; i++){
                    var randomNumber = Math.floor(Math.random() * (b)) + 1;
                    resultString += randomNumber + " + ";
                    sum += randomNumber;
                }
            }
            sum+= c*d;
            if (d === 1) resultString += c + " ";
            else resultString += "("+c + "*" + d + ") ";
        })
        receivedMessage.channel.send(receivedMessage.author.toString() + " has rolled: " + resultString + "= " + sum);
    }
}

function rollStatsCommand(arguments, receivedMessage){
    var diceRolls = [];
    var resultString = "";
    if (arguments == "standard"){
        for (i = 0; i < 6; i++){
            var sum = 0;
            var array4 = [];
            for (j = 0; j < 4; j++){
                array4.push(Math.floor(Math.random() * (6)) + 1);
            }
            array4.sort(function(a, b){return b - a});
            for (j = 0; j < 3; j++){
                sum += array4[j];
            }
            diceRolls.push(sum);
            if(i < 5)
                resultString += sum + ", ";
            else
                resultString += sum;
        }
    } else if (arguments == "classic"){
        for (i = 0; i < 6; i++){
            var sum = 0;
            for (j = 0; j < 3; j++){
                var randomNumber = Math.floor(Math.random() * (6)) + 1;
                sum += randomNumber;
            }
            diceRolls.push(sum);
            if(i < 5)
                resultString += sum + ", ";
            else
                resultString += sum;
        }
    } else if (arguments == "heroic"){
        for (i = 0; i < 6; i++){
            var sum = 0;
            for (j = 0; j < 2; j++){
                var randomNumber = Math.floor(Math.random() * (6)) + 1;
                sum += randomNumber;
            }
            diceRolls.push(sum + 6);
            if(i < 5)
                resultString += sum + ", ";
            else
                resultString += sum;
        }
    } else {
      receivedMessage.channel.send("Invalid stat roll method. Try `standard`, `classic`, or `heroic`");
      return;
    }
    receivedMessage.channel.send(resultString);
}

// Get your bot's secret token from:
// https://discordapp.com/developers/applications/
// Click on your application -> Bot -> Token -> "Click to Reveal Token"
// replace with token kay for bot
bot_secret_token = "xxxxxxxxx"

client.login(bot_secret_token)
