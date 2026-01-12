import { useRef, useEffect } from 'react';

export default function About() {
    const sectionRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');
                    }
                });
            },
            { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
        );

        const elements = sectionRef.current?.querySelectorAll('.reveal, .reveal-left, .reveal-right');
        elements?.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    const handleCardMouseEnter = (e) => {
        e.currentTarget.style.boxShadow = '0 8px 40px rgba(197, 160, 89, 0.25), 0 0 0 1px rgba(197, 160, 89, 0.1)';
    };

    const handleCardMouseLeave = (e) => {
        e.currentTarget.style.boxShadow = '';
    };

    return (
        <section className="about section tree-rings" id="about" ref={sectionRef}>
            <div className="section-content">
                <h2 className="text-center mb-lg reveal">About Us</h2>

                <div className="about-grid">
                    <div
                        className="about-card reveal-left"
                        onMouseEnter={handleCardMouseEnter}
                        onMouseLeave={handleCardMouseLeave}
                    >
                        <h3>
                            <span className="icon">🌳</span>
                            <span>Rodhrah - Deep Roots</span>
                        </h3>
                        <p>
                            <em>Rodhrah</em> signifies a tree whose roots go deep into the earth, representing humility and
                            groundedness.
                            Our foundations are built on transparency, ethical steadfastness, and deep-rooted integrity.
                        </p>
                    </div>

                    <div
                        className="about-card reveal-right"
                        onMouseEnter={handleCardMouseEnter}
                        onMouseLeave={handleCardMouseLeave}
                    >
                        <h3>
                            <span className="icon">📈</span>
                            <span>Rohin - Ascending Growth</span>
                        </h3>
                        <p>
                            <em>Rohin</em> means growing or ascending, signifying a new beginning and upward movement.
                            We never settle for the status quo; we constantly reach for our ascendant potential.
                        </p>
                    </div>
                </div>

                <div className="mt-lg reveal">
                    <p
                        className="text-center"
                        style={{ fontSize: '1.125rem', maxWidth: '900px', margin: '0 auto', color: 'var(--earth-slate)' }}
                    >
                        Together, <strong className="accent-text">Rodhrah Rohin</strong> represents an entity that is rooted in depth and
                        rising in spirit.
                        Drawing from the imagery of a tree with deep foundations and the energy of upward ascension,
                        we believe that <em>the higher you wish to reach, the deeper you must be rooted</em>.
                    </p>
                </div>
            </div>
        </section>
    );
}
