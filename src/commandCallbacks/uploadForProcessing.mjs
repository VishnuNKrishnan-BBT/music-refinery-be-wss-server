import { TaskResponse } from "../constructors/taskResponse.mjs"

export const addToList = data => {

    //Check if session ID exists in redis/mongoDB
    //Yes? Resolve and allow to proceed
    //No? Reject command

    return new Promise((resolve, reject) => {
        resolve(new TaskResponse().success('Added'))
    })
}