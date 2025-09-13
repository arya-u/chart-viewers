/**
 * Animated Chart Modal Component
 * A standalone module that creates an animated pie chart with floating images
 * Converted from React TypeScript components to vanilla JavaScript
 */

/**
 * AnimatedChartModal Class
 * Encapsulates all functionality for creating and managing animated chart modals
 */
class AnimatedChartModal {
  // Configuration constants for all magic numbers
  static CONFIGS = {
    // Default dimensions
    DEFAULT_CONTAINER_WIDTH: 480,
    DEFAULT_CONTAINER_HEIGHT: 350,
    
    // Layout percentages
    CHART_WIDTH_PERCENT: 0.9,
    CHART_HEIGHT_PERCENT: 0.92,
    CENTER_X_PERCENT: 0.50,
    CENTER_Y_PERCENT: 0.50,
    
    // Image sizing
    IMAGE_WIDTH_PERCENT: 0.25,
    IMAGE_WIDTH_SCALE: 0.9,
    IMAGE_MIN_WIDTH: 20,
    IMAGE_MAX_WIDTH: 150,
    IMAGE_ASPECT_RATIO: 0.65,
    IMAGE_SVG_HEIGHT_RATIO: 0.55,
    IMAGE_FONT_SIZE_RATIO: 0.08,
    MIN_FONT_SIZE: 10,
    
    // Scatter positioning
    SCATTER_RADIUS_PERCENT: 0.40,
    RANDOM_DELTA_PERCENT: 0.01,
    SPREAD_MULTIPLIER: 3,
    ANGLE_VARIATION: 0.25,
    MAX_ROTATION: 20,
    
    // Bounds (percentage)
    MAX_X_BOUND: 180,
    MIN_X_BOUND: -810,
    MAX_Y_BOUND: 180,
    MIN_Y_BOUND: -180,
    
    // Animation timing
    ANIMATION_DELAY_STEP: 0.05,
    AUTO_START_DELAY: 500,
    PIE_CHART_DELAY: 200,
    COMPLETION_CALLBACK_DELAY: 4500,
    
    // Percentage animation
    PERCENTAGE_DURATION: 1500,
    PERCENTAGE_DELAY: 500,
    EASING_POWER: 3,
    
    // Pie chart geometry
    PIE_CENTER_X: 90,
    PIE_CENTER_Y: 90,
    PIE_RADIUS: 75,
    PIE_START_ANGLE: -90,
    PIE_EPSILON: 0.0001,
    PIE_HALF_CIRCLE: 180,
    PIE_FULL_CIRCLE: 360,
    
    // Separation animation
    SEPARATION_DISTANCE: 6,
    SEPARATION_DURATION: 800,
    SEPARATION_DELAY: 0,
    
    // Default image count
    DEFAULT_IMAGE_COUNT: 7,
    
    // Precision
    POSITION_DECIMAL_PLACES: 100
  };

  // Static CSS styles for the component
  static styles = `
    .animated-chart-modal {
      position: relative;
      width: 100%;
      height: 100%;
      margin: 0 auto;
    }
    
    .chart-container {
      position: absolute;
      width: 90%;
      height: 92%;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
    
    .images-container {
      position: absolute;
      inset: 0;
      z-index: 0;
    }
    
    .animated-image {
      position: absolute;
      transition: all 0.3s cubic-bezier(0, 0.92, 0.81, 1.02);
      opacity: 0;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%) rotate(0deg) scale(0);
      z-index: 1000;
    }
    
    .animated-image.animate {
              opacity: 1;
          }
    
    .image-card {
      display: flex;
      width: var(--image-width, 154px);
      height: var(--image-height, 96px);
      background: white;
      box-sizing: border-box;
      padding: 4px;
      border-radius: 16px;
      box-shadow: 0px 12px 16px -4px rgba(10,13,18,0.08), 0px 4px 6px -2px rgba(10,13,18,0.03), 0px 2px 2px -1px rgba(10,13,18,0.04);
    }
    
    .image-content {
      flex: 1;
      background-size: cover;
      background-position: center;
      border-radius: 12px;
      width: 100%;
    }
    
    .pie-chart-container {
      position: absolute;
      background: rgba(255,255,255,0.8);
      backdrop-filter: blur(8px);
      border-radius: 32px;
      z-index: 10;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%) scale(0);
      opacity: 0;
      transition: transform 0.6s cubic-bezier(0, 0.92, 0.81, 1.02), opacity 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      width: min(37.5%, 180px);
      padding: min(4.17%, 16px);
      box-sizing: border-box;
    }
    
    .pie-chart-container.animate {
        transform: translate(-50%, -50%) scale(1);
        opacity: 1;
    }
    .pie-chart-container:after {
        content: '';
        inset: 14px;
        border-radius: 100%;
        position: absolute;
        box-shadow: 0 0 25px 3px #ffffff inset;
        z-index: 10;
        filter: blur(6px);
    }
    .chart {
        position: relative;
        width: 100%;
        height: 100%;
    }

    .path-a {
      fill: #fff;
      transition: transform 0.5s cubic-bezier(0, 0.92, 0.81, 1.02);
    }

    .path-b {
      fill: #fff;
      transition: transform 0.5s cubic-bezier(0, 0.92, 0.81, 1.02);
    }
    
    .video-overlay {
      opacity: 1;
      position: absolute;
      inset: 0;
      z-index: 1000;
      pointer-events: none;
      object-fit: cover;
      border-radius: 8px;
      width:100%;
      height: 100%;
      transform: translateZ(1px);
    }
    .chart, .video-overlay {
      transform: rotate(-25deg) translateZ(1px);
    }
    
    .video-overlay-a {
      mask: url(#maskA);
      -webkit-mask: url(#maskA);
      z-index: 10;
    }
    
    .video-overlay-b {
      mask: url(#maskB);
      -webkit-mask: url(#maskB);
      filter: grayscale(1) brightness(1.5) contrast(1.3);
    }
    
    /* Safari-only repaint fix */
            .video-overlay {
                -webkit-mask-repeat: no-repeat;
                mask-repeat: no-repeat;
                -webkit-mask-position: var(--mask-jitter-x, 0px) 0px;
                will-change: -webkit-mask-position;
            }
    .video-overlays {
      position: absolute;
      inset: 0;
      transform: scale(0.85);
      z-index: 10;
    }
    
  `;

  constructor(options = {}) {
    const {
      container,
      images = [],
      percentage = 75,
      autoPlay = true,
      onAnimationComplete = null
    } = options;
    
    if (!container) {
      throw new Error('Container element is required');
    }
    
    // Store configuration
    this.container = container;
    this.images = images;
    this.percentage = percentage;
    this.autoPlay = autoPlay;
    this.onAnimationComplete = onAnimationComplete;
    
    // Compute responsive dimensions based on container
    this._computeDimensions();
    
    // Initialize component elements
    this.modalContainer = null;
    this.chartContainer = null;
    this.imagesContainer = null;
    this.pieChartContainer = null;
    this.imagePositions = null;
    
    // Initialize the component
    this._initialize();
  }

  // Compute responsive dimensions based on container size
  _computeDimensions() {
    const containerRect = this.container.getBoundingClientRect();
    const containerWidth = containerRect.width || AnimatedChartModal.CONFIGS.DEFAULT_CONTAINER_WIDTH;
    const containerHeight = containerRect.height || AnimatedChartModal.CONFIGS.DEFAULT_CONTAINER_HEIGHT;
    
    // Store computed dimensions
    this.dimensions = {
      // Modal container dimensions (full container size)
      modalWidth: containerWidth,
      modalHeight: containerHeight,
      
      // Chart container dimensions
      chartWidth: Math.round(containerWidth * AnimatedChartModal.CONFIGS.CHART_WIDTH_PERCENT),
      chartHeight: Math.round(containerHeight * AnimatedChartModal.CONFIGS.CHART_HEIGHT_PERCENT),
      
      // Image dimensions (proportional to container size, minimum size for visibility)
      imageWidth: Math.min(
        Math.max(
          Math.round(containerWidth * AnimatedChartModal.CONFIGS.IMAGE_WIDTH_PERCENT * AnimatedChartModal.CONFIGS.IMAGE_WIDTH_SCALE), 
          AnimatedChartModal.CONFIGS.IMAGE_MIN_WIDTH
        ), 
        AnimatedChartModal.CONFIGS.IMAGE_MAX_WIDTH
      ),
      get imageHeight() { return Math.round(this.imageWidth * AnimatedChartModal.CONFIGS.IMAGE_ASPECT_RATIO); },
      
      // Computed centers
      centerX: Math.round(containerWidth * AnimatedChartModal.CONFIGS.CENTER_X_PERCENT),
      centerY: Math.round(containerHeight * AnimatedChartModal.CONFIGS.CENTER_Y_PERCENT),
      
      // Scatter radius (proportional to container size)
      scatterRadius: Math.round(Math.min(containerWidth, containerHeight) * AnimatedChartModal.CONFIGS.SCATTER_RADIUS_PERCENT),
      randomDelta: Math.round(Math.min(containerWidth, containerHeight) * AnimatedChartModal.CONFIGS.RANDOM_DELTA_PERCENT)
    };
  }

  // Initialize the component
  _initialize() {
    // Inject styles if not already present
    this._injectStyles();
    
    // Generate image positions
    this.imagePositions = this._generateRandomPositions(this.images.length || AnimatedChartModal.CONFIGS.DEFAULT_IMAGE_COUNT);
    
    // Create all components
    this.modalContainer = this._createModalContainer();
    this.chartContainer = this._createChartContainerElement();
    this.imagesContainer = this._createImagesContainer(this.images, this.imagePositions);
    this.pieChartContainer = this._createChartContainer();
    
    // Assemble the complete modal
    this._assembleModal(this.modalContainer, this.chartContainer, this.imagesContainer, this.pieChartContainer);
    
    // Set up responsive behavior
    this._setupResizeHandler();
    
    // Auto-start animation if enabled
    if (this.autoPlay) {
      setTimeout(() => this.startAnimation(), AnimatedChartModal.CONFIGS.AUTO_START_DELAY);
    }
    
    // Append to container
    this.container.appendChild(this.modalContainer);
  }

  // Generate random positions for images
  _generateRandomPositions(imageCount = AnimatedChartModal.CONFIGS.DEFAULT_IMAGE_COUNT) {
    const { chartWidth, chartHeight, imageWidth, imageHeight, centerX, centerY, scatterRadius, randomDelta } = this.dimensions;
    
    // Create shuffled delay indices for random animation order
    const delayIndices = Array.from({ length: imageCount }, (_, i) => i);
    const shuffledDelayIndices = [...delayIndices].sort(() => Math.random() - 0.5);
    
    // Calculate spread multiplier based on image width for more visible transformation
    const spreadMultiplier = AnimatedChartModal.CONFIGS.SPREAD_MULTIPLIER;
    
    // Allow wider spread - only prevent extreme overflow
    const maxX = AnimatedChartModal.CONFIGS.MAX_X_BOUND;
    const minX = AnimatedChartModal.CONFIGS.MIN_X_BOUND;
    const maxY = AnimatedChartModal.CONFIGS.MAX_Y_BOUND;
    const minY = AnimatedChartModal.CONFIGS.MIN_Y_BOUND;
    
    return Array.from({ length: imageCount }, (_, index) => {
      // Calculate equidistant angle for this image
      const baseAngle = (index / imageCount) * 2 * Math.PI;
      
      // Add random variation to angle and radius with increased spread
      const angleVariation = (Math.random() - 0.5) * AnimatedChartModal.CONFIGS.ANGLE_VARIATION;
      const radiusVariation = (Math.random() - 0.5) * randomDelta * spreadMultiplier;
      
      const angle = baseAngle + angleVariation;
      const radius = (scatterRadius + radiusVariation) * spreadMultiplier;
      
      // Calculate position based on angle and radius, accounting for -50% centering
      const rawX = Math.cos(angle) * radius;
      const rawY = Math.sin(angle) * radius;
      
      // Convert to percentages relative to center (accounting for -50% transform)
      let xPercent = (rawX / chartWidth) * 100;
      let yPercent = (rawY / chartHeight) * 100;
      
      // Ensure images stay within container bounds using calculated bounds
      // xPercent = Math.max(minX, Math.min(maxX, xPercent));
      // yPercent = Math.max(minY, Math.min(maxY, yPercent));
      
      return {
        x: Math.round(xPercent * AnimatedChartModal.CONFIGS.POSITION_DECIMAL_PLACES) / AnimatedChartModal.CONFIGS.POSITION_DECIMAL_PLACES,
        y: Math.round(yPercent * AnimatedChartModal.CONFIGS.POSITION_DECIMAL_PLACES) / AnimatedChartModal.CONFIGS.POSITION_DECIMAL_PLACES,
        rotation: (Math.random() - 0.5) * AnimatedChartModal.CONFIGS.MAX_ROTATION,
        scale: 1,
        animationDelay: shuffledDelayIndices[index] * AnimatedChartModal.CONFIGS.ANIMATION_DELAY_STEP,
        isPercentage: true // Flag to indicate percentage-based positioning
      };
    });
  }

  // SVG geometry functions for pie chart
  _createPieChartPaths(percentage) {
    const cx = AnimatedChartModal.CONFIGS.PIE_CENTER_X;
    const cy = AnimatedChartModal.CONFIGS.PIE_CENTER_Y;
    const r = AnimatedChartModal.CONFIGS.PIE_RADIUS;
    const START_ANGLE = AnimatedChartModal.CONFIGS.PIE_START_ANGLE;
    const EPS = AnimatedChartModal.CONFIGS.PIE_EPSILON;
    
    function polar(aDeg) {
      const rad = (aDeg - AnimatedChartModal.CONFIGS.PIE_START_ANGLE) * Math.PI / AnimatedChartModal.CONFIGS.PIE_HALF_CIRCLE;
      return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
    }
    
    function sectorPath(startDeg, sweepDeg) {
      if (sweepDeg <= EPS) return "";
      if (sweepDeg >= AnimatedChartModal.CONFIGS.PIE_FULL_CIRCLE - EPS) {
        const m = polar(startDeg);
        const mid = polar(startDeg + AnimatedChartModal.CONFIGS.PIE_HALF_CIRCLE);
        return `M ${cx} ${cy} L ${m.x} ${m.y}
                A ${r} ${r} 0 0 1 ${mid.x} ${mid.y}
                A ${r} ${r} 0 0 1 ${m.x} ${m.y} Z`.replace(/\s+/g, ' ');
      }
      const start = polar(startDeg);
      const end = polar(startDeg + sweepDeg);
      const large = sweepDeg > AnimatedChartModal.CONFIGS.PIE_HALF_CIRCLE ? 1 : 0;
      return `M ${cx} ${cy} L ${start.x} ${start.y}
              A ${r} ${r} 0 ${large} 1 ${end.x} ${end.y} Z`.replace(/\s+/g, ' ');
    }
    
    const pA = Math.max(0, Math.min(100, percentage));
    const sweepA = AnimatedChartModal.CONFIGS.PIE_FULL_CIRCLE * (pA / 100);
    const sweepB = AnimatedChartModal.CONFIGS.PIE_FULL_CIRCLE - sweepA;
    
    return {
      pathA: sectorPath(START_ANGLE, sweepA),
      pathB: sectorPath(START_ANGLE + sweepA, sweepB),
      percentage: pA
    };
  }

  // Animate percentage counter
  _animatePercentage(element, targetPercentage, duration = AnimatedChartModal.CONFIGS.PERCENTAGE_DURATION, delay = AnimatedChartModal.CONFIGS.PERCENTAGE_DELAY) {
    const startTime = performance.now();
    let currentPercentage = 0;
    
    // Start Safari mask repaint fix during animation
    const videoOverlayA = element.querySelector('.video-overlay-a');
    const videoOverlayB = element.querySelector('.video-overlay-b');
    const stopSafariRepaint = this._startSafariMaskRepaint(videoOverlayA, videoOverlayB);
    
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime - delay;
      
      if (elapsed < 0) {
        requestAnimationFrame(animate);
        return;
      }
      
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, AnimatedChartModal.CONFIGS.EASING_POWER);
      currentPercentage = eased * targetPercentage;
      
      // Update the chart
      const paths = this._createPieChartPaths(currentPercentage);
      
      const pathA = element.querySelector('#pathA');
      const pathB = element.querySelector('#pathB');
      
      if (pathA) {
        pathA.setAttribute('d', paths.pathA);
      }
      if (pathB) {
        pathB.setAttribute('d', paths.pathB);
      }
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Stop Safari repaint fix when animation completes
        stopSafariRepaint();
        // Start separation animation after sweep animation completes
        this._animatePathSeparation(element, targetPercentage);
      }
    };
    
    requestAnimationFrame(animate);
  }

  // Safari mask repaint fix function
  _startSafariMaskRepaint(elA, elB) {
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    if (!isSafari) return () => {};
    
    let flip = false, rafId = 0;
    const tick = () => {
      flip = !flip;
      const v = flip ? '0.001px' : '0px';  // subpixel jiggle
      elA?.style.setProperty('--mask-jitter-x', v);
      elB?.style.setProperty('--mask-jitter-x', v);
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }

  // Animate path separation after sweep animation
  _animatePathSeparation(element, percentage) {
    const pathA = element.querySelector('#pathA');
    const pathB = element.querySelector('#pathB');
    
    if (!pathA || !pathB) return;
    
    // Calculate centroid angles for each path
    const pA = Math.max(0, Math.min(100, percentage));
    const sweepA = AnimatedChartModal.CONFIGS.PIE_FULL_CIRCLE * (pA / 100);
    const sweepB = AnimatedChartModal.CONFIGS.PIE_FULL_CIRCLE - sweepA;
    
    // Calculate centroid angles (middle of each slice) - accounting for chart rotation
    const centroidAngleA = AnimatedChartModal.CONFIGS.PIE_START_ANGLE + (sweepA / 2);
    const centroidAngleB = AnimatedChartModal.CONFIGS.PIE_START_ANGLE + sweepA + (sweepB / 2);
    
    // Convert to radians for calculation (adjust for SVG coordinate system)
    const radA = ((centroidAngleA + 90) * Math.PI) / AnimatedChartModal.CONFIGS.PIE_HALF_CIRCLE;
    const radB = ((centroidAngleB + 90) * Math.PI) / AnimatedChartModal.CONFIGS.PIE_HALF_CIRCLE;
    
    // Calculate separation vectors (outward from center)
    const separationDistance = AnimatedChartModal.CONFIGS.SEPARATION_DISTANCE;
    const offsetAX = Math.cos(radA) * separationDistance;
    const offsetAY = Math.sin(radA) * separationDistance;
    const offsetBX = Math.cos(radB) * separationDistance;
    const offsetBY = Math.sin(radB) * separationDistance;
    
    // Apply transforms using CSS transitions (already defined in styles)
    setTimeout(() => {
      pathA.style.transform = `translate(${offsetAX}px, ${offsetAY}px)`;
      pathB.style.transform = `translate(${offsetBX}px, ${offsetBY}px)`;
    }, AnimatedChartModal.CONFIGS.SEPARATION_DELAY);
  }

  // Helper function to create a single animated image element
  _createAnimatedImage(position, index, imageSrc) {
    const imageElement = document.createElement('div');
    imageElement.className = 'animated-image';
    
    // Set computed center position as CSS custom properties
    const { centerX, centerY, chartWidth, chartHeight } = this.dimensions;
    const centerXPercent = ((centerX / chartWidth) * 100).toFixed(1);
    const centerYPercent = ((centerY / chartHeight) * 100).toFixed(1);
    imageElement.style.setProperty('--center-x', `${centerXPercent}%`);
    imageElement.style.setProperty('--center-y', `${centerYPercent}%`);
    
    // Store final position as data attributes for animation
    imageElement.dataset.finalX = position.x;
    imageElement.dataset.finalY = position.y;
    imageElement.dataset.finalRotation = position.rotation;
    imageElement.style.transitionDelay = `${position.animationDelay}s`;
    
    // Use provided image or generate placeholder with computed dimensions
    const { imageWidth, imageHeight } = this.dimensions;
    
    const imageCard = document.createElement('div');
    imageCard.className = 'image-card';
    
    // Set computed image dimensions as CSS custom properties
    imageCard.style.setProperty('--image-width', `${imageWidth}px`);
    imageCard.style.setProperty('--image-height', `${imageHeight}px`);
    
    const imageContent = document.createElement('div');
    imageContent.className = 'image-content';
    const svgHeight = Math.round(imageHeight * AnimatedChartModal.CONFIGS.IMAGE_SVG_HEIGHT_RATIO);
    const svgCenterX = Math.round(imageWidth / 2);
    const svgCenterY = Math.round(svgHeight / 2);
    const fontSize = Math.max(AnimatedChartModal.CONFIGS.MIN_FONT_SIZE, Math.round(imageWidth * AnimatedChartModal.CONFIGS.IMAGE_FONT_SIZE_RATIO));
    
    const finalImageSrc = imageSrc || `data:image/svg+xml,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="${imageWidth}" height="${svgHeight}" viewBox="0 0 ${imageWidth} ${svgHeight}">
        <rect width="${imageWidth}" height="${svgHeight}" fill="#f3f4f6"/>
        <text x="${svgCenterX}" y="${svgCenterY}" text-anchor="middle" dy=".3em" fill="#9ca3af" font-family="Arial, sans-serif" font-size="${fontSize}">Image ${index + 1}</text>
      </svg>
    `)}`;
    
    imageContent.style.backgroundImage = `url('${finalImageSrc}')`;
    
    imageCard.appendChild(imageContent);
    imageElement.appendChild(imageCard);
    
    return imageElement;
  }

  // Helper function to create images container with all animated images
  _createImagesContainer(images, imagePositions) {
    const imagesContainer = document.createElement('div');
    imagesContainer.className = 'images-container';
    
    imagePositions.forEach((position, index) => {
      const imageElement = this._createAnimatedImage(position, index, images[index]);
      imagesContainer.appendChild(imageElement);
    });
    
    return imagesContainer;
  }

  // Helper function to create the SVG pie chart
  _createPieChart(percentage) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'art');
    svg.setAttribute('viewBox', '0 0 180 180');
    svg.setAttribute('width', '180');
    svg.setAttribute('height', '180');
    svg.style.width = '100%';
    svg.style.height = '100%';
    svg.style.display = 'block';
    
    // Create defs section
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    
    // Create shape group with paths
    const shapeGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    shapeGroup.setAttribute('id', 'shape');
    
    // Create initial paths
    const initialPaths = this._createPieChartPaths(0);
    
    // Red slice (A)
    const pathA = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    pathA.setAttribute('id', 'pathA');
    pathA.setAttribute('class', 'path-a');
    pathA.setAttribute('d', initialPaths.pathA);
    
    // Gray slice (B)
    const pathB = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    pathB.setAttribute('id', 'pathB');
    pathB.setAttribute('class', 'path-b');
    pathB.setAttribute('d', initialPaths.pathB);
    
    // Add paths to shape group
    shapeGroup.appendChild(pathA);
    shapeGroup.appendChild(pathB);
    
    // Create mask for pathA
    const maskA = document.createElementNS('http://www.w3.org/2000/svg', 'mask');
    maskA.setAttribute('id', 'maskA');
    maskA.setAttribute('maskUnits', 'objectBoundingBox');
    maskA.setAttribute('maskContentUnits', 'objectBoundingBox');
    
    const gForMaskA = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    gForMaskA.setAttribute('transform', 'scale(0.0055555556)');
    
    const useForMaskA = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    useForMaskA.setAttribute('href', '#pathA');
    useForMaskA.setAttribute('fill', 'white');
    gForMaskA.appendChild(useForMaskA);
    maskA.appendChild(gForMaskA);
    
    // Create mask for pathB
    const maskB = document.createElementNS('http://www.w3.org/2000/svg', 'mask');
    maskB.setAttribute('id', 'maskB');
    maskB.setAttribute('maskUnits', 'objectBoundingBox');
    maskB.setAttribute('maskContentUnits', 'objectBoundingBox');
    
    const gForMaskB = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    gForMaskB.setAttribute('transform', 'scale(0.0055555556)');
    
    const useForMaskB = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    useForMaskB.setAttribute('href', '#pathB');
    useForMaskB.setAttribute('fill', 'white');
    gForMaskB.appendChild(useForMaskB);
    maskB.appendChild(gForMaskB);
    
    // Add shape and masks to defs
    defs.appendChild(shapeGroup);
    defs.appendChild(maskA);
    defs.appendChild(maskB);
    
    // Create visible chart using the shape
    const visibleUse = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    visibleUse.setAttribute('href', '#shape');
    
    // Assemble SVG
    svg.appendChild(defs);
    svg.appendChild(visibleUse);
    
    return svg;
  }

  // Helper function to create the chart container with pie chart
  _createChartContainer() {
    const pieChartContainer = document.createElement('div');
    pieChartContainer.className = 'pie-chart-container';
    
    const chartDiv = document.createElement('div');
    chartDiv.className = 'chart';
    
    // Create video overlay elements for each clip path
     const createVideoOverlay = (className) => {
         const videoOverlay = document.createElement('video');
         videoOverlay.className = `video-overlay ${className}`;
         videoOverlay.src = '/public/gradients.mp4';
         videoOverlay.autoplay = true;
         videoOverlay.muted = true;
        
        // Ping-pong loop behavior - play forward then backward
        let isPlayingForward = true;
        let reverseAnimationId = null;
        let lastTime = 0;
        
        const playReverse = (currentTime) => {
            if (!isPlayingForward && videoOverlay.currentTime > 0) {
                const deltaTime = currentTime - lastTime;
                const frameRate = 1000 / 60; // 60fps in milliseconds
                
                if (deltaTime >= frameRate) {
                    // Move backward by the same amount as one frame duration
                    videoOverlay.currentTime -= frameRate / 1000;
                    lastTime = currentTime;
                }
                
                reverseAnimationId = requestAnimationFrame(playReverse);
            } else if (!isPlayingForward && videoOverlay.currentTime <= 0) {
                // Reached beginning, switch to forward
                isPlayingForward = true;
                videoOverlay.currentTime = 0;
                videoOverlay.play();
            }
        };
        
        videoOverlay.addEventListener('ended', () => {
            if (isPlayingForward) {
                // Was playing forward, now play backward
                isPlayingForward = false;
                videoOverlay.pause();
                lastTime = performance.now();
                playReverse(performance.now());
            }
        });
        
        videoOverlay.addEventListener('timeupdate', () => {
            if (!isPlayingForward && videoOverlay.currentTime <= 0) {
                if (reverseAnimationId) {
                    cancelAnimationFrame(reverseAnimationId);
                    reverseAnimationId = null;
                }
                isPlayingForward = true;
                videoOverlay.currentTime = 0;
                videoOverlay.play();
            }
        });
        
        return videoOverlay;
    };
    

    
    const videoOverlayA = createVideoOverlay('video-overlay-a');
     const videoOverlayB = createVideoOverlay('video-overlay-b');
    
    const svg = this._createPieChart(0);
    
    // Create wrapper for video overlays
     const videoOverlaysWrapper = document.createElement('div');
     videoOverlaysWrapper.className = 'video-overlays';
     videoOverlaysWrapper.appendChild(videoOverlayA);
     videoOverlaysWrapper.appendChild(videoOverlayB);
     
     // Add video overlays wrapper and SVG to chart div
     pieChartContainer.appendChild(videoOverlaysWrapper);
    chartDiv.appendChild(svg);
    pieChartContainer.appendChild(chartDiv);
    
    return pieChartContainer;
  }

  // Helper function to create the main modal container
  _createModalContainer() {
    const modalContainer = document.createElement('div');
    modalContainer.className = 'animated-chart-modal';
    return modalContainer;
  }

  // Helper function to create the chart container
  _createChartContainerElement() {
    const chartContainer = document.createElement('div');
    chartContainer.className = 'chart-container';
    
    return chartContainer;
  }

  // Helper function to inject styles if not already present
  _injectStyles() {
    if (!document.querySelector('#animated-chart-modal-styles')) {
      const styleSheet = document.createElement('style');
      styleSheet.id = 'animated-chart-modal-styles';
      styleSheet.textContent = AnimatedChartModal.styles;
      document.head.appendChild(styleSheet);
    }
  }

  // Helper function to assemble the complete modal
  _assembleModal(modalContainer, chartContainer, imagesContainer, pieChartContainer) {
    chartContainer.appendChild(imagesContainer);
    chartContainer.appendChild(pieChartContainer);
    modalContainer.appendChild(chartContainer);

    return modalContainer;
  }

  // Public method to start animation
  startAnimation() {
    console.log('🚀 startAnimation called');
    
    // Animate images to their final positions
    const imageElements = this.imagesContainer.querySelectorAll('.animated-image');
    console.log('🖼️ Found image elements:', imageElements.length);
    
    imageElements.forEach(img => {
      const finalX = img.dataset.finalX;
      const finalY = img.dataset.finalY;
      const finalRotation = img.dataset.finalRotation;
      
      // Combine -50% centering with calculated offset percentages
      const offsetX = -50 + parseFloat(finalX);
      const offsetY = -50 + parseFloat(finalY);
      
      img.style.transform = `translate(${offsetX}%, ${offsetY}%) rotate(${finalRotation}deg) scale(1)`;
      img.classList.add('animate');
    });
    
    // Animate pie chart container with backOut easing and proper delay
    setTimeout(() => {
      console.log('📈 Adding animate class to pie chart container');
      this.pieChartContainer.classList.add('animate');
      
      console.log('🎯 About to call animatePercentage with:', { pieChartContainer: this.pieChartContainer, percentage: this.percentage });
      // Start percentage animation with built-in delay
      this._animatePercentage(this.pieChartContainer, this.percentage, AnimatedChartModal.CONFIGS.PERCENTAGE_DURATION);
    }, AnimatedChartModal.CONFIGS.PIE_CHART_DELAY);
    
    // Call completion callback
    if (this.onAnimationComplete) {
      setTimeout(this.onAnimationComplete, AnimatedChartModal.CONFIGS.COMPLETION_CALLBACK_DELAY);
    }
  }
  
  // Public method to update percentage
  updatePercentage(newPercentage) {
    this.percentage = newPercentage;
    this._animatePercentage(this.pieChartContainer, newPercentage);
  }
  
  // Set up responsive resize handling
  _setupResizeHandler() {
    // Throttle resize events for performance
    let resizeTimeout;
    this._resizeHandler = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this._handleResize();
      }, 100); // 100ms throttle
    };
    
    window.addEventListener('resize', this._resizeHandler);
  }
  
  // Handle window resize events
  _handleResize() {
    // Recalculate dimensions based on new container size
    this._computeDimensions();
    
    // Update image sizes with new dimensions
    this._updateImageSizes();
    
    // Recalculate and update image positions to maintain relative positioning
    this._updateImagePositions();
  }
  
  // Update image sizes based on new dimensions
  _updateImageSizes() {
    const imageElements = this.imagesContainer.querySelectorAll('.animated-image');
    const { imageWidth, imageHeight } = this.dimensions;
    
    imageElements.forEach(img => {
      const imageCard = img.querySelector('.image-card');
      if (imageCard) {
        imageCard.style.setProperty('--image-width', `${imageWidth}px`);
        imageCard.style.setProperty('--image-height', `${imageHeight}px`);
      }
    });
  }
  
  // Update image positions while maintaining their relative spread
  _updateImagePositions() {
    const imageElements = this.imagesContainer.querySelectorAll('.animated-image');
    
    imageElements.forEach((img, index) => {
      if (this.imagePositions[index]) {
        const position = this.imagePositions[index];
        
        // Apply bounds checking to keep images within reasonable limits
        const boundedX = Math.max(
          AnimatedChartModal.CONFIGS.MIN_X_BOUND, 
          Math.min(AnimatedChartModal.CONFIGS.MAX_X_BOUND, position.x)
        );
        const boundedY = Math.max(
          AnimatedChartModal.CONFIGS.MIN_Y_BOUND, 
          Math.min(AnimatedChartModal.CONFIGS.MAX_Y_BOUND, position.y)
        );
        
        // Update data attributes
        img.dataset.finalX = boundedX;
        img.dataset.finalY = boundedY;
        
        // If image is already animated (has animate class), update its position immediately
        if (img.classList.contains('animate')) {
          const offsetX = -50 + boundedX;
          const offsetY = -50 + boundedY;
          img.style.transform = `translate(${offsetX}%, ${offsetY}%) rotate(${position.rotation}deg) scale(1)`;
        }
      }
    });
  }
  
  // Public method to destroy the component
  destroy() {
    // Remove resize event listener
    if (this._resizeHandler) {
      window.removeEventListener('resize', this._resizeHandler);
    }
    
    if (this.modalContainer && this.container.contains(this.modalContainer)) {
      this.container.removeChild(this.modalContainer);
    }
  }
}

// Factory function to maintain backward compatibility
function createAnimatedChartModal(options = {}) {
  return new AnimatedChartModal(options);
}

// Export for ES6 modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = createAnimatedChartModal;
} else if (typeof window !== 'undefined') {
  window.createAnimatedChartModal = createAnimatedChartModal;
}

// Also export as default for ES6 modules
if (typeof exports !== 'undefined') {
  exports.default = createAnimatedChartModal;
}