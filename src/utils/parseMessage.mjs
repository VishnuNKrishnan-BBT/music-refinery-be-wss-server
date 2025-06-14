import { TaskResponse } from "../constructors/taskResponse.mjs"
import { isValidJSON } from "./isValidJSON.mjs"

export const parseMessage = messageBuffer => {
    return new Promise((resolve, reject) => {

        const message = messageBuffer.toString()

        //Validations
        if (message == '') { //Blank message
            reject(new TaskResponse(message).failure('Blank message received.'))
        }

        if (!isValidJSON(message)) { //Invalid JSON
            reject(new TaskResponse(message).failure('Invalid JSON received.'))
        }

        resolve(new TaskResponse(JSON.parse(message)).success('Message processed successfully.'))
    })
}