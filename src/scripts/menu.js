const menuButton = document.querySelector('.hamburger');
const navigation = document.querySelector('.nav-links');

if (menuButton && navigation) {
    const setOpen = (open) => {
        navigation.classList.toggle('expanded', open);
        menuButton.setAttribute('aria-expanded', open.toString());
    };

    menuButton.addEventListener('click', () => setOpen(!navigation.classList.contains('expanded')));

    // Following a link closes the menu; so does Escape, which also puts focus
    // back on the button so keyboard users are not left on a hidden link.
    navigation.addEventListener('click', (event) => {
        if (event.target.closest('a')) setOpen(false);
    });
    document.addEventListener('keydown', (event) => {
        if (event.key !== 'Escape' || !navigation.classList.contains('expanded')) return;
        setOpen(false);
        menuButton.focus();
    });
}
