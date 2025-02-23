function getLocations() : string[]{
    fetch('your mom')
        .then((res) => res.json())
        .catch((error) => {
            console.error(error)
        })
        .then((data) => {
            return data
        })
    return ['moil', 'croads']
}

export { getLocations }
