const Server = require('./core/server.js')
const cat = require('./core/client.js')

require('dotenv/config')

cat.loadCommands()
const server = new Server({ port: 3002 })
server.start()
