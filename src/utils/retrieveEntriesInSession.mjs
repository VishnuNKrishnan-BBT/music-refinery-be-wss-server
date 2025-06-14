import axios from "axios"
import { TaskResponse } from "../constructors/taskResponse.mjs";

export const retrieveEntriesInSession = async (session) => {
    // Endpoint URL to send the POST request
    // const url = 'https://music-refinery-app-be-server-073a0f763c8f.herokuapp.com/retrieveAll'; // Replace with your own endpoint
    const url = 'http://localhost:4341/retrieveAll'; // Replace with your own endpoint

    try {
        const response = await axios.post(url, null, {
            headers: {
                'Session': session
            }
        });

        // Log the response from the server
        // console.log('Response data:', response.data);
        return new TaskResponse(null, 'RETRIEVE ALL IN SESSION').success('Retrieved successfully', response.data)
    } catch (error) {
        console.error('Error making POST request:', error.message);
    }
}