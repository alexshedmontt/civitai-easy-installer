const hostInput = document.getElementById("host");
const portInput = document.getElementById("port");
const civitaiInput = document.getElementById("civitai_token");
const huggingfaceInput = document.getElementById("hf_token");
const saveBtn = document.getElementById("saveBtn");

// Load saved values
chrome.storage.sync.get(["host", "port", "civitai_token", "hf_token"], (data) => {
    hostInput.value = data.host ?? "";
    portInput.value = data.port ?? "";
    civitaiInput.value = data.civitai_token ?? "";
    huggingfaceInput.value = data.hf_token ?? "";
});

// WebSocket connection to runner.js
let ws = new WebSocket("ws://localhost:5678");

ws.onopen = () => console.log("Connected to runner");
ws.onerror = () => console.log("WS error");

// Save Host + Port
saveBtn.addEventListener("click", () => {
    const host = hostInput.value.trim();
    const port = Number(portInput.value.trim());
    const civitai_token = civitaiInput.value.trim();
    const hf_token = huggingfaceInput.value.trim();

    chrome.storage.sync.set({ host, port, civitai_token, hf_token });

    if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
            action: "updateConfig",
            host,
            port,
            civitai_token,
            hf_token
        }));
    }

    saveBtn.textContent = "Saved!";
    setTimeout(() => saveBtn.textContent = "Save", 800);
});
