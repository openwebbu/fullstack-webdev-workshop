const hookActionBtns = function() {
    const actionBtn = document.getElementsByClassName('action-btn')

    for (let btn of actionBtn) {
        btn.addEventListener('click', function() {
            const url = btn.getAttribute('action')
            app.postData(url).then(json => {
                location.reload()
            })
        })
    }
}

app.onLoad(hookActionBtns)