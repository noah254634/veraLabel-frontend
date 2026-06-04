/**
 * Detects if a file is a valid audio format by inspecting its Magic Bytes.
 * Supports: MP3 (ID3 & Raw), WAV, FLAC, OGG, M4A/MP4, AAC (ADTS), AIFF, WebM, WMA.
 *
 * NOTE: WAV detection requires 12 bytes (RIFF header + WAVE marker at offset 8).
 *       M4A/MP4 requires 8 bytes to reach the 'ftyp' atom.
 */
export async function isAudioFile(file: File) {
  // Read 12 bytes — enough for WAV (RIFF + WAVE at offset 8) and all other formats
  const buffer = await file.slice(0, 12).arrayBuffer();
  const bytes = new Uint8Array(buffer);

  const hex = (arr: Uint8Array) =>
    Array.from(arr)
      .map((b: number) => b.toString(16).padStart(2, '0'))
      .join('');

  const header = hex(bytes);

  // 1. MP3 — ID3 tag header ('ID3' = 49 44 33)
  if (header.startsWith('494433')) {
    return { isAudio: true, type: 'audio/mpeg', ext: 'mp3' };
  }

  // 2. MP3 — Raw MPEG frame sync (0xFFE0 mask)
  //    Covers 0xFFFB (MPEG1 Layer3 CBR), 0xFFF3, 0xFFFA, 0xFFF2, etc.
  if (bytes[0] === 0xFF && (bytes[1] & 0xE0) === 0xE0) {
    return { isAudio: true, type: 'audio/mpeg', ext: 'mp3' };
  }

  // 3. WAV — 'RIFF' at 0 (52 49 46 46) and 'WAVE' at offset 8 (57 41 56 45)
  //    Requires 12 bytes. Previous version only read 10, causing WAV detection to
  //    silently fail because bytes[8..11] were always undefined.
  if (
    header.startsWith('52494646') &&
    hex(bytes.slice(8, 12)) === '57415645'
  ) {
    return { isAudio: true, type: 'audio/wav', ext: 'wav' };
  }

  // 4. FLAC — 'fLaC' marker (66 4c 61 43)
  if (header.startsWith('664c6143')) {
    return { isAudio: true, type: 'audio/flac', ext: 'flac' };
  }

  // 5. OGG — 'OggS' capture pattern (4f 67 67 53)
  if (header.startsWith('4f676753')) {
    return { isAudio: true, type: 'audio/ogg', ext: 'ogg' };
  }

  // 6. M4A / MP4 audio — 'ftyp' atom at offset 4 (66 74 79 70)
  //    Covers M4A, M4B, ALAC, and AAC inside an MP4 container
  if (hex(bytes.slice(4, 8)) === '66747970') {
    return { isAudio: true, type: 'audio/mp4', ext: 'm4a' };
  }

  // 7. AAC (ADTS) — sync word 0xFFF1 (MPEG-4 AAC) or 0xFFF9 (MPEG-2 AAC)
  if (bytes[0] === 0xFF && (bytes[1] === 0xF1 || bytes[1] === 0xF9)) {
    return { isAudio: true, type: 'audio/aac', ext: 'aac' };
  }

  // 8. AIFF / AIFF-C — 'FORM' at 0 (46 4f 52 4d) + 'AIFF'/'AIFC' at offset 8
  if (header.startsWith('464f524d')) {
    const subtype = hex(bytes.slice(8, 12));
    if (subtype === '41494646' || subtype === '41494643') {
      return { isAudio: true, type: 'audio/aiff', ext: 'aiff' };
    }
  }

  // 9. WebM / MKV audio — EBML magic bytes (1a 45 df a3)
  if (header.startsWith('1a45dfa3')) {
    return { isAudio: true, type: 'audio/webm', ext: 'webm' };
  }

  // 10. WMA / ASF — ASF object GUID prefix (30 26 b2 75)
  if (header.startsWith('3026b275')) {
    return { isAudio: true, type: 'audio/x-ms-wma', ext: 'wma' };
  }

  // 11. Last resort: trust the browser MIME type if it reports audio/*
  //     (handles edge cases like renamed files or uncommon containers)
  if (file.type.startsWith('audio/')) {
    return { isAudio: true, type: file.type, ext: 'unknown' };
  }

  return { isAudio: false, reason: 'Magic bytes did not match supported audio signatures.' };
}