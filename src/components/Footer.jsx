export default function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <img src="/horizontal-sanskrit.png" alt="Rodhrah Rohin" className="footer-logo" />

                <p className="footer-tagline sanskrit">स्थितः प्रगति पथि</p>

                <div className="footer-content">
                    <p>
                        Rodhrah Rohin - Where deep roots meet ascending ambitions.
                        Building a global forest of enterprises that lead with purpose and grow with stability.
                    </p>
                </div>

                <div className="footer-divider"></div>

                <p className="copyright">
                    &copy; {new Date().getFullYear()} Rodhrah Rohin. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
