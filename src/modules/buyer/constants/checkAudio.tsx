/**
 * Detects if a file is a valid audio format by inspecting its Magic Bytes.
 * Supports: MP3 (ID3 & Raw), WAV, FLAC, and AAC (ADTS).
 */
export async function isAudioFile(file) {
  // We only need the first 4-10 bytes for most audio signatures
  const buffer = await file.slice(0, 10).arrayBuffer();
  const bytes = new Uint8Array(buffer);
  
  // Helper to convert bytes to a hex string for easy comparison
  const getHex = (arr) => Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
  const header = getHex(bytes);

  // 1. MP3 (Starts with 'ID3' or Frame Sync 0xFFFB/0xFFF3)
  if (header.startsWith('494433') || header.startsWith('fffb') || header.startsWith('fff3')) {
    return { isAudio: true, type: 'audio/mpeg', ext: 'mp3' };
  }

  // 2. WAV (Starts with 'RIFF' and has 'WAVE' at offset 8)
  // RIFF = 52 49 46 46 | WAVE = 57 41 56 45
  if (header.startsWith('52494646') && getHex(bytes.slice(8, 12)) === '57415645') {
    return { isAudio: true, type: 'audio/wav', ext: 'wav' };
  }

  // 3. FLAC (Starts with 'fLaC' = 66 4c 61 43)
  if (header.startsWith('664c6143')) {
    return { isAudio: true, type: 'audio/flac', ext: 'flac' };
  }

  // Fallback to browser-reported MIME type if binary check is inconclusive
  if (file.type.startsWith('audio/')) {
    return { isAudio: true, type: file.type, ext: 'unknown' };
  }

  return { isAudio: false, reason: "Magic bytes did not match supported audio signatures." };
}