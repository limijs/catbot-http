const fs = require('fs')
const path = require('path')

class Client {
  /**
   * @typedef {Object} ClientOptions
   * @property {string} token
   * @property {string} applicationId
   * @property {string} publicKey
   *
   * @param {ClientOptions} options
   */
  constructor(options) {
    // this.token = options.token
    // this.applicationId = options.applicationId
    // this.publicKey = options.publicKey
    this.commands = new Map()
  }

  async loadCommands() {
    const commandsPath = path.join(__dirname, '../commands')
    const guildId = '1257007872244453407'
    const commandFiles = fs
      .readdirSync(commandsPath)
      .filter((file) => file.endsWith('.js'))
    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file)
      const commandClass = require(filePath)
      const command = new commandClass()
      this.commands.set(command.data.name, command)
      console.log(JSON.stringify(command.data))

      const response = await fetch(
        `https://discord.com/api/v10/applications/${process.env.APPLICATION_ID}/guilds/${guildId}/commands`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bot ${process.env.TOKEN}`,
          },
          method: 'PUT',
          body: JSON.stringify([command.data]),
        }
      )
      if (response.ok) {
        console.log('Registered all commands')
      } else {
        console.error('Error registering commands')
        const text = await response.text()
        console.error(text)
      }
    }
  }
}

const cat = new Client()
module.exports = cat
