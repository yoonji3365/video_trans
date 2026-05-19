# Plan 01 Summary (요약)

**Status:** Completed (완료)
**Objective:** 썸네일과 자막 텍스트를 미리보기로 응답하는 API 및 개별 다운로드 로직 구현

## 완료된 작업 (Tasks Completed)
- `src/downloader.js` 모듈을 전면 개편하여, 전체 영상을 다운로드하지 않고도 영상 정보(썸네일, 제목 등)와 자막 파일만 즉각적으로 파싱하여 텍스트로 반환하는 `getSubtitlesText` 함수를 구현했습니다.
- 백엔드에 자막만 따로 저장하고 보내주는 `downloadSubtitle` 전용 함수를 생성했습니다.
- `src/index.js`에 `/api/info` 라우터를 신설하여 프론트엔드가 미리보기용 데이터를 요청할 수 있게 하였고, 실제 다운로드 라우터를 `/api/convert/video`와 `/api/convert/subtitle` 두 개로 분리하여 효율성을 극대화했습니다.

## 다음 단계 (Next Steps)
프론트엔드에서 응답받은 데이터(썸네일 및 자막 텍스트)를 화면에 예쁘게 그려주는 Plan 02 작업을 진행합니다.
