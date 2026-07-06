// Vercel Speed Insights for static sites
// This script dynamically injects the Speed Insights tracking script
(function() {
  // Initialize queue for events before the main script loads
  if (!window.si) {
    window.si = function() {
      (window.siq = window.siq || []).push(arguments);
    };
  }

  // Check if script is already loaded
  if (document.head.querySelector('script[src*="speed-insights"]')) {
    return;
  }

  // Create and inject the Speed Insights script
  var script = document.createElement('script');
  script.src = '/_vercel/speed-insights/script.js';
  script.defer = true;
  
  // Add SDK metadata
  script.setAttribute('data-sdkn', '@vercel/speed-insights');
  script.setAttribute('data-sdkv', '2.0.0');
  
  // Error handling (fails gracefully in development)
  script.onerror = function() {
    console.log('[Vercel Speed Insights] Script will be available when deployed to Vercel.');
  };
  
  document.head.appendChild(script);
})();
