// Notes on :ai[...]{note="..."} open on hover and keyboard focus through CSS
// alone (devices.css). A tap on a touch screen has no hover to leave and no
// reliable blur, so taps toggle .is-open instead: tap the text again, tap
// anywhere else, or press Escape to close.
const OPEN = 'is-open';

const closeAll = (except) => {
    document.querySelectorAll(`.ai-text.${OPEN}`).forEach((element) => {
        if (element !== except) element.classList.remove(OPEN);
    });
};

document.addEventListener('click', (event) => {
    const text = event.target.closest('.ai-text[tabindex]');
    closeAll(text);
    if (text) text.classList.toggle(OPEN);
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeAll();
});
