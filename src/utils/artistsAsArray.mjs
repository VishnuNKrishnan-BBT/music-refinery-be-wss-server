export const artistsNamesAsArray = (artists) => {
    if (!Array.isArray(artists)) {
        return
    }

    let artistNames = []
    artists.forEach(artist => {
        artistNames.push(artist.name)
    })

    return artistNames
}