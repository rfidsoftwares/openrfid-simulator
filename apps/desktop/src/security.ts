/**
 * Basic Code Protection for OpenRFID Simulator Desktop App.
 * Disables right-click context menu and DevTools/reloading shortcuts in production.
 */

if ((import.meta as any).env.PROD) {
  // Disable right-click context menu
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
  });

  // Disable common keyboard shortcuts for inspection and reload
  document.addEventListener('keydown', (e) => {
    // Disable F12 (DevTools)
    if (e.key === 'F12') {
      e.preventDefault();
    }
    
    // Disable Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C (DevTools shortcut combinations)
    if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C' || e.key === 'i' || e.key === 'j' || e.key === 'c')) {
      e.preventDefault();
    }

    // Disable Ctrl+U / Ctrl+u (View Source)
    if (e.ctrlKey && (e.key === 'U' || e.key === 'u')) {
      e.preventDefault();
    }

    // Disable Ctrl+R / F5 (Reloading page)
    if (e.key === 'F5' || (e.ctrlKey && (e.key === 'R' || e.key === 'r'))) {
      e.preventDefault();
    }
  });
}
