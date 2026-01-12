/**
 * RODHRAH ROHIN - INTERACTIVE ELEMENTS
 * Scroll animations, parallax effects, and micro-interactions
 */

// ============================================
// 1. INTERSECTION OBSERVER FOR SCROLL REVEALS
// ============================================
const observerOptions = {
  threshold: 0.15,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
    }
  });
}, observerOptions);

// Observe all reveal elements
document.addEventListener('DOMContentLoaded', () => {
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  revealElements.forEach(el => observer.observe(el));
});

// ============================================
// 2. SMOOTH SCROLL FOR SCROLL INDICATOR
// ============================================
const scrollIndicator = document.querySelector('.scroll-indicator');
if (scrollIndicator) {
  scrollIndicator.addEventListener('click', () => {
    const aboutSection = document.querySelector('#about');
    aboutSection.scrollIntoView({ behavior: 'smooth' });
  });
}

// ============================================
// 3. PARALLAX EFFECT ON HERO SECTION
// ============================================
let ticking = false;

function parallaxScroll() {
  const scrolled = window.pageYOffset;
  const hero = document.querySelector('.hero-content');
  const verticalAxis = document.querySelector('.vertical-axis');

  if (hero && scrolled < window.innerHeight) {
    const parallaxSpeed = 0.5;
    hero.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
    hero.style.opacity = 1 - (scrolled / window.innerHeight) * 0.8;
  }

  if (verticalAxis && scrolled < window.innerHeight) {
    verticalAxis.style.opacity = 1 - (scrolled / window.innerHeight);
  }

  ticking = false;
}

window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(parallaxScroll);
    ticking = true;
  }
});

// ============================================
// 4. HIDE SCROLL INDICATOR ON SCROLL
// ============================================
window.addEventListener('scroll', () => {
  const scrollIndicator = document.querySelector('.scroll-indicator');
  if (scrollIndicator) {
    if (window.pageYOffset > 100) {
      scrollIndicator.style.opacity = '0';
      scrollIndicator.style.pointerEvents = 'none';
    } else {
      scrollIndicator.style.opacity = '1';
      scrollIndicator.style.pointerEvents = 'auto';
    }
  }
});

// ============================================
// 5. VALUE CARDS 3D TILT EFFECT (SUBTLE)
// ============================================
const valueCards = document.querySelectorAll('.value-card');

valueCards.forEach(card => {
  card.addEventListener('mouseenter', function () {
    this.style.transition = 'all 0.1s ease';
  });

  card.addEventListener('mousemove', function (e) {
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;

    this.style.transform = `translateY(-12px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  card.addEventListener('mouseleave', function () {
    this.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
    this.style.transform = 'translateY(0) rotateX(0) rotateY(0)';
  });
});

// ============================================
// 6. ABOUT CARDS HOVER GLOW EFFECT
// ============================================
const aboutCards = document.querySelectorAll('.about-card');

aboutCards.forEach(card => {
  card.addEventListener('mouseenter', function () {
    this.style.boxShadow = '0 8px 40px rgba(197, 160, 89, 0.25), 0 0 0 1px rgba(197, 160, 89, 0.1)';
  });

  card.addEventListener('mouseleave', function () {
    this.style.boxShadow = '';
  });
});

// ============================================
// 7. VERTICAL AXIS DYNAMIC ANIMATION
// ============================================
const verticalAxis = document.querySelector('.vertical-axis');

if (verticalAxis) {
  let axisOffset = 0;

  function animateAxis() {
    axisOffset += 0.002;
    const pulse = Math.sin(axisOffset) * 0.15 + 0.45;
    verticalAxis.style.opacity = pulse;

    requestAnimationFrame(animateAxis);
  }

  animateAxis();
}

// ============================================
// 8. SMOOTH ENTRANCE FOR HERO ELEMENTS
// ============================================
window.addEventListener('load', () => {
  const hero = document.querySelector('.hero');
  if (hero) {
    hero.style.opacity = '1';
  }
});

// ============================================
// 9. PERFORMANCE OPTIMIZATION
// ============================================
// Reduce animations on low-performance devices
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
    el.classList.add('active');
  });

  // Disable parallax on reduced motion preference
  window.removeEventListener('scroll', parallaxScroll);
}

// ============================================
// 10. STARFIELD EFFECT ON HERO SECTION
// ============================================
const heroSection = document.querySelector('.hero');
const stars = [];
const STAR_COUNT = 150; // Number of stars to generate
const GLOW_RADIUS = 120; // Radius in pixels for glow effect

if (heroSection) {
  // Create stationary stars on page load
  function createStarfield() {
    const heroRect = heroSection.getBoundingClientRect();

    for (let i = 0; i < STAR_COUNT; i++) {
      const star = document.createElement('div');
      star.className = 'star';

      // Random position within hero section
      const x = Math.random() * heroRect.width;
      const y = Math.random() * heroRect.height;

      star.style.left = x + 'px';
      star.style.top = y + 'px';

      // Vary star size slightly
      const size = 1.5 + Math.random() * 1.5;
      star.style.width = size + 'px';
      star.style.height = size + 'px';

      // Store position for distance calculations
      star.dataset.x = x;
      star.dataset.y = y;

      heroSection.appendChild(star);
      stars.push(star);
    }
  }

  // Calculate distance and apply glow effect
  function updateStarGlow(mouseX, mouseY) {
    const heroRect = heroSection.getBoundingClientRect();
    const scrollY = window.scrollY;

    stars.forEach(star => {
      const starX = parseFloat(star.dataset.x);
      const starY = parseFloat(star.dataset.y);

      // Calculate distance from mouse to star
      const dx = mouseX - starX;
      const dy = (mouseY + scrollY) - starY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Glow stars within radius
      if (distance < GLOW_RADIUS) {
        star.classList.add('glow');
      } else {
        star.classList.remove('glow');
      }
    });
  }

  // Mouse move event listener
  heroSection.addEventListener('mousemove', (e) => {
    const heroRect = heroSection.getBoundingClientRect();
    const mouseX = e.clientX - heroRect.left;
    const mouseY = e.clientY;

    updateStarGlow(mouseX, mouseY);
  });

  // Mouse leave - remove all glows
  heroSection.addEventListener('mouseleave', () => {
    stars.forEach(star => star.classList.remove('glow'));
  });

  // Initialize starfield
  createStarfield();
}

// ============================================
// 11. CONSOLE GREETING
// ============================================
// ============================================
// 12. DYNAMIC ECOSYSTEM/BRANCHES LOADER
// ============================================
// ============================================
// 12. CANVAS-BASED FOREST VISUALIZER (BOTTOM-UP)
// ============================================

class ForestVisualizer {
  constructor(canvasId, dataUrl) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.dataUrl = dataUrl;
    this.nodes = [];
    this.rootNode = null;
    this.hoveredNode = null;
    this.mouse = { x: 0, y: 0 };
    this.isLoaded = false;
    this.images = {}; // Cache for loaded images

    // Layout Config
    this.config = {
      cardWidth: 200,
      cardHeight: 100,
      rootSize: 80, // Radius for root circle
      levelHeight: 160, // Vertical spacing (reduced slightly for upward fit)
      siblingGap: 40,   // Horizontal spacing
      colors: {
        teal: '#0D2C2E',
        gold: '#C5A059',
        white: '#FFFFFF',
        slate: '#4A4A48',
        bg: '#F4F1EA'
      }
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
    await this.loadImages(); // Preload static assets
    await this.loadData();
    if (this.isLoaded) {
      this.calculateLayout();
      requestAnimationFrame(this.loop);
    }
  }

  loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null); // Resolve null on error to not break app
      img.src = src;
    });
  }

  async loadImages() {
    // Preload Root Logo
    const rootLogo = await this.loadImage('docs/square.png');
    if (rootLogo) this.images['root'] = rootLogo;
  }

  handleResize() {
    const container = this.canvas.parentElement;
    const dpr = window.devicePixelRatio || 1;

    this.canvas.width = container.clientWidth * dpr;
    this.canvas.height = container.clientHeight * dpr;
    this.canvas.style.width = container.clientWidth + 'px';
    this.canvas.style.height = container.clientHeight + 'px';

    this.ctx.scale(dpr, dpr);
    this.width = container.clientWidth;
    this.height = container.clientHeight;

    if (this.isLoaded) this.calculateLayout();
  }

  async loadData() {
    try {
      const response = await fetch(this.dataUrl);
      const data = await response.json();

      // Transform data into tree
      const items = data.children;
      const childrenMap = {};
      const rootItems = [];

      // Load individual branch logos if they exist
      const logoPromises = items.map(async item => {
        if (item.logo) {
          const img = await this.loadImage(item.logo);
          if (img) this.images[item.id] = img;
        }
      });
      await Promise.all(logoPromises);

      items.forEach(item => {
        item.children = []; // Init children array
        if (item.parent) {
          if (!childrenMap[item.parent]) childrenMap[item.parent] = [];
          childrenMap[item.parent].push(item);
        } else {
          rootItems.push(item);
        }
      });

      // Link parents and children
      items.forEach(item => {
        if (childrenMap[item.id]) {
          item.children = childrenMap[item.id];
        }
      });

      // Construct Super Root
      this.rootNode = {
        id: 'root',
        name: 'Rodhrah Rohin',
        type: 'root',
        children: rootItems,
        x: 0,
        y: 0,
        opacity: 0
      };

      // Flatten nodes for easy rendering loop
      this.nodes = [this.rootNode];
      const traverse = (node) => {
        if (node.children) {
          node.children.forEach(child => {
            child.type = 'branch';
            child.parent = node;
            child.opacity = 0; // For entrance animation
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
    // INVERSION: Start from bottom
    const bottomPadding = 120; // Space from bottom edge
    const startY = this.height - bottomPadding;

    // 1. Position Root (Bottom Center)
    this.rootNode.x = centerX;
    this.rootNode.y = startY;
    this.rootNode.width = this.config.rootSize * 2;
    this.rootNode.height = this.config.rootSize * 2;

    // 2. Position Children (Level 1) - Growing UP
    const level1Y = startY - this.config.levelHeight; // Subtract height to go up
    const level1Count = this.rootNode.children.length;

    // Dynamic Sizing based on content
    this.rootNode.children.forEach(child => {
      child.hasLogo = !!this.images[child.id];
      if (child.hasLogo) {
        child.width = 100; // Square for circle
        child.height = 100;
      } else {
        child.width = this.config.cardWidth;
        child.height = 70; // Compact height for text-only
      }
    });

    // Recalculate total width based on dynamic widths
    let currentX = 0;
    const gap = this.config.siblingGap;
    const totalWidth = this.rootNode.children.reduce((acc, child) => acc + child.width, 0) + (level1Count - 1) * gap;
    let startX = centerX - (totalWidth / 2);

    this.rootNode.children.forEach((child) => {
      child.x = startX + (child.width / 2); // Center of the node
      startX += child.width + gap;

      child.y = level1Y; // Center Y alignment

      // 3. Position Grandchildren (Level 2) - Growing UP further
      if (child.children && child.children.length > 0) {
        const level2Y = level1Y - this.config.levelHeight; // Go higher
        child.children.forEach(grandChild => {
          grandChild.hasLogo = !!this.images[grandChild.id];

          if (grandChild.hasLogo) {
            grandChild.width = 90;
            grandChild.height = 90;
          } else {
            grandChild.width = this.config.cardWidth * 0.9;
            grandChild.height = 60;
          }

          grandChild.x = child.x;
          grandChild.y = level2Y;
        });
      }
    });
  }

  handleMouseMove(e) {
    const rect = this.canvas.getBoundingClientRect();
    this.mouse.x = e.clientX - rect.left;
    this.mouse.y = e.clientY - rect.top;

    let found = null;
    for (let node of this.nodes) {
      let halfW = node.width / 2;
      let halfH = node.height / 2;

      if (node.type === 'root' || node.hasLogo) {
        // Circular collision for root AND logo nodes
        const dx = this.mouse.x - node.x;
        const dy = this.mouse.y - node.y;
        const radius = Math.max(halfW, halfH);
        if (Math.sqrt(dx * dx + dy * dy) < radius) found = node;
      } else {
        if (this.mouse.x > node.x - halfW &&
          this.mouse.x < node.x + halfW &&
          this.mouse.y > node.y - halfH &&
          this.mouse.y < node.y + halfH) {
          found = node;
        }
      }
    }

    this.hoveredNode = found;
    this.canvas.style.cursor = found ? 'pointer' : 'default';

    // Tooltip Logic
    const tooltip = document.getElementById('forest-tooltip');
    if (tooltip && found) {
      tooltip.innerHTML = `
         <h4>${found.name}</h4>
         ${found.tagline ? `<span class="tagline">${found.tagline}</span>` : ''}
         ${found.description ? `<p>${found.description}</p>` : ''}
       `;
      tooltip.style.left = (this.mouse.x) + 'px';
      tooltip.style.top = (this.mouse.y) + 'px'; // Offset handled by CSS translate
      tooltip.classList.add('active');
    } else if (tooltip) {
      tooltip.classList.remove('active');
    }
  }

  handleClick() {
    if (this.hoveredNode && this.hoveredNode.website) {
      window.open(this.hoveredNode.website, '_blank');
    }
  }

  drawConnector(parent, child) {
    this.ctx.beginPath();
    // INVERSION: Connect Parent Top to Child Bottom
    const startY = parent.type === 'root' ? parent.y - this.config.rootSize : parent.y - parent.height / 2;
    this.ctx.moveTo(parent.x, startY);

    const endY = child.y + child.height / 2;
    const midY = (startY + endY) / 2;

    this.ctx.bezierCurveTo(
      parent.x, midY,
      child.x, midY,
      child.x, endY
    );

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
      // ROOT NODE
      // Removed explicit teal circle background/border as requested

      const logo = this.images['root'];
      if (logo) {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(0, 0, this.config.rootSize, 0, Math.PI * 2);
        this.ctx.clip();

        // Fill white background behind logo just in case transparent png needs contrast?
        // User said "remove extra green circle". Assuming white bg is safer than transparent (canvas bg)
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fill();

        // Zoom in to crop out the built-in gold/teal ring border of the image
        const displaySize = this.config.rootSize * 2.5;
        this.ctx.drawImage(logo, -displaySize / 2, -displaySize / 2, displaySize, displaySize);
        this.ctx.restore();

        // BORDER REMOVED AS REQUESTED

      } else {
        // Fallback if image not loaded
        this.ctx.beginPath();
        this.ctx.arc(0, 0, this.config.rootSize, 0, Math.PI * 2);
        this.ctx.fillStyle = this.config.colors.teal;
        this.ctx.fill();
        this.ctx.fillStyle = this.config.colors.white;
        this.ctx.fillText('Rodhrah Rohin', 0, 0);
      }

    } else {
      // BRANCH NODES
      const w = node.width;
      const h = node.height;

      const nodeImg = this.images[node.id];

      if (nodeImg) {
        // --- LOGO MODE: Circular Image ---
        this.ctx.shadowBlur = isHovered ? 15 : 5;
        this.ctx.shadowOffsetY = isHovered ? 5 : 2;

        this.ctx.save();
        this.ctx.beginPath();
        // Draw Circle
        const radius = Math.min(w, h) / 2;
        this.ctx.arc(0, 0, radius, 0, Math.PI * 2);
        this.ctx.clip();

        this.ctx.fillStyle = '#FFFFFF'; // Background for transparent logos
        this.ctx.fill();

        // Draw Image
        const maxDim = radius * 2;
        // Contain the image
        const paddingFactor = 1.0; // User wants to match screenshot, assume full bleed if possible or slight padding
        // Screenshot shows Optiyan filling the circle nicely.
        const fitSize = maxDim * paddingFactor;

        const imgRatio = Math.min(fitSize / nodeImg.width, fitSize / nodeImg.height);
        const drawW = nodeImg.width * imgRatio;
        const drawH = nodeImg.height * imgRatio;

        this.ctx.drawImage(nodeImg, -drawW / 2, -drawH / 2, drawW, drawH);
        this.ctx.restore();

        // REMOVED BORDER STROKE AS REQUESTED
      } else {
        // --- TEXT MODE: Compact Card ---
        this.ctx.fillStyle = '#FFFFFF';
        this.roundRect(-w / 2, -h / 2, w, h, 8);
        this.ctx.fill();

        // Top Border
        this.ctx.beginPath();
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.roundRect(-w / 2, -h / 2, w, 4, [8, 8, 0, 0]);
        this.ctx.fillStyle = isHovered ? this.config.colors.gold : this.config.colors.teal;
        this.ctx.fill();
        this.ctx.restore();

        // Text
        this.ctx.shadowBlur = 0;
        this.ctx.shadowOffsetY = 0;

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
    // Clear
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Draw Connectors first (behind nodes)
    this.nodes.forEach(node => {
      if (node.children) {
        node.children.forEach(child => this.drawConnector(node, child));
      }
    });

    // Draw Nodes
    this.nodes.forEach(node => this.drawNode(node));

    requestAnimationFrame(this.loop);
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  new ForestVisualizer('forest-canvas', 'docs/branches.json');
});
