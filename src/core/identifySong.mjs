// import 'dotenv/config'
import fs from 'fs'
import crypto from 'crypto'
import axios from 'axios'
import FormData from 'form-data'
import { trimAudio } from './trimAudio.mjs'
import { downloadMedia } from './downloadMedia.mjs'
import { ServiceResponseAdaptor } from '../constructors/serviceResponseAdaptor.mjs'
import { TaskResponse } from '../constructors/taskResponse.mjs'
import { ProgressResponse } from '../constructors/progressResponse.mjs'

export const identifySong = (ws = null, path, session, entryIndex = 0) => {
    //Available in .env. But unreadable here.
    const ACCESS_KEY = process.env.MUSIC_IDENTIFICATION_SERVICE_ACCESS_KEY
    const ACCESS_SECRET = process.env.MUSIC_IDENTIFICATION_SERVICE_ACCESS_SECRET
    const ENDPOINT = process.env.MUSIC_IDENTIFICATION_SERVICE_URL

    return new Promise(async (resolve, reject) => {
        //Filename
        const actualFileName = path.split('/')[path.split('/').length - 1]

        //Download media from S3
        downloadMedia(ws, path, session, actualFileName, entryIndex)
            .then(res => {
                trimAudio(ws, res.responseData.downloadedFilePath, actualFileName, session, entryIndex)
                    .then(res => {
                        // console.log(res);

                        const httpMethod = 'POST'
                        const httpUri = '/v1/identify'
                        const dataType = 'audio'
                        const signatureVersion = '1'
                        const timestamp = Math.floor(Date.now() / 1000)

                        // Construct the string to sign for the HMAC signature
                        const stringToSign = `${httpMethod}\n${httpUri}\n${ACCESS_KEY}\n${dataType}\n${signatureVersion}\n${timestamp}`

                        // Create the signature using HMAC-SHA1
                        const signature = crypto.createHmac('sha1', ACCESS_SECRET)
                            .update(stringToSign)
                            .digest('base64')

                        console.log(`-- Creating file buffer for sample...`)
                        // console.log(res.responseData.trimmedFilePath)


                        //Read downloaded file
                        ws.send(JSON.stringify(new ProgressResponse(entryIndex, 4, null, null)))
                        const fileData = fs.readFileSync(res.responseData.trimmedFilePath)

                        // Create form data for the request
                        const form = new FormData()
                        form.append('sample', fileData, {
                            filename: actualFileName,
                            contentType: 'audio/mpeg',
                        })
                        form.append('access_key', ACCESS_KEY)
                        form.append('data_type', dataType)
                        form.append('signature_version', signatureVersion)
                        form.append('signature', signature)
                        form.append('sample_bytes', fileData.length)
                        form.append('timestamp', timestamp)

                        // Make the POST request to ACR Cloud API
                        console.log(`-- Checking database for a match...`)
                        ws.send(JSON.stringify(new ProgressResponse(entryIndex, 6, null, null)))
                        axios.post(ENDPOINT, form, {
                            headers: form.getHeaders(),
                        })
                            .then(response => {
                                // console.log(response);

                                if (!response.data.metadata) {
                                    ws.send(JSON.stringify(new ProgressResponse(entryIndex, 8, null, null)))
                                    reject(new TaskResponse(null, 'IDENTIFY MEDIA').failure('No match found!', response.data))
                                } else {
                                    const formattedAudioInfo = new ServiceResponseAdaptor(response.data).getFormatted()
                                    //console.log(formattedAudioInfo);
                                    console.log(JSON.stringify(response.data, null, 4));
                                    console.log(`-- Media identified!`)
                                    console.table(formattedAudioInfo)
                                    ws.send(JSON.stringify(new ProgressResponse(entryIndex, 7, formattedAudioInfo, null)))
                                    resolve(new TaskResponse(null, 'IDENTIFY MEDIA').success('Media identified!', formattedAudioInfo))
                                }
                            })
                            .catch(error => {
                                // console.log(error)
                                reject(new TaskResponse(null, 'SEND SAMPLE AUDIO').failure('Process failed when sending sample audio.', error))
                            })
                    })
                    .catch(error => {
                        // console.log(error)
                        reject(new TaskResponse(null, 'TRIM AUDIO').failure('Process failed when trimming audio.', error))
                    })
            })
            .catch(error => {
                console.log(error)
                reject(new TaskResponse(null, 'DOWNLOAD MEDIA ON SERVER FOR PROCESSING').failure('Process failed when downloading media.', error))
            })

    })
        .catch(error => {
            ws.send(JSON.stringify(new ProgressResponse(entryIndex, 4, null, null)))
            console.log(error)
        })
}

//identifySong(`https://music-refinery-app.s3.ap-south-1.amazonaws.com/sessions/SESl4938299/origFiles/Vilakku+Vakkum+(Megham).mp3`, 'SES323')