deleteReview = function(slug, id) {
    app.postData(`/places/${slug}/${id}`, {}, 'DELETE')
       .then(location.reload())
}

connectDeletes = function() {
    const reviews = document.getElementsByClassName('delete-review')
    for (let review of reviews) {
        review.addEventListener('click', function() {
            deleteReview(review.dataset.place, review.dataset.review)
        })
    }
}

app.onLoad(connectDeletes)