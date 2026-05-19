# YouTube MP3 Converter

## What This Is

A web application that allows users to input a YouTube video link and converts the corresponding video into an MP3 audio file for download.

## Core Value

Fast, simple, and reliable conversion of YouTube videos to high-quality MP3 files with a single click.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Accept valid YouTube URLs as input
- [ ] Extract audio from the provided YouTube video
- [ ] Convert the extracted audio to MP3 format
- [ ] Provide a download link for the MP3 file
- [ ] User interface with an input field and conversion button
- [ ] Error handling for invalid URLs or failed conversions

### Out of Scope

- [ ] Video format conversion (MP4, etc.) - Only MP3 is required.
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
