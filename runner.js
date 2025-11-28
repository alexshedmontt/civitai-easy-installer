const WebSocket = require('ws');
const { Client } = require('ssh2');
const fs = require('fs');

const CONFIG_PATH = "./config.json";

// === Load or create config ===
function loadConfig() {
    if (!fs.existsSync(CONFIG_PATH)) {
        fs.writeFileSync(CONFIG_PATH, JSON.stringify({
            host: "127.0.0.1",
            port: 22,
            civitai_token: "",
            hf_token: "",
            tmux_session: "civitai"
        }, null, 4));
    }
    return JSON.parse(fs.readFileSync(CONFIG_PATH));
}

function saveConfig(newData) {
    const old = loadConfig();
    const updated = { ...old, ...newData };
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(updated, null, 4));
}

const wss = new WebSocket.Server({ port: 5678 });
console.log("Runner started. Waiting for WebSocket: ws://localhost:5678");

wss.on('connection', ws => {
    console.log("Extension connected");

    ws.on('message', async message => {
        try {
            const msg = JSON.parse(message);

            // ===== UPDATE CONFIG =====
            if (msg.action === 'updateConfig') {
                saveConfig({
                    host: msg.host,
                    port: msg.port,
                    civitai_token: msg.civitai_token,
                    hf_token: msg.hf_token
                });
                return ws.send(JSON.stringify({ status: "CONFIG_UPDATED" }));
            }

            // ===== RUN SSH COMMAND =====
            if (msg.action === 'runSSH') {
                const { targetDir, downloadUrl } = msg;
                const config = loadConfig();

                const token = downloadUrl.includes("huggingface.co")
                    ? config.hf_token
                    : config.civitai_token;

                const sshCommand = `
                tmux send-keys -t ${config.tmux_session} '
                cd ${targetDir} || exit
                url="${downloadUrl}"
                echo "Downloading from $url..."
                curl -L -J -H "Authorization: Bearer ${token}" -O "$url"
                ' Enter
                `;

                console.log("SSH to", config.host, config.port);

                const conn = new Client();
                conn.on('ready', () => {
                    conn.exec(sshCommand, (err, stream) => {
                        if (err) {
                            ws.send(JSON.stringify({ status: "ERROR", error: err.message }));
                            conn.end();
                            return;
                        }

                        stream.on('close', (code, signal) => {
                            ws.send(JSON.stringify({ status: "OK", code, signal }));
                            conn.end();
                        }).on('data', d => console.log("STDOUT:", d.toString()))
                          .stderr.on('data', d => console.log("STDERR:", d.toString()));
                    });
                }).on('error', err => {
                    ws.send(JSON.stringify({ status: "ERROR", error: err.message }));
                }).connect({
                    host: config.host,
                    port: config.port,
                    username: 'root',
                    privateKey: fs.readFileSync('C:\\Users\\alex\\.ssh\\id_ed25519'),
                    hostVerifier: () => true
                });
            }

        } catch (e) {
            ws.send(JSON.stringify({ status: "ERROR", error: e.message }));
        }
    });
});
