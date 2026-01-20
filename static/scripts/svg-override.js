document.addEventListener('DOMContentLoaded', () => {
    const svgObject = document.querySelector('.svgClass');
    if (!svgObject) return;
    

    const updateSVGColors = () => {
        const doc = svgObject.contentDocument;

        if (!doc) return;
        
        const svgElement = doc.querySelector('svg');
        const svgElementPath = svgElement.querySelector('path');

        const styles = getComputedStyle(document.documentElement);

        const color = styles.getPropertyValue('--logo-color').trim();
        const fill = styles.getPropertyValue('--logo-fill').trim()

        svgElementPath.style.color  = `${color || '#E60062'}`
        svgElementPath.style.fill  = `${fill || '#E60062'}`
    };

    svgObject.addEventListener('load', updateSVGColors);
    
    svgObject.classList.add('loaded');

    // Optional: Watch for theme changes
    const observer = new MutationObserver(updateSVGColors);
    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class', 'data-theme']
    });
});