const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { getVideoInfo, getSubtitlesText, downloadVideo, downloadSubtitle } = require('./downloader');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// New route to fetch info and subtitle text
app.post('/api/info', async (req, res) => {
    const { url } = req.body;
    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        const info = await getVideoInfo(url);
        const tempId = Date.now().toString();
        const subtitleText = await getSubtitlesText(url, tempId);

        res.json({
            title: info.title,
            thumbnail: info.thumbnail,
            subtitleText: subtitleText
        });
    } catch (error) {
        console.error('Info Error:', error);
        res.status(500).json({ error: 'Failed to fetch video info' });
    }
});

// Download Video
app.post('/api/convert/video', async (req, res) => {
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
        res.download(tempFilePath, 'youtube-video.mp4', (err) => {
            if (err) {
                console.error('Download error:', err);
            }
            fs.unlink(tempFilePath, (unlinkErr) => {
                if (unlinkErr) console.error('Error deleting temp video file:', unlinkErr);
            });
        });
    } catch (error) {
        console.error('Conversion Error:', error);
        res.status(500).json({ error: 'Failed to process video' });
    }
});

// Download Subtitle
app.post('/api/convert/subtitle', async (req, res) => {
    const { url } = req.body;
    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    const downloadsDir = path.join(__dirname, '../downloads');
    if (!fs.existsSync(downloadsDir)) {
        fs.mkdirSync(downloadsDir, { recursive: true });
    }

    const outPrefixPath = path.join(downloadsDir, `sub-${Date.now()}`);

    try {
        const actualFile = await downloadSubtitle(url, outPrefixPath);
        if (!actualFile) {
            return res.status(404).json({ error: 'No subtitle found for this video' });
        }
        res.download(actualFile, `youtube-subtitle${path.extname(actualFile)}`, (err) => {
            if (err) {
                console.error('Download error:', err);
            }
            fs.unlink(actualFile, (unlinkErr) => {
                if (unlinkErr) console.error('Error deleting temp sub file:', unlinkErr);
            });
        });
    } catch (error) {
        console.error('Subtitle Download Error:', error);
        res.status(500).json({ error: 'Failed to download subtitle' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
