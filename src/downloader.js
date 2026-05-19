const { create } = require('youtube-dl-exec');
const path = require('path');
const youtubedl = create(path.join(__dirname, '../yt-dlp'));
const ffmpeg = require('ffmpeg-static');

/**
 * Get video information (metadata) from a YouTube URL
 * @param {string} url - The YouTube video URL
 * @returns {Promise<Object>} - Parsed JSON info of the video
 */
const getVideoInfo = async (url) => {
    try {
        const info = await youtubedl(url, {
            dumpJson: true,
            noWarnings: true
        });
        return info;
    } catch (error) {
        console.error('Error fetching video info:', error);
        throw error;
    }
};

/**
 * Download a YouTube video as MP4
 * @param {string} url - The YouTube video URL
 * @param {string} outputPath - The path where the video will be saved
 * @returns {Promise<void>}
 */
const downloadVideo = async (url, outputPath) => {
    try {
        await youtubedl(url, {
            format: 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best',
            mergeOutputFormat: 'mp4',
            output: outputPath,
            ffmpegLocation: ffmpeg,
            noWarnings: true
        });
    } catch (error) {
        console.error('Error downloading video:', error);
        throw error;
    }
};

module.exports = {
    getVideoInfo,
    downloadVideo
};
