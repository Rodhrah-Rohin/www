import { useEffect, useRef, useCallback } from 'react';

const STAR_COUNT = 150;
const GLOW_RADIUS = 120;

export default function Hero() {
    const heroRef = useRef(null);
    const starsRef = useRef([]);
    const scrollIndicatorRef = useRef(null);
    const heroContentRef = useRef(null);
    const verticalAxisRef = useRef(null);

    // Create starfield on mount
    useEffect(() => {
        if (!heroRef.current) return;

        const heroSection = heroRef.current;
        const heroRect = heroSection.getBoundingClientRect();

        // Create stars
        for (let i = 0; i < STAR_COUNT; i++) {
            const star = document.createElement('div');
            star.className = 'star';

            const x = Math.random() * heroRect.width;
            const y = Math.random() * heroRect.height;

            star.style.left = x + 'px';
            star.style.top = y + 'px';

            const size = 1.5 + Math.random() * 1.5;
            star.style.width = size + 'px';
            star.style.height = size + 'px';

            star.dataset.x = x;
            star.dataset.y = y;

            heroSection.appendChild(star);
            starsRef.current.push(star);
        }

        return () => {
            starsRef.current.forEach(star => star.remove());
            starsRef.current = [];
        };
    }, []);

    // Mouse move handler for star glow
    const handleMouseMove = useCallback((e) => {
        if (!heroRef.current) return;

        const heroRect = heroRef.current.getBoundingClientRect();
        const mouseX = e.clientX - heroRect.left;
        const mouseY = e.clientY;
        const scrollY = window.scrollY;

        starsRef.current.forEach(star => {
            const starX = parseFloat(star.dataset.x);
            const starY = parseFloat(star.dataset.y);

            const dx = mouseX - starX;
            const dy = (mouseY + scrollY) - starY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < GLOW_RADIUS) {
                star.classList.add('glow');
            } else {
                star.classList.remove('glow');
            }
        });
    }, []);

    // Mouse leave handler
    const handleMouseLeave = useCallback(() => {
        starsRef.current.forEach(star => star.classList.remove('glow'));
    }, []);

    // Parallax and scroll effects
    useEffect(() => {
        let ticking = false;

        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const scrolled = window.pageYOffset;

                    if (heroContentRef.current && scrolled < window.innerHeight) {
                        const parallaxSpeed = 0.5;
                        heroContentRef.current.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
                        heroContentRef.current.style.opacity = 1 - (scrolled / window.innerHeight) * 0.8;
                    }

                    if (verticalAxisRef.current && scrolled < window.innerHeight) {
                        verticalAxisRef.current.style.opacity = 1 - (scrolled / window.innerHeight);
                    }

                    if (scrollIndicatorRef.current) {
                        if (scrolled > 100) {
                            scrollIndicatorRef.current.style.opacity = '0';
                            scrollIndicatorRef.current.style.pointerEvents = 'none';
                        } else {
                            scrollIndicatorRef.current.style.opacity = '1';
                            scrollIndicatorRef.current.style.pointerEvents = 'auto';
                        }
                    }

                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Vertical axis animation
    useEffect(() => {
        let axisOffset = 0;
        let animationId;

        const animateAxis = () => {
            axisOffset += 0.002;
            const pulse = Math.sin(axisOffset) * 0.15 + 0.45;
            if (verticalAxisRef.current) {
                verticalAxisRef.current.style.opacity = pulse;
            }
            animationId = requestAnimationFrame(animateAxis);
        };

        animateAxis();
        return () => cancelAnimationFrame(animationId);
    }, []);

    const handleScrollClick = () => {
        const aboutSection = document.querySelector('#about');
        if (aboutSection) {
            aboutSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section
            className="hero section tree-rings"
            id="home"
            ref={heroRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <div className="vertical-axis" ref={verticalAxisRef}></div>

            <div className="hero-content" ref={heroContentRef}>
                <div className="logo-container">
                    <img src="/square.png" alt="Rodhrah Rohin Logo" className="brand-logo" />
                </div>

                <h1>Rodhrah Rohin</h1>
                <p className="tagline">
                    Sthitah Pragati Pathi
                    <span style={{ fontSize: '0.6em', display: 'block', opacity: 0.8, marginTop: '0.5rem' }}>
                        (Steady on the path of progress)
                    </span>
                </p>
                <p className="hero-description">
                    A diversified parent corporation built on the timeless philosophy that{' '}
                    <strong>grandeur requires grounding</strong>.
                    We serve as the root system for a multifaceted ecosystem of specialized companies, empowering our branches to
                    reach their highest potential.
                </p>
            </div>

            <div className="scroll-indicator" ref={scrollIndicatorRef} onClick={handleScrollClick}>
                <svg viewBox="0 0 24 24">
                    <polyline points="7 13 12 18 17 13"></polyline>
                    <polyline points="7 6 12 11 17 6"></polyline>
                </svg>
            </div>
        </section>
    );
}
