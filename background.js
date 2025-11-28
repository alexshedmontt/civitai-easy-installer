chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.action === "runSSH") {
        const ws = new WebSocket('ws://localhost:5678');

        ws.onopen = () => {
            ws.send(JSON.stringify(msg));
        };

        ws.onmessage = (event) => {
            const resp = JSON.parse(event.data);
            sendResponse(resp);
            ws.close();
        };

        ws.onerror = (err) => {
            sendResponse({ status: "ERROR", error: err.message });
        };

        // Нужно вернуть true, чтобы sendResponse был асинхронным
        return true;
    }
});
