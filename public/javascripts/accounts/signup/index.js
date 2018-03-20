window.onload = () => {
    const box = document.getElementById('box')

    const signin = document.getElementById('signin')
    const signup = document.getElementById('signup')
    signin.addEventListener('click', () => {
        box.classList.add('signin')
        signin.classList.add('selected')
        signup.classList.remove('selected')
    })
    signup.addEventListener('click', () => {
        box.classList.remove('signin')
        signin.classList.remove('selected')
        signup.classList.add('selected')
    })
}