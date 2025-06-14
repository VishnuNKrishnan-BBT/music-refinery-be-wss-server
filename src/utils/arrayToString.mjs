export const arrayToString = (array = [], joiner = '') => { //provide required field if array contains objects
    if (!Array.isArray(array)) {
        return
    } else {
        return array.join(joiner)
    }
}