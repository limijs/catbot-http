const { InteractionResponseType } = require('discord-api-types/v10')
const Command = require('../core/command.js')
const { FastifyReply } = require('fastify')


class PingCommand extends Command {
  constructor() {
    super({
      name: 'pingss',
      description: 'pingsasdasdasdasdasdasdasdsaasd',
    })
  }

  /**
   *
   * @param {FastifyReply} res
   */
  async run(res) {
    res.status(200).send({
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        content: 'hi',
      },
    })
  }
}

module.exports = PingCommand
