import { useRef, useEffect, useState, useCallback } from 'react';

export default function Ecosystem() {
    const sectionRef = useRef(null);
    const canvasRef = useRef(null);
    const tooltipRef = useRef(null);
    const [visualizer, setVisualizer] = useState(null);

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

    useEffect(() => {
        if (!canvasRef.current) return;

        const viz = new ForestVisualizer(canvasRef.current, tooltipRef.current, '/branches.json');
        setVisualizer(viz);

        return () => {
            viz.destroy();
        };
    }, []);

    return (
        <section className="ecosystem section" id="branches" ref={sectionRef}>
            <div className="section-content">
                <h2 className="text-center mb-lg reveal">Our Growing Forest</h2>
                <p
                    className="text-center mb-lg reveal"
                    style={{ maxWidth: '700px', marginLeft: 'auto', marginRight: 'auto', opacity: 0.8 }}
                >
                    Like a mighty banyan, Rodhrah Rohin branches out into specialized domains, each rooted in our core values while
                    reaching for new heights.
                </p>

                <div
                    className="canvas-container"
                    style={{
                        position: 'relative',
                        width: '100%',
                        height: '600px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <canvas ref={canvasRef} id="forest-canvas"></canvas>
                    <div ref={tooltipRef} className="forest-tooltip"></div>
                </div>
            </div>
        </section>
    );
}

// ForestVisualizer Class
class ForestVisualizer {
    constructor(canvas, tooltip, dataUrl) {
        this.canvas = canvas;
        this.tooltip = tooltip;
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.dataUrl = dataUrl;
        this.nodes = [];
        this.rootNode = null;
        this.hoveredNode = null;
        this.mouse = { x: 0, y: 0 };
        this.isLoaded = false;
        this.images = {};
        this.animationId = null;
        this.isDestroyed = false;

        // Layout Config
        this.config = {
            cardWidth: 200,
            cardHeight: 100,
            rootSize: 80,
            levelHeight: 160,
            siblingGap: 40,
            scale: 1,
            colors: {
                teal: '#0D2C2E',
                gold: '#C5A059',
                white: '#FFFFFF',
                slate: '#4A4A48',
                bg: '#F4F1EA',
            },
        };

        // Bindings
        this.handleResize = this.handleResize.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.loop = this.loop.bind(this);

        window.addEventListener('resize', this.handleResize);
        this.canvas.addEventListener('mousemove', this.handleMouseMove);
        this.canvas.addEventListener('click', this.handleClick);

        this.init();
    }

    async init() {
        this.handleResize();
        await this.loadImages();
        await this.loadData();
        if (this.isLoaded && !this.isDestroyed) {
            this.calculateLayout();
            this.animationId = requestAnimationFrame(this.loop);
        }
    }

    destroy() {
        this.isDestroyed = true;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        window.removeEventListener('resize', this.handleResize);
        this.canvas.removeEventListener('mousemove', this.handleMouseMove);
        this.canvas.removeEventListener('click', this.handleClick);
    }

    loadImage(src) {
        return new Promise((resolve) => {
            const img = new Image();
            // Removing crossOrigin might allow loading locally without CORS headers
            // and since we are only drawing to canvas (not reading pixels), it's safe.
            img.onload = () => resolve(img);
            img.onerror = () => resolve(null);
            img.src = src;
        });
    }

    async loadImages() {
        const rootLogo = await this.loadImage('/square.png');
        if (rootLogo) this.images['root'] = rootLogo;
    }

    handleResize() {
        if (this.isDestroyed) return;

        const container = this.canvas.parentElement;
        const dpr = window.devicePixelRatio || 1;

        const viewportWidth = window.innerWidth;
        const padding = 40;
        const targetWidth = Math.min(container.clientWidth, viewportWidth - padding);

        this.canvas.width = targetWidth * dpr;
        this.canvas.height = container.clientHeight * dpr;
        this.canvas.style.width = targetWidth + 'px';
        this.canvas.style.height = container.clientHeight + 'px';

        this.ctx.scale(dpr, dpr);
        this.width = targetWidth;
        this.height = container.clientHeight;

        // Adaptive Config for Mobile
        if (this.width < 768) {
            this.config.cardWidth = 140;
            this.config.siblingGap = 20;
            this.config.rootSize = 60;
            this.config.levelHeight = 130;

            const projectedWidth = this.config.cardWidth * 3 + this.config.siblingGap * 2;
            if (projectedWidth > this.width - 20) {
                this.config.scale = (this.width - 20) / projectedWidth;
            } else {
                this.config.scale = 1;
            }
        } else {
            this.config.cardWidth = 200;
            this.config.siblingGap = 40;
            this.config.rootSize = 80;
            this.config.levelHeight = 160;
            this.config.scale = 1;
        }

        if (this.isLoaded) this.calculateLayout();
    }

    async loadData() {
        try {
            const response = await fetch(this.dataUrl);
            const data = await response.json();

            const items = data.children;
            const childrenMap = {};
            const rootItems = [];

            // Load individual branch logos
            const logoPromises = items.map(async (item) => {
                if (item.logo) {
                    const img = await this.loadImage(item.logo);
                    if (img) this.images[item.id] = img;
                }
            });
            await Promise.all(logoPromises);

            items.forEach((item) => {
                item.children = [];
                if (item.parent) {
                    if (!childrenMap[item.parent]) childrenMap[item.parent] = [];
                    childrenMap[item.parent].push(item);
                } else {
                    rootItems.push(item);
                }
            });

            items.forEach((item) => {
                if (childrenMap[item.id]) {
                    item.children = childrenMap[item.id];
                }
            });

            this.rootNode = {
                id: 'root',
                name: 'Rodhrah Rohin',
                type: 'root',
                children: rootItems,
                x: 0,
                y: 0,
                opacity: 0,
            };

            this.nodes = [this.rootNode];
            const traverse = (node) => {
                if (node.children) {
                    node.children.forEach((child) => {
                        child.type = 'branch';
                        child.parent = node;
                        child.opacity = 0;
                        this.nodes.push(child);
                        traverse(child);
                    });
                }
            };
            traverse(this.rootNode);

            this.isLoaded = true;
        } catch (e) {
            console.error('Forest Visualizer Error:', e);
        }
    }

    calculateLayout() {
        const centerX = this.width / 2;
        const bottomPadding = 120;
        const startY = this.height - bottomPadding;

        this.rootNode.x = centerX;
        this.rootNode.y = startY;
        this.rootNode.width = this.config.rootSize * 2;
        this.rootNode.height = this.config.rootSize * 2;

        const level1Y = startY - this.config.levelHeight;

        this.rootNode.children.forEach((child) => {
            child.hasLogo = !!child.logo;
            if (child.hasLogo) {
                const size = this.width < 768 ? 70 : 100;
                child.width = size;
                child.height = size;
            } else {
                child.width = this.config.cardWidth;
                child.height = this.width < 768 ? 50 : 70;
            }
        });

        const gap = this.config.siblingGap;
        const totalWidth =
            this.rootNode.children.reduce((acc, child) => acc + child.width, 0) +
            (this.rootNode.children.length - 1) * gap;
        let startX = centerX - totalWidth / 2;

        this.rootNode.children.forEach((child) => {
            child.x = startX + child.width / 2;
            startX += child.width + gap;
            child.y = level1Y;

            if (child.children && child.children.length > 0) {
                const level2Y = level1Y - this.config.levelHeight;
                child.children.forEach((grandChild) => {
                    grandChild.hasLogo = !!grandChild.logo;

                    if (grandChild.hasLogo) {
                        const size = this.width < 768 ? 60 : 90;
                        grandChild.width = size;
                        grandChild.height = size;
                    } else {
                        grandChild.width = this.config.cardWidth * 0.9;
                        grandChild.height = this.width < 768 ? 45 : 60;
                    }

                    grandChild.x = child.x;
                    grandChild.y = level2Y;
                });
            }
        });
    }

    handleMouseMove(e) {
        if (this.isDestroyed) return;

        const rect = this.canvas.getBoundingClientRect();
        const scale = this.config.scale || 1;
        this.mouse.x = (e.clientX - rect.left) / scale;
        this.mouse.y = (e.clientY - rect.top) / scale;

        let found = null;
        for (let node of this.nodes) {
            let halfW = node.width / 2;
            let halfH = node.height / 2;

            if (node.type === 'root' || node.hasLogo) {
                const dx = this.mouse.x - node.x;
                const dy = this.mouse.y - node.y;
                const radius = Math.max(halfW, halfH);
                if (Math.sqrt(dx * dx + dy * dy) < radius) found = node;
            } else {
                if (
                    this.mouse.x > node.x - halfW &&
                    this.mouse.x < node.x + halfW &&
                    this.mouse.y > node.y - halfH &&
                    this.mouse.y < node.y + halfH
                ) {
                    found = node;
                }
            }
        }

        this.hoveredNode = found;
        this.canvas.style.cursor = found ? 'pointer' : 'default';

        // Tooltip Logic
        if (this.tooltip && found) {
            this.tooltip.innerHTML = `
         <h4>${found.name}</h4>
         ${found.tagline ? `<span class="tagline">${found.tagline}</span>` : ''}
         ${found.description ? `<p>${found.description}</p>` : ''}
       `;
            this.tooltip.style.left = this.mouse.x + 'px';
            this.tooltip.style.top = this.mouse.y + 'px';
            this.tooltip.classList.add('active');
        } else if (this.tooltip) {
            this.tooltip.classList.remove('active');
        }
    }

    handleClick() {
        if (this.hoveredNode && this.hoveredNode.website) {
            window.open(this.hoveredNode.website, '_blank');
        }
    }

    drawConnector(parent, child) {
        this.ctx.beginPath();
        const startY = parent.type === 'root' ? parent.y - this.config.rootSize : parent.y - parent.height / 2;
        this.ctx.moveTo(parent.x, startY);

        const endY = child.y + child.height / 2;
        const midY = (startY + endY) / 2;

        this.ctx.bezierCurveTo(parent.x, midY, child.x, midY, child.x, endY);

        this.ctx.strokeStyle = this.config.colors.gold;
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
    }

    roundRect(x, y, w, h, radius) {
        const r = x + w;
        const b = y + h;
        this.ctx.beginPath();
        this.ctx.moveTo(x + radius, y);
        this.ctx.lineTo(r - radius, y);
        this.ctx.quadraticCurveTo(r, y, r, y + radius);
        this.ctx.lineTo(r, b - radius);
        this.ctx.quadraticCurveTo(r, b, r - radius, b);
        this.ctx.lineTo(x + radius, b);
        this.ctx.quadraticCurveTo(x, b, x, b - radius);
        this.ctx.lineTo(x, y + radius);
        this.ctx.quadraticCurveTo(x, y, x + radius, y);
        this.ctx.closePath();
    }

    drawNode(node) {
        if (node.opacity < 1) node.opacity += 0.02;

        const isHovered = this.hoveredNode === node;
        const scale = isHovered ? 1.05 : 1;

        this.ctx.save();
        this.ctx.translate(node.x, node.y);
        this.ctx.scale(scale, scale);
        this.ctx.globalAlpha = node.opacity;

        // Shadow
        this.ctx.shadowColor = 'rgba(197, 160, 89, 0.3)';
        this.ctx.shadowBlur = 10;
        this.ctx.shadowOffsetY = 2;

        if (node.type === 'root') {
            const logo = this.images['root'];
            if (logo) {
                this.ctx.save();
                this.ctx.beginPath();
                this.ctx.arc(0, 0, this.config.rootSize, 0, Math.PI * 2);
                this.ctx.clip();

                this.ctx.fillStyle = '#FFFFFF';
                this.ctx.fill();

                const displaySize = this.config.rootSize * 2.8;
                this.ctx.drawImage(logo, -displaySize / 2, -displaySize / 2, displaySize, displaySize);
                this.ctx.restore();

                this.ctx.shadowBlur = 5;
                this.ctx.shadowOffsetY = 2;
            } else {
                this.ctx.beginPath();
                this.ctx.arc(0, 0, this.config.rootSize, 0, Math.PI * 2);
                this.ctx.fillStyle = this.config.colors.teal;
                this.ctx.fill();
                this.ctx.fillStyle = this.config.colors.white;
                this.ctx.fillText('Rodhrah Rohin', 0, 0);
            }
        } else {
            const w = node.width;
            const h = node.height;
            const nodeImg = this.images[node.id];

            if (nodeImg || node.hasLogo) {
                // Circular Logo Node (Branch)
                this.ctx.shadowBlur = isHovered ? 15 : 5;
                this.ctx.shadowOffsetY = isHovered ? 5 : 2;

                const radius = Math.min(w, h) / 2;

                this.ctx.save();
                this.ctx.beginPath();
                this.ctx.arc(0, 0, radius, 0, Math.PI * 2);
                this.ctx.clip();

                this.ctx.fillStyle = '#FFFFFF';
                this.ctx.fill();

                if (nodeImg) {
                    const paddingFactor = 1.0; // Fill the circle more fully
                    const fitSize = radius * 2 * paddingFactor;
                    const imgRatio = Math.min(fitSize / nodeImg.width, fitSize / nodeImg.height);
                    const drawW = nodeImg.width * imgRatio;
                    const drawH = nodeImg.height * imgRatio;
                    this.ctx.drawImage(nodeImg, -drawW / 2, -drawH / 2, drawW, drawH);
                } else {
                    // Placeholder circle color if image fails
                    this.ctx.fillStyle = this.config.colors.gold;
                    this.ctx.fill();
                }
                this.ctx.restore();

                // REMOVED text labels below circular nodes per user request
            } else {
                // Card Node (for nodes without logos)
                this.ctx.fillStyle = '#FFFFFF';
                this.roundRect(-w / 2, -h / 2, w, h, 8);
                this.ctx.fill();

                this.ctx.save();
                this.ctx.beginPath();
                this.ctx.roundRect(-w / 2, -h / 2, w, 4, [8, 8, 0, 0]);
                this.ctx.fillStyle = isHovered ? this.config.colors.gold : this.config.colors.teal;
                this.ctx.fill();
                this.ctx.restore();

                this.ctx.fillStyle = this.config.colors.teal;
                this.ctx.font = 'bold 16px Cinzel';
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                this.ctx.fillText(node.name, 0, node.tagline ? -8 : 0);

                if (node.tagline) {
                    this.ctx.fillStyle = this.config.colors.gold;
                    this.ctx.font = 'italic 11px Montserrat';
                    this.ctx.fillText(node.tagline, 0, 10);
                }
            }
        }

        this.ctx.restore();
    }

    loop() {
        if (this.isDestroyed) return;

        this.ctx.clearRect(0, 0, this.width / this.config.scale, this.height / this.config.scale);

        this.ctx.save();
        if (this.config.scale !== 1) {
            this.ctx.scale(this.config.scale, this.config.scale);
        }

        // Draw Connectors first (behind nodes)
        this.nodes.forEach((node) => {
            if (node.children) {
                node.children.forEach((child) => this.drawConnector(node, child));
            }
        });

        // Draw Nodes
        this.nodes.forEach((node) => this.drawNode(node));

        this.ctx.restore();

        this.animationId = requestAnimationFrame(this.loop);
    }
}
