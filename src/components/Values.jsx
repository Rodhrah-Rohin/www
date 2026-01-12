import { useRef, useEffect, useCallback } from 'react';

const valuesData = [
    {
        icon: '🏛️',
        title: 'Deep-Rooted Integrity',
        description:
            'Our foundations are built on transparency and ethical steadfastness. We believe that integrity is not just a value, but the very bedrock upon which all progress must stand.',
    },
    {
        icon: '🚀',
        title: 'Ascendant Innovation',
        description:
            'We never settle for the status quo; we are constantly reaching for the "Rohin" (upward) potential. Innovation is not just encouraged—it\'s woven into our DNA.',
    },
    {
        icon: '⚖️',
        title: 'Sustained Progress',
        description:
            'We value the "Steady Path" over shortcuts, ensuring our growth is permanent, not fleeting. Our tagline, Sthitah Pragati Pathi, embodies this commitment to steady advancement.',
    },
    {
        icon: '🌲',
        title: 'Ecosystem Synergy',
        description:
            'Like a forest, our companies thrive through interconnected support and shared resources. We cultivate an environment where each branch strengthens the whole.',
    },
];

export default function Values() {
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

        const elements = sectionRef.current?.querySelectorAll('.reveal');
        elements?.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    // 3D tilt effect handlers
    const handleMouseEnter = useCallback((e) => {
        e.currentTarget.style.transition = 'all 0.1s ease';
    }, []);

    const handleMouseMove = useCallback((e) => {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        card.style.transform = `translateY(-12px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }, []);

    const handleMouseLeave = useCallback((e) => {
        const card = e.currentTarget;
        card.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        card.style.transform = 'translateY(0) rotateX(0) rotateY(0)';
    }, []);

    return (
        <section className="values section tree-rings" id="values" ref={sectionRef}>
            <div className="section-content">
                <h2 className="text-center mb-lg reveal">Our Values</h2>

                <div className="values-grid">
                    {valuesData.map((value, index) => (
                        <div
                            key={index}
                            className="value-card reveal"
                            onMouseEnter={handleMouseEnter}
                            onMouseMove={handleMouseMove}
                            onMouseLeave={handleMouseLeave}
                        >
                            <h3>
                                {value.icon} {value.title}
                            </h3>
                            <p>
                                {value.title === 'Sustained Progress' ? (
                                    <>
                                        We value the "Steady Path" over shortcuts, ensuring our growth is permanent, not fleeting.
                                        Our tagline, <em className="accent-text">Sthitah Pragati Pathi</em>, embodies this commitment to steady
                                        advancement.
                                    </>
                                ) : (
                                    value.description
                                )}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
