const express = require('express');
const app = express();
const PORT = 3000;

// API Endpoint to serve Server-Sent Events
app.get('/time', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Send time updates every second
    const interval = setInterval(() => {
        const currentISTTime = new Date().toLocaleString('en-US', {
            timeZone: 'Asia/Kolkata',
            hour12: false
        });
        res.write(`data: ${currentISTTime}\n\n`);
    }, 1000);

    // Close the connection when the client disconnects
    req.on('close', () => {
        clearInterval(interval);
        res.end();
    });
});

// Serve a simple HTML page for demonstration
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>IST Time</title>
        </head>
        <body>
            <h1>Current IST Time</h1>
            <div id="time"></div>
            <script>
                const eventSource = new EventSource('/time');
                eventSource.onmessage = (event) => {
                    document.getElementById('time').innerText = event.data;
                };
            </script>
        </body>
        </html>
    `);
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
