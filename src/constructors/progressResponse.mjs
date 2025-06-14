import { PortalData } from "./portalData.mjs"
import { TaskResponse } from "./taskResponse.mjs"

const statusNames = [
    'Loading media...', //0
    'Failed to load media!', //1
    'Trimming for sample...', //2
    'Failed to trim media!', //3
    'Creating buffer...', //4
    'Failed to create buffer!', //5
    'Identifying media...', //6
    'Identified media!', //7
    'No match found!', //8
    'Searching for albumart...', //9
    'Found albumart!', //10
    'Failed to find albumart!' //11
]

export class ProgressResponse {
    constructor(currentProcessingIndex = 0, status = 0, mediaMetadata = null, portalData = null) {
        this.index = currentProcessingIndex
        this.statusCode = status
        this.statusName = statusNames[status] ? statusNames[status] : `Status '${status}' not found`
        this.mediaMetadata = mediaMetadata
        // this.portalData = new PortalData(portalData.processed, portalData.success, portalData.failed, portalData.creditsUsed)
        this.portalData = new PortalData(3, 2, 1, 2)
    }

    getProgressFormatted(status = 'fail') { //status = pass | fail
        if (status === 'pass') {
            return new TaskResponse(null, 'MEDIA IDENTIFICATION AND PROCESSING').success('Media lookup successful!', this)
        } else {
            return new TaskResponse(null, 'MEDIA IDENTIFICATION AND PROCESSING').failure('Media lookup failed', this)
        }
    }
}