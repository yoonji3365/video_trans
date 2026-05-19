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

const cleanSubtitleContent = (content) => {
    const rawLines = content.split(/\r?\n/)
        .map(line => line.trim())
        .filter(line => {
            if (!line) return false;
            if (line === 'WEBVTT') return false;
            if (line.includes('-->')) return false;
            if (line.startsWith('NOTE')) return false;
            if (/^(Kind|Language):/i.test(line)) return false;
            if (/^\d+$/.test(line)) return false;
            if (line.includes('align:start')) return false;
            return true;
        })
        .map(line => line.replace(/<[^>]*>/g, '').trim())
        .filter(Boolean);

    return rawLines
        .filter((line, index, lines) => index === 0 || line !== lines[index - 1])
        .join('\n');
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
    const outPrefix = `sub-${tempId}`;
    const dir = path.join(__dirname, '../downloads');
    await fs.mkdir(dir, { recursive: true });
    const outTemplate = path.join(dir, outPrefix);
    
    try {
        await youtubedl(url, {
            skipDownload: true,
            writeAutoSubs: true,
            writeSubs: true,
            subLangs: 'ko,en,.*',
            subFormat: 'vtt',
            output: outTemplate,
            noWarnings: true
        });
    } catch (error) {
        // yt-dlp might exit with code 1 if some languages aren't found, but it still writes the available ones.
        // We ignore the error and check if the file was created.
        console.log('yt-dlp subtitle extraction threw an error, checking for partial success...');
    }
    
    try {
        const subFile = await findFileByPrefix(dir, outPrefix);
        if (subFile) {
            const content = await fs.readFile(subFile, 'utf8');
            await fs.unlink(subFile).catch(() => {}); // cleanup
            
            const cleanText = cleanSubtitleContent(content);
            return cleanText || '자막 내용이 비어있습니다.';
        }
        return '제공되는 자막이 없습니다.';
    } catch (error) {
        console.error('Error reading subtitles:', error);
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
 * Download a YouTube subtitle file as plain text
 * @param {string} url - The YouTube video URL
 * @param {string} outPrefixPath - The path prefix where the subtitle will be saved
 * @returns {Promise<string>} - Actual text file path created
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
    } catch (error) {
        console.log('yt-dlp subtitle download threw an error, checking for partial success...');
    }
    
    try {
        const dir = path.dirname(outPrefixPath);
        const prefix = path.basename(outPrefixPath);
        const file = await findFileByPrefix(dir, prefix);
        if (file) {
            const content = await fs.readFile(file, 'utf8');
            const cleanText = cleanSubtitleContent(content);
            await fs.unlink(file).catch(() => {});

            if (!cleanText) {
                throw new Error('자막 내용이 비어있습니다.');
            }

            const textFile = `${outPrefixPath}.txt`;
            await fs.writeFile(textFile, cleanText, 'utf8');
            return textFile;
        }
        throw new Error('자막 파일을 찾을 수 없습니다.');
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
