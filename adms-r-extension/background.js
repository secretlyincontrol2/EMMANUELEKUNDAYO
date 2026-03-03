const API_URL = "http://localhost:8000/api/extension";

// Listen for messages from content scripts or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "SYNC_SESSION") {
        syncSessionData(request.data)
            .then(res => sendResponse({ success: true, data: res }))
            .catch(err => sendResponse({ success: false, error: err.message }));
        return true; // Keep message channel open for async response
    }

    if (request.type === "CHECK_AUTH") {
        chrome.storage.local.get(['adms_token', 'user_id'], (result) => {
            sendResponse({
                isAuthenticated: !!result.adms_token,
                userId: result.user_id
            });
        });
        return true;
    }
});

// Periodically sync data if any is pending
chrome.alarms.create("syncData", { periodInMinutes: 5 });
chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === "syncData") {
        chrome.storage.local.get(['pending_sessions'], (result) => {
            if (result.pending_sessions && result.pending_sessions.length > 0) {
                // Sync logic here
                console.log("Syncing pending sessions...", result.pending_sessions.length);
            }
        });
    }
});

async function syncSessionData(sessionData) {
    const { adms_token } = await chrome.storage.local.get('adms_token');

    if (!adms_token) {
        throw new Error("User not authenticated with ADMS-R");
    }

    try {
        const response = await fetch(`${API_URL}/log-session`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${adms_token}`
            },
            body: JSON.stringify(sessionData)
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        return await response.json();
    } catch (err) {
        console.error("Sync failed:", err);
        throw err;
    }
}
