# Roadmap: YouTube MP3 Converter

## Overview

Building a YouTube to MP3 converter web application, starting from setting up the backend video processing pipeline, creating the frontend interface, and integrating them to enable smooth audio extraction and downloading.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

- [ ] **Phase 1: Backend Setup & Audio Extraction** - Setup the server and implement YouTube video downloading and MP3 conversion.
- [ ] **Phase 2: API & Frontend Foundation** - Create the API endpoint and build the basic frontend UI.
- [ ] **Phase 3: Integration & Polish** - Connect frontend with backend, add error handling, loading states, and styling.
- [ ] **Phase 4: Subtitle Extraction (자막 추출)** - 유튜브 영상의 자막(VTT/SRT)을 추출하여 다운로드하는 기능 추가.

## Phase Details

### Phase 1: Backend Setup & Audio Extraction
**Goal**: Set up a backend service capable of downloading a YouTube video and converting its audio to an MP3 file.
**Depends on**: Nothing
**Requirements**: [Accept valid YouTube URLs as input, Extract audio from the provided YouTube video, Convert the extracted audio to MP3 format]
**Success Criteria** (what must be TRUE):
  1. Server can accept a YouTube URL and internally process it.
  2. The downloaded video's audio is extracted and saved as an MP3 file.
  3. The service handles basic errors like invalid URLs.
**Plans**: 3 plans

Plans:
- [ ] 01-01: Initialize backend project (e.g., Node.js + Express or Python + FastAPI).
- [ ] 01-02: Integrate a library like yt-dlp to fetch the video and extract audio.
- [ ] 01-03: Implement the conversion logic to save the output as an MP3 file.

### Phase 2: API & Frontend Foundation
**Goal**: Expose the backend functionality via an API and build the basic web interface.
**Depends on**: Phase 1
**Requirements**: [User interface with an input field and conversion button, Provide a download link for the MP3 file]
**Success Criteria** (what must be TRUE):
  1. The API endpoint receives the URL and returns a downloadable MP3 link.
  2. The frontend has a clean UI with an input field and a "Convert" button.
**Plans**: 2 plans

Plans:
- [ ] 02-01: Create API endpoint to trigger conversion and serve the MP3 file.
- [ ] 02-02: Create basic HTML/CSS/JS frontend to interact with the API.

### Phase 3: Integration & Polish
**Goal**: Connect the frontend and backend, adding robust error handling and UI polish.
**Depends on**: Phase 2
**Requirements**: [Error handling for invalid URLs or failed conversions]
**Success Criteria** (what must be TRUE):
  1. User can paste a link, click convert, see a loading state, and download the MP3.
  2. The interface looks professional and is mobile-responsive.
  3. Clear error messages are shown if the link is invalid or conversion fails.
**Plans**: 2 plans

Plans:
- [ ] 03-01: Implement loading states and error handling on the frontend.
- [ ] 03-02: Polish the UI/UX with CSS (responsive design, modern aesthetics).

### Phase 4: Subtitle Extraction (자막 추출)
**Goal**: 영상 다운로드 시 해당 영상에 포함된 자막 파일도 함께 또는 별도로 추출할 수 있는 기능 추가.
**Depends on**: Phase 3
**Requirements**: [유튜브 영상의 자막을 다운로드 할 수 있는 백엔드 기능, 프론트엔드에 자막 다운로드 옵션 UI 추가]
**Success Criteria** (what must be TRUE):
  1. 백엔드에서 영상의 자막을 추출하여 파일로 생성할 수 있다.
  2. 사용자가 프론트엔드에서 자막 포함 여부를 선택하거나 별도 다운로드 할 수 있다.
**Plans**: 2 plans

Plans:
- [ ] 04-01: 백엔드 자막 추출 로직 및 API 구현
- [ ] 04-02: 프론트엔드 자막 다운로드 버튼/옵션 UI 추가

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Backend Setup & Audio Extraction | 3/3 | Completed | - |
| 2. API & Frontend Foundation | 2/2 | Completed | - |
| 3. Integration & Polish | 2/2 | Completed | - |
| 4. Subtitle Extraction | 0/2 | Not started | - |
