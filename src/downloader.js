const youtubedl = require('youtube-dl-exec');

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

module.exports = {
    getVideoInfo
};
