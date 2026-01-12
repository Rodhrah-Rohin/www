import { useRef, useEffect } from 'react';

export default function VisionMission() {
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

        const elements = sectionRef.current?.querySelectorAll('.reveal-left, .reveal-right');
        elements?.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    return (
        <section className="vision-mission section" id="vision-mission" ref={sectionRef}>
            <div className="section-content">
                <div className="vm-container">
                    <div className="vm-block reveal-left">
                        <h2>Our Vision</h2>
                        <p>
                            To be the world's most resilient foundation for innovation, fostering a global forest of enterprises
                            that lead with purpose, grow with stability, ascend with spirit, and positively impact the world.
                        </p>
                    </div>

                    <div className="vm-block reveal-right">
                        <h2>Our Mission</h2>
                        <p>
                            To provide our partner companies and subsidiaries with the strategic depth, ethical grounding,
                            and structural support necessary to achieve sustainable, vertical growth. We bridge the gap between
                            ancient wisdom and modern industry to create businesses that are as enduring as they are evolved
                            to better the world we live in.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
