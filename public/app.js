document.addEventListener('DOMContentLoaded', () => {
    // Search Form
    const searchForm = document.getElementById('search-form');
    const urlInput = document.getElementById('youtube-url');
    const searchBtn = document.getElementById('search-btn');
    const searchBtnText = document.getElementById('search-btn-text');
    const searchSpinner = document.getElementById('search-spinner');
    
    // Cards
    const searchCard = document.getElementById('search-card');
    const previewContainer = document.getElementById('preview-container');
    const backBtn = document.getElementById('back-btn');
    
    // Preview Elements
    const videoTitle = document.getElementById('video-title');
    const videoThumbnail = document.getElementById('video-thumbnail');
    const subtitleBox = document.getElementById('subtitle-box');
    const statusMessage = document.getElementById('status-message');
    
    // Download Buttons
    const downloadVideoBtn = document.getElementById('download-video-btn');
    const downloadSubtitleBtn = document.getElementById('download-subtitle-btn');
    const videoSpinner = document.getElementById('video-spinner');
    const subtitleSpinner = document.getElementById('subtitle-spinner');

    let currentUrl = '';

    const showMessage = (message, isError = false) => {
        statusMessage.textContent = message;
        statusMessage.className = `status-message ${isError ? 'status-error' : 'status-info'}`;
        statusMessage.classList.remove('hidden');
    };

    // 1. Search Phase
    searchForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const url = urlInput.value.trim();
        if (!url) return;

        // URL Validation
        const youtubeRegex = /^(https?\:\/\/)?(www\.youtube\.com|youtu\.be)\/.+$/;
        if (!youtubeRegex.test(url)) {
            showMessage('올바른 유튜브 링크 형식이 아닙니다. (예: https://www.youtube.com/watch?v=...)', true);
            return;
        }

        currentUrl = url;
        searchBtnText.textContent = '정보 불러오는 중...';
        searchBtn.disabled = true;
        downloadSubtitleBtn.disabled = false;
        searchSpinner.classList.remove('hidden');
        showMessage('영상 정보와 자막을 확인하는 중입니다.');

        try {
            const response = await fetch('/api/info', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || '정보를 불러오는데 실패했습니다.');
            }

            const data = await response.json();
            
            // Update Preview DOM
            videoTitle.textContent = data.title || '제목 없음';
            videoTitle.title = data.title;
            videoThumbnail.src = data.thumbnail || '';
            subtitleBox.textContent = data.subtitleText || '자막 내용이 비어있습니다.';
            downloadSubtitleBtn.disabled = !data.hasSubtitle;
            
            // Switch UI
            searchCard.classList.add('hidden');
            previewContainer.classList.remove('hidden');
            showMessage(data.hasSubtitle ? '미리보기를 불러왔습니다.' : '미리보기는 불러왔지만 제공되는 자막이 없습니다.', !data.hasSubtitle);

        } catch (error) {
            showMessage(`오류: ${error.message}`, true);
        } finally {
            searchBtnText.textContent = '정보 불러오기';
            searchBtn.disabled = false;
            searchSpinner.classList.add('hidden');
        }
    });

    // 2. Download Generic Function
    const handleDownload = async (type, btn, spinner) => {
        const btnTextElem = btn.querySelector('.btn-text');
        const originalText = btnTextElem.textContent;
        
        btnTextElem.textContent = '다운로드 준비 중...';
        btn.disabled = true;
        spinner.classList.remove('hidden');
        showMessage(type === 'video' ? '영상 다운로드를 준비하는 중입니다.' : '자막 TXT 파일을 준비하는 중입니다.');

        try {
            const response = await fetch(`/api/convert/${type}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: currentUrl })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || '다운로드에 실패했습니다.');
            }

            const blob = await response.blob();
            
            // Get filename from Content-Disposition if possible
            let filename = type === 'video' ? 'youtube-video.mp4' : 'youtube-subtitle.txt';
            const disposition = response.headers.get('Content-Disposition');
            if (disposition && disposition.indexOf('attachment') !== -1) {
                const matches = /filename="([^"]*)"/.exec(disposition);
                if (matches != null && matches[1]) filename = matches[1];
            }

            const downloadUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = downloadUrl;
            a.download = filename;
            
            document.body.appendChild(a);
            a.click();
            
            window.URL.revokeObjectURL(downloadUrl);
            a.remove();
            
            btnTextElem.textContent = '다운로드 완료!';
            showMessage(type === 'video' ? '영상 다운로드가 시작됐습니다.' : '자막 TXT 다운로드가 시작됐습니다.');
            setTimeout(() => { btnTextElem.textContent = originalText; }, 3000);
            
        } catch (error) {
            showMessage(`다운로드 오류: ${error.message}`, true);
            btnTextElem.textContent = originalText;
        } finally {
            btn.disabled = false;
            spinner.classList.add('hidden');
        }
    };

    // Video Download Event
    downloadVideoBtn.addEventListener('click', () => {
        handleDownload('video', downloadVideoBtn, videoSpinner);
    });

    // Subtitle Download Event
    downloadSubtitleBtn.addEventListener('click', () => {
        handleDownload('subtitle', downloadSubtitleBtn, subtitleSpinner);
    });

    // Back Event
    backBtn.addEventListener('click', () => {
        urlInput.value = '';
        currentUrl = '';
        statusMessage.classList.add('hidden');
        downloadSubtitleBtn.disabled = false;
        previewContainer.classList.add('hidden');
        searchCard.classList.remove('hidden');
    });
});
