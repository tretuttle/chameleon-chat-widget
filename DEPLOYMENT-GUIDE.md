# Amigo Mobility Chat Widget - Deployment Guide

This comprehensive guide covers deploying and integrating the Amigo Mobility chat widget into production environments, with specific focus on GitHub Pages hosting and various integration methods.

## Table of Contents

1. [GitHub Pages Hosting Instructions](#github-pages-hosting-instructions)
2. [Embed Code Examples](#embed-code-examples)
3. [WPBakery Integration](#wpbakery-integration)
4. [Background Transparency Confirmation](#background-transparency-confirmation)
5. [Troubleshooting](#troubleshooting)

---

## GitHub Pages Hosting Instructions

### Step 1: Build the Widget

First, build the embeddable widget files:

```bash
npm run build:widget
```

This creates the `dist-widget/` directory containing:
- `amigo-widget.umd.js` - Main widget script (UMD format)
- `amigo-widget.es.js` - ES module version
- `widget-integration-example.html` - Test page

### Step 2: Create GitHub Pages Branch

1. **Create the gh-pages branch:**
   ```bash
   git checkout --orphan gh-pages
   git rm -rf .
   ```

2. **Copy widget files to branch root:**
   ```bash
   # Switch back to main branch temporarily
   git checkout main
   
   # Copy dist-widget contents to a temporary location
   cp -r dist-widget/* /tmp/widget-files/
   
   # Switch back to gh-pages
   git checkout gh-pages
   
   # Copy files to branch root
   cp /tmp/widget-files/* .
   ```

3. **Commit and push:**
   ```bash
   git add .
   git commit -m "Deploy widget to GitHub Pages"
   git push origin gh-pages
   ```

### Step 3: Configure GitHub Pages

1. Go to your repository settings on GitHub
2. Navigate to "Pages" section
3. Select "Deploy from a branch"
4. Choose "gh-pages" branch and "/ (root)" folder
5. Save the configuration

### Step 4: Access Your Hosted Files

Your widget files will be available at:
- **Main widget script:** `https://username.github.io/repository-name/amigo-widget.umd.js`
- **ES module version:** `https://username.github.io/repository-name/amigo-widget.es.js`
- **Test page:** `https://username.github.io/repository-name/widget-integration-example.html`

### CORS Considerations

GitHub Pages automatically serves files with appropriate CORS headers for static content. The widget is designed to work cross-origin and includes:

- UMD format for maximum compatibility
- CSS injection system that works across domains
- Scoped styles to prevent conflicts
- Transparent background support for iframe embedding

---

## Embed Code Examples

### Method 1: Iframe Embedding (Recommended)

**Complete iframe snippet for embedding:**

```html
<iframe src="https://username.github.io/repository-name/widget-integration-example.html" 
        style="width:100%; min-width:350px; height:600px; border:none; background:transparent;" 
        allowtransparency="true" 
        scrolling="no" 
        frameborder="0">
</iframe>
```

**Key iframe attributes:**
- `allowtransparency="true"` - Enables transparent background
- `scrolling="no"` - Prevents iframe scrollbars (widget handles internal scrolling)
- `frameborder="0"` - Removes iframe border
- `min-width:350px` - Ensures widget remains functional on mobile

### Method 2: Direct Script Integration

**Auto-initialization (simplest):**

```html
<script src="https://username.github.io/repository-name/amigo-widget.umd.js" 
        data-amigo-widget="auto">
</script>
```

**Manual initialization (more control):**

```html
<script src="https://username.github.io/repository-name/amigo-widget.umd.js"></script>
<script>
  // Initialize when ready
  document.addEventListener('DOMContentLoaded', function() {
    AmigoWidget.init({
      containerId: 'amigo-widget-container', // Default container ID
      theme: 'light',                        // Theme option (future: 'dark')
      position: 'bottom-right'               // Widget position (future options)
    });
  });
</script>
```

### Method 3: ES Module Integration

For modern applications using ES modules:

```html
<script type="module">
  import { AmigoWidget } from 'https://username.github.io/repository-name/amigo-widget.es.js';
  
  AmigoWidget.init({
    containerId: 'custom-widget-container'
  });
</script>
```

### Configuration Options

```javascript
AmigoWidget.init({
  containerId: 'amigo-widget-container', // Custom container ID
  theme: 'light',                        // Theme selection
  position: 'bottom-right',              // Widget positioning
  autoOpen: false,                       // Prevent auto-opening on load
  debug: false                           // Enable debug logging
});
```

### API Methods

- `AmigoWidget.init(config?)` - Initialize widget with optional configuration
- `AmigoWidget.destroy()` - Remove widget completely from page
- `AmigoWidget.show()` - Show widget if hidden
- `AmigoWidget.hide()` - Hide widget temporarily

---

## WPBakery Integration

### Using Raw HTML Element

1. **Add Raw HTML Element:**
   - In WPBakery Page Builder, click "Add Element"
   - Search for and select "Raw HTML"
   - Click to add it to your page

2. **Insert Iframe Code:**
   ```html
   <iframe src="https://username.github.io/repository-name/widget-integration-example.html" 
           style="width:100%; min-width:350px; height:600px; border:none; background:transparent;" 
           allowtransparency="true" 
           scrolling="no" 
           frameborder="0">
   </iframe>
   ```

3. **Configure Raw HTML Settings:**
   - **Disable "Automatic Paragraph"** - This prevents WPBakery from wrapping your code in `<p>` tags
   - Set "Content" to your iframe code
   - Leave "CSS Animation" as "None" unless you want specific effects

### Alternative WPBakery Methods

**Method 1: Custom HTML Block**
- Use "Custom HTML" element instead of "Raw HTML"
- Paste the same iframe code
- Ensure "Filter HTML" is disabled

**Method 2: Text Block with HTML**
- Add a "Text Block" element
- Switch to "Text" tab (not Visual)
- Paste iframe code directly
- Ensure no automatic formatting is applied

**Method 3: Code Block Element**
- Some WPBakery installations have a "Code Block" element
- This provides the cleanest HTML output
- Paste iframe code without any wrapper elements

### WPBakery Responsive Settings

Configure responsive behavior in WPBakery:

- **Desktop:** Full width iframe (100%)
- **Tablet:** Maintain min-width of 350px
- **Mobile:** Consider reducing height to 500px for better mobile experience

```html
<!-- Responsive iframe for WPBakery -->
<iframe src="https://username.github.io/repository-name/widget-integration-example.html" 
        style="width:100%; min-width:350px; height:600px; border:none; background:transparent;" 
        allowtransparency="true" 
        scrolling="no" 
        frameborder="0">
</iframe>

<style>
@media (max-width: 768px) {
  iframe[src*="widget-integration-example"] {
    height: 500px !important;
  }
}
</style>
```

---

## Background Transparency Confirmation

### CSS Transparency System

The widget uses a sophisticated transparency system:

**Container Transparency:**
```css
#amigo-widget-container {
  background: transparent !important;
  position: fixed !important;
  pointer-events: none !important;
  z-index: 999999 !important;
}
```

**Child Element Pointer Events:**
```css
#amigo-widget-container > * {
  pointer-events: auto !important;
}
```

### How CSS Injection Maintains Transparency

1. **Scoped Styles:** All widget styles are prefixed with `#amigo-widget-container`
2. **Important Declarations:** Use `!important` to override host site styles
3. **CSS Reset:** Widget container resets all inherited styles with `all: initial`
4. **Transparent Background:** Explicitly set to `transparent` to prevent color inheritance

### Iframe Transparency Settings

**Key iframe attributes for transparency:**

- `allowtransparency="true"` - Enables transparent background support
- `style="background:transparent;"` - Sets iframe background to transparent
- `frameborder="0"` - Removes default iframe border that could show background

### Verification Steps

**1. Visual Inspection:**
- Widget should appear to float over your website content
- No visible background color or border around the widget
- Host site content should be visible behind the widget container

**2. Browser Developer Tools:**
- Inspect the `#amigo-widget-container` element
- Verify `background: transparent !important` is applied
- Check that no background colors are inherited from parent elements

**3. Cross-Browser Testing:**
- Test in Chrome, Firefox, Safari, and Edge
- Verify transparency works consistently across browsers
- Check mobile browsers (iOS Safari, Chrome Mobile)

**4. Integration Testing:**
```javascript
// Test transparency programmatically
const container = document.getElementById('amigo-widget-container');
const computedStyle = window.getComputedStyle(container);
console.log('Background color:', computedStyle.backgroundColor); // Should be 'transparent' or 'rgba(0, 0, 0, 0)'
```

---

## Troubleshooting

### Common Integration Issues

**Widget Not Appearing**

1. **Check Console Errors:**
   ```javascript
   // Open browser console and look for errors
   console.log('AmigoWidget available:', typeof AmigoWidget);
   ```

2. **Verify File Loading:**
   - Check Network tab in browser dev tools
   - Ensure `amigo-widget.umd.js` loads successfully (200 status)
   - Verify correct URL path to your GitHub Pages files

3. **Container Element Issues:**
   ```javascript
   // Check if container exists
   const container = document.getElementById('amigo-widget-container');
   console.log('Container found:', !!container);
   ```

**Style Conflicts**

1. **Z-Index Issues:**
   ```css
   /* Force widget above other elements */
   #amigo-widget-container {
     z-index: 999999 !important;
   }
   ```

2. **Font Inheritance Problems:**
   ```css
   /* Reset font inheritance */
   #amigo-widget-container * {
     font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
   }
   ```

3. **Color Inheritance:**
   ```css
   /* Force proper text colors */
   #amigo-widget-container .text-white {
     color: #ffffff !important;
   }
   ```

### CORS and Same-Origin Policy

**GitHub Pages CORS Support:**
- GitHub Pages automatically serves files with appropriate CORS headers
- No additional configuration needed for static files
- Widget designed to work cross-origin

**Custom Domain CORS:**
If hosting on your own domain, ensure proper CORS headers:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

### Browser Compatibility

**Supported Browsers:**
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+
- iOS Safari 12+
- Chrome Mobile 60+

**IE11 Support:**
- Requires React 17 polyfills
- Add polyfill script before widget:
```html
<script src="https://polyfill.io/v3/polyfill.min.js?features=es6,Array.prototype.includes"></script>
```

### Performance Optimization

**1. Lazy Loading:**
```javascript
// Load widget only when needed
function loadWidget() {
  const script = document.createElement('script');
  script.src = 'https://username.github.io/repo/amigo-widget.umd.js';
  script.onload = () => AmigoWidget.init();
  document.head.appendChild(script);
}

// Load on user interaction
document.addEventListener('scroll', loadWidget, { once: true });
```

**2. Preload Resources:**
```html
<link rel="preload" href="https://username.github.io/repo/amigo-widget.umd.js" as="script">
```

**3. CDN Optimization:**
- Consider using a CDN like jsDelivr for faster loading:
```html
<script src="https://cdn.jsdelivr.net/gh/username/repo@gh-pages/amigo-widget.umd.js"></script>
```

### Debug Mode

Enable debug logging for troubleshooting:

```javascript
AmigoWidget.init({
  debug: true
});

// Check widget state
console.log('Widget state:', AmigoWidget.getState());
```

### Support Resources

- **Technical Documentation:** See `WIDGET-INTEGRATION.md` for detailed API reference
- **Test Page:** Use `widget-integration-example.html` for local testing
- **GitHub Issues:** Report bugs and request features on the repository
- **Contact:** support@traycer.ai for deployment assistance

---

## Quick Deployment Checklist

- [ ] Run `npm run build:widget` to build files
- [ ] Create and configure `gh-pages` branch
- [ ] Copy `dist-widget/` contents to branch root
- [ ] Push to GitHub and enable Pages
- [ ] Test widget loading at GitHub Pages URL
- [ ] Implement chosen integration method (iframe/script)
- [ ] Verify transparency and responsive behavior
- [ ] Test across target browsers and devices
- [ ] Monitor console for errors and performance
- [ ] Document integration for your team

For additional support or custom deployment scenarios, refer to the main integration guide or contact the development team.