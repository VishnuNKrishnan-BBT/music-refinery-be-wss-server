import { TaskResponse } from "../constructors/taskResponse.mjs"
import { startSession } from "../commandCallbacks/startSession.mjs"
import { getSessionData } from "../getFromDB/getSessionData.mjs"
import { addToList } from "../commandCallbacks/uploadForProcessing.mjs"

//All allowed commands must me listed and configured here. Else commands will be rejected.
export const allowedCommands = [
    {
        command: 'startSession',
        allowedUserRoles: ['admin', 'fe_client', 'api_client'], //Only user roles included here can run this command
        allowedUserGrades: 2, //Only user grades mentioned here or greater can run this command
        function: startSession //Function that should run when this command is invoked
    },
    {
        command: 'loadSessionContents',
        allowedUserRoles: ['admin', 'fe_client', 'api_client'], //Only user roles included here can run this command
        allowedUserGrades: 2, //Only user grades mentioned here or greater can run this command
        function: addToList //Function that should run when this command is invoked
    },
    {
        command: 'test',
        allowedUserRoles: ['admin', 'fe_client', 'api_client'], //Only user roles included here can run this command
        allowedUserGrades: 2, //Only user grades mentioned here or greater can run this command
        function: addToList //Function that should run when this command is invoked
    }
]

export const runCommand = (command, data) => {
    return new Promise((resolve, reject) => {
        //Check if command is valid
        if (!allowedCommands.some(commandObj => commandObj.command === command)) { //Returns false if command is not found
            reject(new TaskResponse(command).failure(`Command '${command}' not found!`))
        }

        //Check if user is allowed to perform this command (user role and user grade)
        let sessionData
        getSessionData(data.sessionId)
            .then(res => {
                sessionData = res.responseData

                const commandProperties = allowedCommands.find(commandObj => commandObj.command === command)

                if (!commandProperties.allowedUserRoles.includes(sessionData.userRole)) {
                    reject(new TaskResponse(command).failure(`You are not permitted to run this command. [USER ROLE]`))
                } else if (!commandProperties.allowedUserRoles.userGrade >= sessionData.userGrade) {
                    reject(new TaskResponse(command).failure(`You are not permitted to run this command. [USER GRADE]`))
                }
                else {
                    if (commandProperties.function) {
                        commandProperties.function(data)
                            .then(res => {
                                if (res.isSuccess) {
                                    resolve(new TaskResponse().success(`Command ${command} processed successfully.`, res))
                                } else {
                                    reject(new TaskResponse().failure(`Command ${command} unsuccessful.`, res.responseData))
                                }
                            })
                            .catch(err => {
                                reject(new TaskResponse().failure(`Command ${command} unsuccessful.`, err))
                            })
                    }
                }
            })
            .catch(err => {
                reject(new TaskResponse().failure('Error while verifying session data.', {
                    error: err,
                    redirectURI: '/login' //Redirect front end to here upon failed session search
                }))
            })
    })
}