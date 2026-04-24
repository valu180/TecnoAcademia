
// Carrusel con botones y scroll-snap para orientación vocacional

document.addEventListener('DOMContentLoaded', () => {
    const mql = window.matchMedia('(max-width: 768px)');
    const wrappers = Array.from(document.querySelectorAll('.carrusel'));
    if (!wrappers.length) return;

    const DURATION = 5000; // ms por foto (ajustable)

    wrappers.forEach((wrap) => {
        const cont = wrap.querySelector('.container_fotos_horizontal, .container_fotos_vertical');
        const prevBt = wrap.querySelector('.carrusel_btn.prev');
        const nextBt = wrap.querySelector('.carrusel_btn.next');
        if (!cont || !prevBt || !nextBt) return;

        const slides = Array.from(cont.querySelectorAll('img'));
        if (slides.length <= 1) return;

        let idx = 0;
        let timer = null;
        let scrollTO = null;
        let active = false;

        const padL = () => parseInt(getComputedStyle(cont).paddingLeft) || 0;

        function targetLeftFor(i) {
            const s = slides[i];
            return s.offsetLeft - padL();
        }

        function goTo(i) {
            idx = (i + slides.length) % slides.length;
            cont.scrollTo({ left: targetLeftFor(idx), behavior: 'smooth' });
        }

        const goNext = () => goTo(idx + 1);
        const goPrev = () => goTo(idx - 1);

        function play() {
            if (!timer) timer = setInterval(goNext, DURATION);
        }

        function pause() {
            clearInterval(timer);
            timer = null;
        }

        function syncIdx() {
            const ref = cont.scrollLeft + padL() + cont.clientWidth / 2;
            let best = Infinity, bestI = 0;
            for (let i = 0; i < slides.length; i++) {
                const s = slides[i];
                const sRef = s.offsetLeft + s.offsetWidth / 2;
                const d = Math.abs(sRef - ref);
                if (d < best) { best = d; bestI = i; }
            }
            idx = bestI;
        }

        const onNext = () => { pause(); goNext(); setTimeout(play, 800); };
        const onPrev = () => { pause(); goPrev(); setTimeout(play, 800); };
        const onScroll = () => { pause(); syncIdx(); clearTimeout(scrollTO); scrollTO = setTimeout(play, 800); };

        function setup() {
            if (active) return;
            nextBt.addEventListener('click', onNext);
            prevBt.addEventListener('click', onPrev);
            cont.addEventListener('scroll', onScroll, { passive: true });
            active = true;
            play();
        }

        function teardown() {
            if (!active) return;
            pause();
            nextBt.removeEventListener('click', onNext);
            prevBt.removeEventListener('click', onPrev);
            cont.removeEventListener('scroll', onScroll);
            active = false;
        }

        setup();
        mql.addEventListener('change', e => e.matches ? setup() : teardown());
    });
});