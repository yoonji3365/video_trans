# YouTube MP3 Converter

## What This Is

A web application that allows users to input a YouTube video link and downloads the corresponding video (MP4) and its subtitles.

## Core Value

Fast, simple, and reliable downloading of YouTube videos (MP4) and subtitles with a single click.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Accept valid YouTube URLs as input
- [ ] Download video in MP4 format
- [ ] Extract and download subtitles (if requested)
- [ ] Provide a download link for the extracted files
- [ ] User interface with an input field and conversion button
- [ ] Error handling for invalid URLs or failed downloads

### Out of Scope

- [ ] Audio-only extraction (MP3) - The objective changed to video and subtitle downloads.
- [ ] Batch downloading - Focus on single links first to ensure stability.

## Context

- Building a simple utility site.
- Needs to handle YouTube API or yt-dlp to fetch the video and extract the audio.
- Frontend should be clean, mobile-responsive, and intuitive.

## Constraints

- **Tech Stack**: Frontend (HTML/CSS/JS or framework), Backend (Node.js/Python for handling the download/conversion) — Need a backend to process the video since CORS and processing power would restrict doing this purely on the client side.
- **Compatibility**: Must work on modern browsers (mobile and desktop).

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Use a backend server for conversion | Pure frontend conversion is limited by CORS and processing power | — Pending |

---
*Last updated: 2026-05-19 after initialization*

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state
