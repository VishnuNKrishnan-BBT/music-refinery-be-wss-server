import { TaskResponse } from "../constructors/taskResponse.mjs"
import { getSessionData } from "../getFromDB/getSessionData.mjs"

export const startSession = data => {

    //Check if session ID exists in redis/mongoDB
    //Yes? Resolve and allow to proceed
    //No? Reject command

    return new Promise((resolve, reject) => {
        getSessionData(data.sessionId)
            .then(res => {
                if (res.isSuccess) {
                    resolve(new TaskResponse().success(`Session ${data.sessionId} found!`))
                }
            })
            .catch(err => {
                reject(new TaskResponse().failure(`Session ${data.sessionId} not found!`, {
                    error: err,
                    redirectURI: '/login' //Redirect front end to here upon failed session search
                }))
            })
    })
}