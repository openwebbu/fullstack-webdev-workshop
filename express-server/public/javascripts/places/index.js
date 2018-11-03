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

connectEdits = function() {
    const editbtns = document.getElementsByClassName('edit-review')
    for (let editbtn of editbtns) {
        editbtn.addEventListener('click', function() {
            let editorContainer = editbtn.parentNode.parentNode.nextSibling
            if (!editorContainer.classList.contains('edit-mode')) {
                editbtn.classList.add('active')
                editbtn.nextSibling.classList.add('disabled')
                editorContainer.classList.add('edit-mode')
                editorContainer.getElementsByTagName('textarea')[0]
                               .removeAttribute('readonly')
                editorContainer.getElementsByTagName('textarea')[0]
                               .setAttribute('spellcheck', true)
            }
        })
    }
}

connectAutosize = function() {
    let textareas = document.getElementsByTagName('textarea')
    for (let textarea of textareas) {
        textarea.addEventListener('keydown', autosize)
    }
}

autosize = function(){
    var el = this
    setTimeout(function(){
        el.style.cssText = 'height:auto; padding:0'
        el.style.cssText = 'height:' + el.scrollHeight + 'px'
    },0)
}


updateReview = function(slug, id, text) {
    app.postData(`/places/${slug}/${id}`, {text: text}, 'PUT')
    //    .then(location.reload())
}

connectUpdate = function() {
    const submitBtns = document.getElementsByClassName('submit-btn')
    for (let btn of submitBtns) {
        btn.addEventListener('click', function() {
            const text = btn.previousElementSibling.value
            updateReview(btn.dataset.place, btn.dataset.review, text)
            const editorContainer = btn.parentElement
            const editbtn = editorContainer.previousElementSibling.firstChild
                                           .nextSibling.firstChild
            editbtn.classList.remove('active')
            editbtn.nextSibling.classList.remove('disabled')
            editorContainer.classList.remove('edit-mode')
            editorContainer.getElementsByTagName('textarea')[0]
                           .setAttribute('readonly', 'readonly')
            editorContainer.getElementsByTagName('textarea')[0]
                           .setAttribute('spellcheck', false)
        })
    }
}

app.onLoad(connectDeletes)
app.onLoad(connectEdits)
app.onLoad(connectAutosize)
app.onLoad(connectUpdate)