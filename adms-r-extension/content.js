// Content script runs in the context of academic portals (e.g., babcock.edu.ng)
let sessionStart = Date.now();
let interactions = 0;
let lastInteraction = Date.now();
let isActive = true;

// Track user activity to ensure they are actually engaging
const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart'];
activityEvents.forEach(eventType => {
    document.addEventListener(eventType, () => {
        interactions++;
        lastInteraction = Date.now();
        if (!isActive) {
            isActive = true;
            sessionStart = Date.now(); // Reset session start if coming back from idle
        }
    }, { passive: true });
});

// Check for idle time
setInterval(() => {
    if (isActive && Date.now() - lastInteraction > 5 * 60 * 1000) { // 5 mins idle
        isActive = false;
        logSession();
    }
}, 60000);

// Log session when physical page unloads
window.addEventListener('beforeunload', () => {
    if (isActive) {
        logSession();
    }
});

function logSession() {
    const durationMinutes = Math.round((Date.now() - sessionStart) / 60000);

    if (durationMinutes < 1) return; // Ignore very short bounces

    const sessionData = {
        url: window.location.href,
        title: document.title,
        duration_minutes: durationMinutes,
        interaction_count: interactions,
        timestamp: new Date().toISOString()
    };

    // Send to background worker for syncing
    chrome.runtime.sendMessage({
        type: "SYNC_SESSION",
        data: sessionData
    }, (response) => {
        if (response && response.success) {
            console.log("ADMS-R: Session logged successfully");
        } else {
            console.warn("ADMS-R: Session logging failed, caching locally");
            // Fallback: cache locally in Chrome storage to sync later
            chrome.storage.local.get({ pending_sessions: [] }, (result) => {
                const pending = result.pending_sessions;
                pending.push(sessionData);
                chrome.storage.local.set({ pending_sessions: pending });
            });
        }
    });

    // Reset counters
    sessionStart = Date.now();
    interactions = 0;
}
