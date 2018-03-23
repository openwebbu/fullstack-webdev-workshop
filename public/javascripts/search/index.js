connectLinks = function() {
    const places = document.getElementsByClassName('place')
    for (let place of places) {
        place.addEventListener('click', function() {
            console.log(place)
            location.href = place.getAttribute('href')
        })
    }
}

app.onLoad(connectLinks)