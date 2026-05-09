const menuButton = document.querySelector('.hamburger');
const navigation = document.querySelector('.nav-links');

if (menuButton && navigation) {
    menuButton.addEventListener('click', () => {
        const expanded = navigation.classList.toggle('expanded');
        menuButton.setAttribute('aria-expanded', expanded.toString());
    });
}
