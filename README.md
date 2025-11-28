<h1 align="center">🚀 Civitai Easy Installer</h1>
<p align="center">
  <strong>One-click model downloader from Civitai directly to your server via SSH + tmux + WebSocket</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Status-Active-brightgreen?style=for-the-badge">
  <img src="https://img.shields.io/badge/Platform-Chrome%20Extension-blue?style=for-the-badge">
  <img src="https://img.shields.io/badge/Server-SSH%20%2F%20tmux-orange?style=for-the-badge">
</p>

<hr>

<h2>📌 Description</h2>
<p>
Civitai Easy Installer is a <strong>Chrome extension + Node.js runner</strong> that allows you to download models directly to your GPU server with <strong>one click</strong>. The extension injects a <em>Download on Server</em> button next to every model download on Civitai. It automatically detects the type of model and places it in the correct ComfyUI folder.
</p>

<ul>
  <li>Automatically detects model type (Checkpoint, LoRA, VAE, Upscaler, ControlNet, Embedding, YOLO)</li>
  <li>Downloads directly to server via SSH</li>
  <li>Uses tmux session <code>civitai</code> to run commands remotely</li>
  <li>Requires WebSocket runner (<code>Runner.bat</code>) to be running locally</li>
  <li>Supports Civitai token (HF token optional and not recommended)</li>
</ul>

<hr>

<h2>🚀 Features</h2>
<table>
  <tr>
    <th>Feature</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>One-click server download</td>
    <td>Adds a "Download on Server" button for each model.</td>
  </tr>
  <tr>
    <td>Automatic model type detection</td>
    <td>Detects model type and saves it in the correct ComfyUI folder.</td>
  </tr>
  <tr>
    <td>SSH + tmux integration</td>
    <td>Sends commands via SSH into a tmux session named <code>civitai</code>.</td>
  </tr>
  <tr>
    <td>WebSocket backend</td>
    <td>Runner.js listens for commands from the extension and executes downloads.</td>
  </tr>
  <tr>
    <td>Config via popup</td>
    <td>Set Civitai token, HF token, host, and port directly in the extension popup.</td>
  </tr>
</table>

<hr>

<h2>📁 Supported Model Types & Folders</h2>
<table>
  <tr>
    <th>Model Type</th>
    <th>Target Folder</th>
  </tr>
  <tr><td>Checkpoint</td><td>/workspace/ComfyUI/models/ckpt</td></tr>
  <tr><td>LoRA</td><td>/workspace/ComfyUI/models/loras</td></tr>
  <tr><td>Upscaler</td><td>/workspace/ComfyUI/models/upscale_models</td></tr>
  <tr><td>Embedding</td><td>/workspace/ComfyUI/models/embeddings</td></tr>
  <tr><td>ControlNet</td><td>/workspace/ComfyUI/models/controlnet</td></tr>
  <tr><td>VAE</td><td>/workspace/ComfyUI/models/vae</td></tr>
  <tr><td>Detection / YOLO</td><td>/workspace/ComfyUI/models/yolo</td></tr>
</table>

<hr>

<h2>💻 How It Works</h2>
<ol>
  <li>Install the Chrome extension.</li>
  <li>Run <code>Runner.bat</code> to start WebSocket server.</li>
  <li>Open your GPU server and start a tmux session: <code>tmux new -s civitai</code></li>
  <li>Enter your Civitai token, HF token (optional), server host, and port in the popup.</li>
  <li>Click "Download on Server" on any Civitai model page.</li>
</ol>

<!--
<p align="center">
<img src="https://radikal.cloud/i/image.q0CijL" alt="Extension Screenshot" width="400">
</p>

<hr> -->

<!-- <h2>🛠 Repository Structure</h2>
<pre>
civitai-easy-installer/
 ├─ extension/
 │   ├─ popup.html
 │   ├─ popup.css
 │   ├─ popup.js
 │   ├─ content.js
 │   ├─ manifest.json
 │   └─ icon2.png
 ├─ server/
 │   ├─ runner.js
 │   ├─ Runner.bat
 │   └─ package.json
 └─ README.md
</pre> -->

<hr>

<h2>⚙️ Server Requirements</h2>
<ul>
  <li>Linux server (Ubuntu/Debian recommended)</li>
  <li>tmux installed</li>
  <li>Node.js v18+</li>
  <li>SSH access with private key</li>
  <li>tmux session named <code>civitai</code></li>
</ul>

<hr>

<h2>📜 License</h2>
<p>MIT License</p>

<hr>

<h2>🤝 Contributions</h2>
<p>Pull requests are welcome. For major changes, open an issue first to discuss what you would like to improve.</p>
