import { TaskResponse } from '../constructors/taskResponse.mjs'
import { ProgressResponse } from '../constructors/progressResponse.mjs'

import ffmpeg from 'fluent-ffmpeg'
import path from 'path'
import createFolder from './createFolder.mjs'

export const trimAudio = (ws = null, inputPath, outputName, session = '0', entryIndex = 0) => {
    return new Promise((resolve, reject) => {

        ws.send(JSON.stringify(new ProgressResponse(entryIndex, 2, null, null)))
        createFolder(`downloadedForProcessing/${session}/trimmed`)

        // Input and output file paths
        const inputFilePath = inputPath  // Replace with your input file
        const outputFilePath = `downloadedForProcessing/${session}/trimmed/${outputName}` // Replace with your output file


        // Define start time (in seconds) and duration (in seconds)
        const startTime = 10  // Start at 30 seconds
        const duration = 60   // Trim the next 60 seconds

        // Use fluent-ffmpeg to trim the audio
        ffmpeg(inputFilePath)
            .setStartTime(startTime) // Start trimming from 30 seconds
            .setDuration(duration)   // Trim 60 seconds of audio
            .output(outputFilePath)
            .on('end', () => {
                console.log('Audio has been trimmed successfully.')
                resolve(new TaskResponse(null, 'TRIM AUDIO').success('Audio trimmed successfully', { trimmedFilePath: outputFilePath }))
            })
            .on('error', (err) => {
                console.error('Error while trimming audio:', err.message)
                ws.send(JSON.stringify(new ProgressResponse(entryIndex, 3, null, null)))
                reject(new TaskResponse(null, 'TRIM AUDIO').failure('Error while trimming audio', err.message))
            })
            .run()
    })
}

// trimAudio(`https://music-refinery-app.s3.ap-south-1.amazonaws.com/sessions/SES4938299/origFiles/A.R.Rahman's+Nila+Kaigirathu+-+A+violin+cover+by+Karthick+Iyer+(Indian+Violin).mp3`, `abcd.mp3`)
//     .then(res => {
//         console.log(res);
//     }).catch(err => {
//         console.log(err);
//     })