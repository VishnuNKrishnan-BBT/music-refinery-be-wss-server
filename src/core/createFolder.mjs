import { mkdirSync, existsSync } from 'fs'

function createFolder(newPath) {
    try {
        // Check if the directory already exists
        if (!existsSync(newPath)) {
            console.log(`-- Creating directory for updated tracks...`)
            mkdirSync(newPath, { recursive: true })
            console.log('-- Output directory created successfully')
        } else {
            console.log('-- Output directory already exists')
        }
    } catch (err) {
        console.error('-- Error creating directory:', err)
    }
}

export default createFolder