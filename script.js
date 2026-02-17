document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('start-btn');
    const startScreen = document.getElementById('start-screen');
    const animationScreen = document.getElementById('animation-screen');
    const resultScreen = document.getElementById('result-screen');

    const fusionCore = document.querySelector('.fusion-core');
    const fusionFlash = document.querySelector('.fusion-flash');
    const fusionContainer = document.querySelector('.fusion-container');
    const fusionSpinner = document.querySelector('.fusion-spinner');
    const leftCard = document.querySelector('.photo-wrapper.left');
    const rightCard = document.querySelector('.photo-wrapper.right');

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioCtx = new AudioContext();

    function playBlip() {
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(400, audioCtx.currentTime + 0.05);

        gainNode.gain.setValueAtTime(0.015, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.05);
    }

    startBtn.addEventListener('click', () => {
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        // FORCE HIDE RETRO LAYER IMMEDIATELY
        const retroLayer = document.querySelector('.retro-layer');
        if (retroLayer) {
            retroLayer.style.display = 'none';
            retroLayer.classList.add('retro-hidden');
        }

        startScreen.classList.add('hidden');
        startScreen.style.display = 'none';

        animationScreen.classList.remove('hidden');
        animationScreen.style.display = 'flex';

        setTimeout(() => {
            fusionContainer.classList.add('enter-stage');
        }, 100);

        setTimeout(() => {
            fusionSpinner.classList.add('fusion-spinning');

            const trailInterval = setInterval(() => {
                createTrail(leftCard);
                createTrail(rightCard);
            }, 60);

            setTimeout(() => {
                clearInterval(trailInterval);
            }, 5900);

        }, 8100);

        // TIMING ADJUSTMENT FOR SMOOTH TRANSITION
        // 1. Trigger Flash earlier
        setTimeout(() => {
            fusionCore.classList.add('animate-swirl');
            fusionFlash.classList.add('animate-flash');
        }, 13200);

        // 2. Cutiing to result screen WHILE flash is white (approx 800ms after flash start)
        setTimeout(() => {
            animationScreen.classList.add('hidden');
            animationScreen.style.display = 'none';

            resultScreen.classList.remove('hidden');
            resultScreen.style.display = 'flex';

            // SHOW RETRO LAYER WITH FADE
            if (retroLayer) {
                retroLayer.style.display = 'block';
                // Force reflow to enable transition
                void retroLayer.offsetWidth;
                retroLayer.classList.remove('retro-hidden');
            }

            typeWriterEffect();
        }, 14000); // Swapped earlier to hide the cut
    });

    function typeWriterEffect() {
        const paragraphs = document.querySelectorAll('.message-container p');

        paragraphs.forEach(p => {
            if (!p.classList.contains('closing')) {
                let rawText = p.textContent;
                let cleanText = rawText
                    .replace(/[\n\r]+/g, ' ')
                    .replace(/\s+/g, ' ')
                    .trim();
                p.setAttribute('data-text', cleanText);
                p.textContent = '';
            }
        });

        let pIndex = 0;

        function typeParagraph() {
            if (pIndex >= paragraphs.length) return;

            const p = paragraphs[pIndex];

            if (p.classList.contains('closing')) {
                p.style.opacity = 1;
                pIndex++;
                typeParagraph();
                return;
            }

            const text = p.getAttribute('data-text');
            p.classList.add('typing-active');

            if (!text) {
                pIndex++;
                typeParagraph();
                return;
            }

            let charIndex = 0;
            function typeChar() {
                if (charIndex < text.length) {
                    p.textContent += text.charAt(charIndex);
                    charIndex++;
                    playBlip();

                    // Standard conversational typing speed
                    setTimeout(typeChar, Math.random() * 50 + 40);
                } else {
                    pIndex++;
                    setTimeout(typeParagraph, 700);
                }
            }
            typeChar();
        }

        setTimeout(typeParagraph, 1000);
    }

    function createTrail(element) {
        const heart = document.createElement('div');
        const items = ['❤️', '⭐', '🍄', '🪙', '✨'];
        const randomItem = items[Math.floor(Math.random() * items.length)];
        heart.innerHTML = randomItem;
        heart.classList.add('trail-heart');

        const rect = element.getBoundingClientRect();
        const containerRect = fusionContainer.getBoundingClientRect();

        const x = rect.left - containerRect.left + (rect.width / 2) - 10;
        const y = rect.top - containerRect.top + (rect.height / 2) - 10;

        heart.style.left = `${x}px`;
        heart.style.top = `${y}px`;

        fusionContainer.appendChild(heart);

        setTimeout(() => {
            heart.remove();
        }, 800);
    }
});
