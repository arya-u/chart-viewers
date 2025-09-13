# Animated Chart Modal Component

A standalone vanilla JavaScript component that creates beautiful animated pie charts with floating images and video overlays. Perfect for data visualization with engaging animations.

## Features

- 🎯 **Animated Pie Charts** - Smooth percentage-based animations with customizable easing
- 🖼️ **Floating Images** - Scatter images around the chart with realistic physics
- 🎥 **Video Overlays** - Masked video backgrounds with ping-pong loop effects
- 📱 **Responsive Design** - Automatically adapts to container dimensions
- 🍎 **Safari Optimized** - Built-in fixes for Safari mask rendering issues
- ⚡ **Zero Dependencies** - Pure vanilla JavaScript, no frameworks required
- 🎨 **Customizable** - Extensive configuration options for styling and behavior

## Quick Start

### 1. Include the Script

```html
<script src="AnimatedChartModal.js"></script>
```

### 2. Create a Container

```html
<div id="chart-container" style="width: 800px; height: 600px;"></div>
```

### 3. Initialize the Component

```javascript
const images = [
    'https://picsum.photos/154/96?random=1',
    'https://picsum.photos/154/96?random=2',
    'https://picsum.photos/154/96?random=3',
    'https://picsum.photos/154/96?random=4',
    'https://picsum.photos/154/96?random=5'
];

const modal = new AnimatedChartModal({
    container: document.getElementById('chart-container'),
    percentage: 75,
    images: images,
    autoPlay: true,
    onAnimationComplete: () => {
        console.log('Animation completed!');
    }
});
```

## API Reference

### Constructor Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `container` | HTMLElement | **required** | The DOM element to render the chart in |
| `percentage` | number | `75` | The percentage value for the pie chart (0-100) |
| `images` | string[] | `[]` | Array of image URLs to display around the chart |
| `autoPlay` | boolean | `true` | Whether to start animation automatically |
| `onAnimationComplete` | function | `null` | Callback function called when animation completes |

### Methods

#### `startAnimation()`
Manually start the chart animation.

```javascript
modal.startAnimation();
```

#### `updatePercentage(newPercentage)`
Update the chart percentage with animation.

```javascript
modal.updatePercentage(85);
```

#### `destroy()`
Remove the component from the DOM and clean up resources.

```javascript
modal.destroy();
```

## Examples

### Basic Usage

```javascript
const modal = new AnimatedChartModal({
    container: document.getElementById('my-container'),
    percentage: 65,
    images: [
        'image1.jpg',
        'image2.jpg',
        'image3.jpg'
    ]
});
```

### Manual Control

```javascript
const modal = new AnimatedChartModal({
    container: document.getElementById('my-container'),
    percentage: 50,
    autoPlay: false,
    onAnimationComplete: () => {
        console.log('Chart animation finished!');
    }
});

// Start animation when ready
modal.startAnimation();

// Update percentage later
setTimeout(() => {
    modal.updatePercentage(80);
}, 3000);
```

### Responsive Container

```html
<div id="responsive-chart" style="width: 90vw; height: 70vh; max-width: 1000px; max-height: 700px;"></div>
```

```javascript
const modal = new AnimatedChartModal({
    container: document.getElementById('responsive-chart'),
    percentage: 90,
    images: images
});
```

## Styling

The component automatically injects CSS styles, but you can customize the appearance by overriding CSS classes:

```css
/* Customize the main container */
.animated-chart-modal {
    background: linear-gradient(45deg, #f0f0f0, #ffffff);
}

/* Style the pie chart container */
.pie-chart-container {
    background: rgba(255, 255, 255, 0.9);
    border-radius: 20px;
}

/* Customize image cards */
.image-card {
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    border-radius: 12px;
}
```

## Browser Support

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+

### Safari Notes

The component includes built-in optimizations for Safari's mask rendering. No additional configuration required.

## File Structure

```
Animated Chart Modal Component/
├── AnimatedChartModal.js    # Main component file
├── example.html            # Working example
├── public/
│   └── gradients-copy.mp4  # Video overlay asset
└── README.md              # This file
```

## Performance Features

- **Responsive Design**: Automatically adapts to window resizing with throttled event handling
- **Safari Optimizations**: Special mask repaint fixes for Safari's vector rendering issues
- **Smooth Animations**: Hardware-accelerated transforms for optimal performance
- **Memory Efficient**: Proper cleanup and event listener management

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## License

MIT License - feel free to use this component in your projects!

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.