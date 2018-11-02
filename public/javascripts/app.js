class OpenReview {
    constructor() {
        this.onLoadFunc = []

        this.connectSearchClient = this.connectSearchClient.bind(this)
        this.onLoad(this.connectSearchClient)
    }
    init() {
        for (const func of this.onLoadFunc) {
            func()
        }
    }
    onLoad(func) {
        if (typeof(func) == 'function' && this.onLoadFunc.indexOf(func) == -1) {
            this.onLoadFunc.push(func)
        }
    }

    static slugify(str) {
        str = str.replace(/^\s+|\s+$/g, '')
        str = str.toLowerCase()

        const from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;"
        const to   = "aaaaeeeeiiiioooouuuunc------"
        for (var i=0, l=from.length ; i<l ; i++) {
            str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i))
        }

        str = str.replace(/[^a-z0-9 -]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')

        return str
    }

    search() {
        const searchQ = document.getElementById('search-place-q')
        const q = searchQ.value
        if (q) {
            location.href = `/places/search/${q}`
        }
    }

    connectSearchClient() {
        const searchSubmit = document.getElementById('search-place-submit')
        const searchQ = document.getElementById('search-place-q')
        searchQ.addEventListener('keyup', (e) => {
            if (e.keyCode == 13) {
                this.search()
            }
        })

        searchSubmit.addEventListener('click', this.search)
    }
    
    postData(url, data, method) {
        return fetch(url, {
          body: JSON.stringify(data),
          cache: 'no-cache',
          credentials: 'same-origin',
          headers: {
            'user-agent': 'Mozilla/4.0 MDN Example',
            'content-type': 'application/json'
          },
          method: method,
          mode: 'cors',
          redirect: 'follow',
          referrer: 'client',
        })
        .then(response => response.json())
    }
}

const app = new OpenReview()

window.onload = () => {
    app.init()
}