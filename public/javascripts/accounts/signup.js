window.onload = () => {
    let signinMode = 0

    const box = document.getElementById('box')
    const signin = document.getElementById('signin')
    const signup = document.getElementById('signup')
    const submitBtn = document.getElementById('submit-btn')
    const textFields = document.getElementsByClassName('text-field')
    const signinFields = document.getElementById('signin-fields')
    const signupFields = document.getElementById('signup-fields')
    const fields = [signupFields, signinFields]

    signin.addEventListener('click', toggleSignIn)
    signup.addEventListener('click', toggleSignIn)
    submitBtn.addEventListener('click', submit)
    for (let textField of textFields) {
        textField.addEventListener('keyup', detectEnter)
    }
    window.addEventListener('popstate', function(e) {
        if (e.state) {
            toggleSignIn(false)
            document.title = e.state.title
        }
        else {
            window.history.back()
        }
    })

    const currentTitle = document.title
    window.history.pushState({signinMode: signinMode, title: currentTitle}, 
        'Open Reviews - Sign In', 
        '/accounts/login')

    function detectEnter(e) {
        if (e.keyCode === 13) {
            submit()
        } 
    }

    function submit() {
        const data = retrieveFormData(fields[signinMode])
        postData('/accounts/login', data).then(json => {
            if (json.success && json.redirectTo) {
                location.href = json.redirectTo
            }
        })
    }

    function toggleSignIn(push=true) {
        signinMode = signinMode == 0 ? 1 : 0
        if (signinMode) {
            box.classList.add('signin')
            signin.classList.add('selected')
            signup.classList.remove('selected')
            document.title = 'Open Reviews - Sign In'
            if (push) {
                window.history.pushState({
                    signinMode: signinMode,
                    title: 'Open Reviews - Sign In',
                }, null, '/accounts/login')
            }
        } 
        else {
            box.classList.remove('signin')
            signin.classList.remove('selected')
            signup.classList.add('selected')
            document.title = 'Open Reviews - Sign Up'
            if (push) {
                window.history.pushState({
                    signinMode: signinMode,
                    title: 'Open Reviews - Sign Up'
                }, null, '/accounts/register')
            }
        }
        setTimeout(function() {
            if (signinMode) {
                submitBtn.innerText = 'Sign in'
            }
            else {
                submitBtn.innerText = 'Create an account'
            }
        }, 300)
        setTimeout(function() {
            for (let field of textFields) {
                field.value = ''
            }
        }, 700)
    }

    function postData(url, data) {
        return fetch(url, {
          body: JSON.stringify(data),
          cache: 'no-cache',
          credentials: 'same-origin',
          headers: {
            'user-agent': 'Mozilla/4.0 MDN Example',
            'content-type': 'application/json'
          },
          method: 'POST',
          mode: 'cors',
          redirect: 'follow',
          referrer: 'client',
        })
        .then(response => response.json())
    }

    function retrieveFormData(fields) {
        const data = {}

        for (let element of fields.children) {
            console.log(element)
            if (element.classList.contains('field')) {
                const firstChild = element.firstElementChild
                data[firstChild.getAttribute('name')] = firstChild.value
            }
        }
        return data
    }
}