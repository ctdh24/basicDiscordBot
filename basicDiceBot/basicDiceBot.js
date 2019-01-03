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

    if (primaryCommand == "help") {
        helpCommand(arguments, receivedMessage)
    } else if (primaryCommand == "multiply") {
        multiplyCommand(arguments, receivedMessage)
    } else if (primaryCommand == "roll") {
        rollCommand(arguments, receivedMessage)
    } else {
        receivedMessage.channel.send("I don't understand the command. Try `!help` or `!multiply`")
    }
  }
  function helpCommand(arguments, receivedMessage) {
    if (arguments.length > 0) {
        receivedMessage.channel.send("It looks like you might need help with " + arguments)
    } else {
        receivedMessage.channel.send("I'm not sure what you need help with. Try `!help [topic]`")
    }
}

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

function rollCommand(arguments, receivedMessage) {
  if (arguments === ""){
    receivedMessage.channel.send("Not enough dice to roll. Try `!roll 1d6` to roll 1 six-sided dice")
    return
  }
  else{
    var sum = 0;
    var resultString = "";
    arguments.forEach((value)=>{
      // var pattern = "([1-9]\\d*)?d([1-9]\\d*)([/x][1-9]\\d*)?([+-]\\d+)?";
      // console.log(value.split('([1-9]\\d*)?d([1-9]\\d*)([/x][1-9]\\d*)?([+-]\\d+)?'));

      var regex = /^(\d*)d(\d+)([-+]\d+)*/;
      values = value.match(regex).slice(1),
      a = parseInt(values[0]) || 1,
      b = parseInt(values[1]),
      c = parseInt(values[2]) || 0;
      for (i = 0; i < a; i++){
        var randomNumber = Math.floor(Math.random() * (b)) + 1;
        resultString += randomNumber + " + ";
        sum += randomNumber;
      }
      sum+= c;
      resultString += c + " ";
    })
    receivedMessage.channel.send(receivedMessage.author.toString() + " has rolled: " + resultString + "=" + sum);
  }
}

// Get your bot's secret token from:
// https://discordapp.com/developers/applications/
// Click on your application -> Bot -> Token -> "Click to Reveal Token"
bot_secret_token = "xxxxxxxxxx"

client.login(bot_secret_token)
