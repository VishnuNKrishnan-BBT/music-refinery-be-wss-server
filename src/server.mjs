// Importing the WebSocket library using import syntax
import { WebSocketServer } from 'ws'
import { auth } from './middleware/auth.mjs'
import { parseMessage } from './utils/parseMessage.mjs'
import { runCommand } from './commands/allowedCommands.mjs'

// Create a new WebSocket server on given port
const PORT = process.env.PORT || 4340
const wss = new WebSocketServer({ port: PORT })

//Create Redis Client
import { createClient } from 'redis'
import { ProgressResponse } from './constructors/progressResponse.mjs'
import { identifySong } from './core/identifySong.mjs'
import { retrieveEntriesInSession } from './utils/retrieveEntriesInSession.mjs'

// const redisClient = createClient({
//     password: 'VgRp53FI1zGtcYpyhw4Jumbehi7SOaFY',
//     socket: {
//         host: 'redis-11047.c301.ap-south-1-1.ec2.redns.redis-cloud.com',
//         port: 11047
//     }
// })

// redisClient.connect()
//     .then(() => console.log('Connected to Redis Cloud'))
//     .catch(err => console.error('Connection error:', err))

// Listen for connection event
wss.on('connection', (ws) => {
    console.log('New client connected!')

    // Listen for messages from the client
    ws.on('message', (message) => {

        parseMessage(message) //Validate message
            .then(async res => {
                const requestedCommand = res.receivedData.command
                const commandData = res.receivedData.data

                if (requestedCommand !== 'listenToProgress') { //listen to progress has a different logic
                    runCommand(requestedCommand, commandData)
                        .then(res => {
                            // console.log(JSON.stringify(res, null, 4))
                            ws.send(JSON.stringify(res))
                        })
                        .catch(err => {
                            // console.log(JSON.stringify(err, null, 4))
                            ws.send(JSON.stringify(err))
                        })
                }

                if (requestedCommand === 'listenToProgress') {
                    const listToIdentifyObject = await retrieveEntriesInSession('SES4938299')
                    const listToIdentify = listToIdentifyObject.responseData.responseData

                    for (let [index, song] of listToIdentify.entries()) {
                        // Wait for the current song to be identified before continuing
                        await identifySong(ws, `${process.env.MUSIC_REFINERY_STORAGE_BUCKET_BASE_URL}/${song.origFileTempUrl}`, 'SES4938299', index);
                    }
                }
            })
            .catch(err => {
                console.log(err)
            })
    })

    // Listen for client disconnect event
    ws.on('close', () => {
        console.log('Client disconnected')
    })
})

console.log(`WebSocket server is listening on ws://localhost:${PORT}`)
