const { create } = require('youtube-dl-exec');
const path = require('path');
const fs = require('fs').promises;
const youtubedl = create(path.join(__dirname, '../yt-dlp'));
const ffmpeg = require('ffmpeg-static');

// Helper to find file by prefix
const findFileByPrefix = async (dir, prefix) => {
    try {
        const files = await fs.readdir(dir);
        const matched = files.find(f => f.startsWith(prefix));
        return matched ? path.join(dir, matched) : null;
    } catch(e) {
        return null;
    }
};

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
 * Extract subtitle text quickly without downloading video
 * @param {string} url - YouTube URL
 * @param {string} tempId - Temporary ID for the file
 * @returns {Promise<string>} - Subtitle text content
 */
const getSubtitlesText = async (url, tempId) => {
    try {
        const outPrefix = `sub-${tempId}`;
        const dir = path.join(__dirname, '../downloads');
        await fs.mkdir(dir, { recursive: true });
        const outTemplate = path.join(dir, outPrefix);
        
        await youtubedl(url, {
            skipDownload: true,
            writeAutoSubs: true,
            writeSubs: true,
            subLangs: 'ko,en,.*',
            subFormat: 'vtt',
            output: outTemplate,
            noWarnings: true
        });
        
        const subFile = await findFileByPrefix(dir, outPrefix);
        if (subFile) {
            const content = await fs.readFile(subFile, 'utf8');
            await fs.unlink(subFile).catch(() => {}); // cleanup
            
            // Basic VTT text cleanup (remove timestamps for cleaner preview)
            const cleanText = content.split('\n')
                .filter(line => !line.includes('-->') && !line.startsWith('WEBVTT') && line.trim() !== '' && !line.includes('align:start'))
                .join('\n')
                .replace(/<[^>]*>/g, ''); // remove tags
                
            return cleanText || '자막 내용이 비어있습니다.';
        }
        return '제공되는 자막이 없습니다.';
    } catch (error) {
        console.error('Error fetching subtitles:', error);
        return '자막을 가져올 수 없습니다.';
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

/**
 * Download a YouTube subtitle file
 * @param {string} url - The YouTube video URL
 * @param {string} outPrefixPath - The path prefix where the subtitle will be saved
 * @returns {Promise<string>} - Actual file path created
 */
const downloadSubtitle = async (url, outPrefixPath) => {
    try {
        await youtubedl(url, {
            skipDownload: true,
            writeAutoSubs: true,
            writeSubs: true,
            subLangs: 'ko,en,.*',
            subFormat: 'vtt',
            output: outPrefixPath,
            noWarnings: true
        });
        
        const dir = path.dirname(outPrefixPath);
        const prefix = path.basename(outPrefixPath);
        return await findFileByPrefix(dir, prefix);
    } catch (error) {
        console.error('Error downloading subtitle:', error);
        throw error;
    }
};

module.exports = {
    getVideoInfo,
    getSubtitlesText,
    downloadVideo,
    downloadSubtitle
};
