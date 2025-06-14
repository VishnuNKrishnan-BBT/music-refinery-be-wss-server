export class TaskResponse {
    constructor(receivedData = null, processName = 'UNNAMED PROCESS') {
        this.processName = processName
        this.isSuccess = false
        this.message = null
        this.receivedData = receivedData
    }

    success(message = 'Success', responseData = null) {
        this.isSuccess = true
        this.message = message
        this.responseData = responseData

        return this
    }

    failure(message = 'Failed', responseData = null) {
        this.isSuccess = false
        this.message = message
        this.responseData = responseData

        return this
    }
}