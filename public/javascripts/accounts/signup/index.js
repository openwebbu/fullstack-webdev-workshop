window.onload = () => {
    let signinMode = false

    const box = document.getElementById('box')
    const signin = document.getElementById('signin')
    const signup = document.getElementById('signup')
    const submitBtn = document.getElementById('submit-btn')
    const fields = document.getElementsByClassName('text-field')

    signin.addEventListener('click', toggleSignIn)
    signup.addEventListener('click', toggleSignIn)

    function toggleSignIn() {
        signinMode = !signinMode
        if (signinMode) {
            box.classList.add('signin')
            signin.classList.add('selected')
            signup.classList.remove('selected')
        } 
        else {
            box.classList.remove('signin')
            signin.classList.remove('selected')
            signup.classList.add('selected')
            
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
            for (let field of fields) {
                field.value = ''
            }
        }, 700)
    }
}