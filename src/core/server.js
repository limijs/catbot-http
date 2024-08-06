const { fastify, FastifyReply, FastifyRequest } = require('fastify')
const {
  APIInteraction,
  InteractionType,
  InteractionResponseType,
} = require('discord-api-types/v10')
const { verify } = require('discord-verify')
require('dotenv/config')
const cat = require('./client.js')
class Server {
  /**
   * @typedef {Object} ServerOptions
   * @property {number} port
   *
   * @param {ServerOptions} options
   */
  constructor(options) {
    this.router = fastify({ logger: true })
    this.port = options.port
  }

  async start() {
    this.router.listen({ port: this.port }, (error) => {
      if (error) throw error
    })
    this.router.get('/', this.handleRequest)
    this.router.post('/', this.handleRequest)
  }

  /**
   * @param {FastifyRequest<{
   * Body: APIInteraction,
   * Headers: {
   * "x-signature-ed25519": string;
   * "x-signature-timestamp: string;"}}>} req
   * @param {FastifyReply} res
   */
  async handleRequest(req, res) {
    if (req.method === 'GET') return res.send({ data: 'hello there' })
    const signature = req.headers['x-signature-ed25519']
    const timestamp = req.headers['x-signature-timestamp']
    const rawBody = JSON.stringify(req.body)

    const isValidRequest = await verify(
      rawBody,
      signature,
      timestamp,
      process.env.PUBLIC_KEY,
      crypto.subtle
    )
    if (!isValidRequest) return res.code(401).send('Invalid signature')

    const interaction = req.body
    if (interaction.type === InteractionType.Ping) {
      return res.send({ type: InteractionResponseType.Pong })
    } else if (interaction.type === InteractionType.ApplicationCommand) {
      cat.commands.forEach((command) => {
        if (interaction.data.name.toLowerCase() === command.data.name) {
          command.run(res)
        }
      })
    }
  }
}

module.exports = Server
