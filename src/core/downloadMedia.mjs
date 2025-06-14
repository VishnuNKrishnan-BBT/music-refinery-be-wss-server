import { TaskResponse } from '../constructors/taskResponse.mjs'
import axios from 'axios'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import createFolder from './createFolder.mjs'
import { ProgressResponse } from '../constructors/progressResponse.mjs'
import { PortalData } from '../constructors/portalData.mjs'

export const downloadMedia = (ws = null, fileUrl, session = '0', outputTitle = 'trimmed.mp3', entryIndex = 0) => {
    return new Promise((resolve, reject) => {

        ws.send(JSON.stringify(new ProgressResponse(entryIndex, 0, null, null)))
        createFolder(`downloadedForProcessing/${session}/origFiles`)

        // Path where the file will be saved
        const outputFilePath = `downloadedForProcessing/${session}/origFiles/${outputTitle}`

        console.log(fileUrl)
        axios({
            method: 'get',
            url: fileUrl,
            responseType: 'stream'
        }).then((response) => {
            const fileStream = fs.createWriteStream(outputFilePath)
            response.data.pipe(fileStream)

            fileStream.on('finish', () => {
                fileStream.close()
                console.log('File downloaded successfully.')
                resolve(new TaskResponse(null, 'DOWNLOAD AUDIO FOR PROCESSING').success('Audio downloaded successfully', { downloadedFilePath: outputFilePath }))
            })
        }).catch((err) => {
            console.error('Error downloading file:', err.message)
            ws.send(JSON.stringify(new ProgressResponse(entryIndex, 1, null, null)))
            reject(new TaskResponse(null, 'DOWNLOAD AUDIO FOR PROCESSING').failure('Audio download failed', err.message))
        })
    })
}

//downloadMedia(`https://music-refinery-app.s3.ap-south-1.amazonaws.com/sessions/SES4938299/origFiles/A.R.Rahman's+Nila+Kaigirathu+-+A+violin+cover+by+Karthick+Iyer+(Indian+Violin).mp3`)