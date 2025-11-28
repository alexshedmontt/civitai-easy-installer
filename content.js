function injectCustomButton() {
    // === Civitai ===
    const civitaiBlocks = document.querySelectorAll('.flex-1.m_4081bf90.mantine-Group-root');
    if (civitaiBlocks.length) {
        const targetBlock = civitaiBlocks[1];
        if (targetBlock && !targetBlock.querySelector('.civitai-helper-btn')) {
            const btn = document.createElement('button');
            btn.className = 'civitai-helper-btn mantine-focus-auto mantine-active m_77c9d27d mantine-Button-root m_87cf2631 mantine-UnstyledButton-root';
            btn.style.paddingLeft = "8px";
            btn.style.paddingRight = "8px";
            btn.title = "Download on Server";

            const img = document.createElement('img');
            img.src = chrome.runtime.getURL("icon2.png");
            btn.appendChild(img);

            targetBlock.prepend(btn);

            btn.addEventListener("click", () => {
                const modelInfo = extractCivitaiModelInfo();
                sendToServer(modelInfo.downloadUrl, modelInfo.modelType);
            });
        }
    }

    // === HuggingFace ===
    const hfLinks = document.querySelectorAll('a[title="Download file"]');
    hfLinks.forEach(link => {
        if (link.parentNode.querySelector('.hf-helper-btn')) return;

        // Обернем родительский контейнер в relative, чтобы позиционировать кнопку
        const parent = link.parentNode;
        parent.style.position = 'relative';

        const btn = document.createElement('button');
        btn.className = 'hf-helper-btn civitai-helper-btn'; // используем тот же класс, что и для Civitai
        btn.style.position = 'absolute';
        btn.style.top = '50%';
        btn.style.transform = 'translateY(-50%)';
        btn.style.right = '2px'; // чуть правее кнопки загрузки
        btn.style.paddingLeft = "8px";
        btn.style.paddingRight = "8px";
        btn.title = "Download on Server";
        btn.style.backgroundColor = "#0b0f1a"; // тёмный фон
        btn.style.borderRadius = "7px";        // скругление углов


        const img = document.createElement('img');
        img.src = chrome.runtime.getURL("icon2.png");
        btn.appendChild(img);

        parent.appendChild(btn);

        btn.addEventListener('click', () => {
            const downloadUrl = link.href;

            // Тип модели — первый span из тегов
            let modelType = "UNKNOWN";
            const tagContainer = document.querySelector('.mb-3.flex.flex-wrap.md\\:mb-4');
            if (tagContainer) {
                const allTags = tagContainer.querySelectorAll('a > div.tag > span');
                if (allTags.length > 0) {
                    modelType = Array.from(allTags).map(span => span.textContent.trim()).join(", ");
                }
            }

            sendToServer(downloadUrl, modelType);
        });
    });

}

injectCustomButton();

const observer = new MutationObserver(() => injectCustomButton());
observer.observe(document.body, { childList: true, subtree: true });

// === Civitai helper functions ===
function extractCivitaiModelInfo() {
    const titleEl = document.querySelector('h1[data-order="1"]');
    const modelName = titleEl ? titleEl.textContent.trim() : "UNKNOWN";

    let modelType = "UNKNOWN";
    const rows = document.querySelectorAll('tr.m_4e7aa4fd');
    rows.forEach(row => {
        const thText = row.querySelector('p')?.textContent.trim();
        if (thText === "Type") {
            const badge = row.querySelector('.mantine-Badge-label');
            if (badge) modelType = badge.textContent.trim();
        }
    });

    const downloadBtn = document.querySelector('a[data-tour="model:download"]');
    let downloadUrl = "NO_DOWNLOAD_URL";
    if (downloadBtn) {
        downloadUrl = new URL(downloadBtn.getAttribute('href'), 'https://civitai.com').href;
    }

    return { modelName, modelType, downloadUrl };
}

async function sendToServer(downloadUrl, modelType) {
    let targetDir = "";

    if (modelType.toLowerCase().includes("checkpoint")) targetDir = "/workspace/ComfyUI/models/ckpt";
    else if (modelType.toLowerCase().includes("lora")) targetDir = "/workspace/ComfyUI/models/loras";
    else if (modelType.toLowerCase().includes("upscaler")) targetDir = "/workspace/ComfyUI/models/upscale_models";
    else if (modelType.toLowerCase().includes("embedding")) targetDir = "/workspace/ComfyUI/models/embeddings";
    else if (modelType.toLowerCase().includes("controlnet")) targetDir = "/workspace/ComfyUI/models/controlnet";
    else if (modelType.toLowerCase().includes("vae")) targetDir = "/workspace/ComfyUI/models/vae";
    else if (modelType.toLowerCase().includes("detection")) targetDir = "/workspace/ComfyUI/models/yolo";
    else return console.warn("Unknown model type:", modelType);

    chrome.runtime.sendMessage({
        action: "runSSH",
        targetDir,
        downloadUrl
    }, (resp) => console.log("SSH Response:", resp));
}
