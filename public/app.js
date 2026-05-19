document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('convert-form');
    const urlInput = document.getElementById('youtube-url');
    const convertBtn = document.getElementById('convert-btn');
    const btnText = convertBtn.querySelector('.btn-text');
    const loadingSpinner = document.getElementById('loading-spinner');
    const statusMessage = document.getElementById('status-message');

    const showMessage = (message, isError = false) => {
        statusMessage.textContent = message;
        statusMessage.className = `status-message ${isError ? 'status-error' : 'status-info'}`;
        statusMessage.classList.remove('hidden');
    };

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const url = urlInput.value.trim();
        if (!url) return;

        // URL Validation
        const youtubeRegex = /^(https?\:\/\/)?(www\.youtube\.com|youtu\.be)\/.+$/;
        if (!youtubeRegex.test(url)) {
            showMessage('올바른 유튜브 링크 형식이 아닙니다. (예: https://www.youtube.com/watch?v=...)', true);
            return;
        }

        // Basic UI state update
        btnText.textContent = '다운로드 중...';
        convertBtn.disabled = true;
        loadingSpinner.classList.remove('hidden');
        showMessage('서버에서 영상을 다운로드하고 변환 중입니다. (영상 길이에 따라 수 분이 소요될 수 있습니다)', false);

        try {
            const response = await fetch('/api/convert', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ url })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || '변환에 실패했습니다.');
            }

            // Get the file blob
            const blob = await response.blob();
            
            // Create a temporary link to download the blob
            const downloadUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = downloadUrl;
            a.download = 'youtube-video.mp4';
            
            document.body.appendChild(a);
            a.click();
            
            // Cleanup
            window.URL.revokeObjectURL(downloadUrl);
            a.remove();

            showMessage('성공적으로 변환되어 MP4 다운로드가 시작되었습니다! 🎉', false);
            urlInput.value = '';
        } catch (error) {
            showMessage(`오류: ${error.message}`, true);
        } finally {
            btnText.textContent = 'MP4로 다운로드';
            convertBtn.disabled = false;
            loadingSpinner.classList.add('hidden');
        }
    });
});
