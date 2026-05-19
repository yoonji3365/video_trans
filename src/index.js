const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { downloadVideo } = require('./downloader');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.post('/api/convert', async (req, res) => {
    const { url } = req.body;
    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    const downloadsDir = path.join(__dirname, '../downloads');
    if (!fs.existsSync(downloadsDir)) {
        fs.mkdirSync(downloadsDir, { recursive: true });
    }

    const tempFilePath = path.join(downloadsDir, `video-${Date.now()}.mp4`);

    try {
        await downloadVideo(url, tempFilePath);
        res.download(tempFilePath, 'video.mp4', (err) => {
            if (err) {
                console.error('Download error:', err);
            }
            // Cleanup file after download
            if (fs.existsSync(tempFilePath)) {
                fs.unlinkSync(tempFilePath);
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to process video' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
