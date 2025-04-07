// Create a new file utils/fingerprint.js

// A simple function to create a fingerprint based on browser information
export const generateFingerprint = () => {
    const userAgent = navigator.userAgent;
    const screenPrint = `${window.screen.width}x${window.screen.height}x${window.screen.colorDepth}`;
    const timeZone = new Date().getTimezoneOffset();
    const lang = navigator.language;
    
    // Create a simple hash
    const fingerprint = btoa(`${userAgent}-${screenPrint}-${timeZone}-${lang}`);
    
    // Store in localStorage for consistency
    localStorage.setItem('device_fingerprint', fingerprint);
    
    return fingerprint;
  };
  
  // Get fingerprint or create if it doesn't exist
  export const getFingerprint = () => {
    let fingerprint = localStorage.getItem('device_fingerprint');
    
    if (!fingerprint) {
      fingerprint = generateFingerprint();
    }
    
    return fingerprint;
  };