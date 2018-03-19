window.onload = () => {
    const signin = document.getElementById('signin')
    const signup = document.getElementById('signup')
    const tilted = document.getElementById('im-so-tilted')
    const actionChoices = document.getElementById('action-choices')
    const logoContainer = document.getElementById('logo-container')
    const fields = document.getElementById('fields')
    const submit = document.getElementById('submit')
    const submitBtn = document.getElementById('submit-btn')

    signin.addEventListener('click', () => {
        tilted.classList.add('signin')
        actionChoices.classList.add('signin')
        signin.classList.add('selected')
        signup.classList.remove('selected')
        logoContainer.classList.add('signin')
        fields.classList.add('signin')
        submit.classList.add('signin')
        submitBtn.innerText = 'Sign in'
        submitBtn.classList.add('signin')
    })
    signup.addEventListener('click', () => {
        tilted.classList.remove('signin')
        actionChoices.classList.remove('signin')
        signup.classList.add('selected')
        signin.classList.remove('selected')
        logoContainer.classList.remove('signin')
        fields.classList.remove('signin')
        submit.classList.remove('signin')
        submitBtn.innerText = 'Create an account'
        submitBtn.classList.remove('signin')
    })
}