export const isValidJSON = string => {
    try {
        JSON.parse(string)
        return true // The string is valid JSON
    } catch (e) {
        return false // The string is not valid JSON
    }
}