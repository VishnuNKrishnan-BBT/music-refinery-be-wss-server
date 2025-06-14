import axios from "axios"
import { TaskResponse } from "../constructors/taskResponse.mjs";

export const retrieveEntriesInSession = async (session) => {
    // Endpoint URL to send the POST request
    const url = `${process.env.MUSIC_REFINERY_BACKEND_SERVER_URL}/retrieveAll`;

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