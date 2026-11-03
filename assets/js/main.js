const menuToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
        const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', String(!isOpen));
        menuToggle.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
        navMenu.classList.toggle('is-open', !isOpen);
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('is-open');
            menuToggle.setAttribute('aria-expanded', 'false');
            menuToggle.setAttribute('aria-label', 'Open navigation');
        });
    });
}

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });
    revealItems.forEach(item => revealObserver.observe(item));
} else {
    revealItems.forEach(item => item.classList.add('is-visible'));
}

const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(link => {
            link.classList.toggle('is-active', link.getAttribute('href') === `#${entry.target.id}`);
        });
    });
}, { rootMargin: '-30% 0px -60% 0px' });
document.querySelectorAll('main section[id]').forEach(section => sectionObserver.observe(section));

const currentYear = document.getElementById('current-year');
if (currentYear) currentYear.textContent = String(new Date().getFullYear());

const audioToggle = document.getElementById('audio-toggle');
const ambientAudio = document.getElementById('ambient-audio');
if (audioToggle && ambientAudio) {
    audioToggle.addEventListener('click', async () => {
        if (ambientAudio.paused) {
            try {
                await ambientAudio.play();
                audioToggle.setAttribute('aria-pressed', 'true');
                audioToggle.setAttribute('aria-label', 'Pause ambient audio');
                audioToggle.querySelector('.audio-label').textContent = 'SOUND ON';
            } catch (error) {
                audioToggle.setAttribute('aria-label', 'Audio could not be played');
                audioToggle.querySelector('.audio-label').textContent = 'AUDIO UNAVAILABLE';
            }
        } else {
            ambientAudio.pause();
            audioToggle.setAttribute('aria-pressed', 'false');
            audioToggle.setAttribute('aria-label', 'Play ambient audio');
            audioToggle.querySelector('.audio-label').textContent = 'SOUND OFF';
        }
    });
}

const holoStage = document.getElementById('holo-stage');
const holoCore = holoStage?.querySelector('.holo-core');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (holoStage && holoCore && !reduceMotion) {
    holoStage.addEventListener('pointermove', event => {
        const bounds = holoStage.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - 0.5;
        const y = (event.clientY - bounds.top) / bounds.height - 0.5;
        holoCore.style.setProperty('--tilt-x', `${-y * 9}deg`);
        holoCore.style.setProperty('--tilt-y', `${x * 11}deg`);
    });
    holoStage.addEventListener('pointerleave', () => {
        holoCore.style.setProperty('--tilt-x', '0deg');
        holoCore.style.setProperty('--tilt-y', '0deg');
    });
}
