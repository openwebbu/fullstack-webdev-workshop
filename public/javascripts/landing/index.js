const connectScrollAnimations = () => {
    const navbar = document.getElementById('navbar')
    const mouse = document.getElementById('scroll-down-yo')
    const navbarBreakPoint = 150
    let lastScrollY = 0
    let ticking = false
    const update = () => {
        if (lastScrollY >= navbarBreakPoint) {
            navbar.classList.remove('transparent')
            mouse.classList.add('hidden')
        } else {
            navbar.classList.add('transparent')
            mouse.classList.remove('hidden')
        }
        ticking = false
    }

    const requestTick = () => {
        if (!ticking) {
            window.requestAnimationFrame(update);
            ticking = true
        }
    }

    const onScroll = () => {
        lastScrollY = window.scrollY
        requestTick()
    }

    window.addEventListener('scroll', onScroll)
}

app.onLoad(connectScrollAnimations)