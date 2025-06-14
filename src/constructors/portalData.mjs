export class PortalData {
    constructor(processed = 0, success = 0, failed = 0, creditsUsed = 0, currentIndex = 0) {
        this.currentIndex = currentIndex
        this.processed = processed
        this.success = success
        this.failed = failed
        this.creditsUsed = creditsUsed
    }

    getPortalDataFormatted() {
        return this
    }
}