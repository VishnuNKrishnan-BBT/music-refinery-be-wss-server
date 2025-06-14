import { TaskResponse } from "../constructors/taskResponse.mjs"

export const sessionIds = [
    {
        id: 'S1827188',
        userRole: 'fe_client',
        userGrade: 2
    },
    {
        id: 'S1827189',
        userRole: 'fe_client',
        userGrade: 1
    },
    {
        id: 'S1827288',
        userRole: 'fe_client',
        userGrade: 2
    }
]

export const getSessionData = sessionId => {
    return new Promise((resolve, reject) => {
        if (sessionIds.some(session => session.id === sessionId)) {
            const session = sessionIds.find(session => session.id === sessionId)
            console.table(session)
            resolve(new TaskResponse().success('Session restored!', session))
        } else {
            reject(new TaskResponse().failure('Session not found!'))
        }
    })
}