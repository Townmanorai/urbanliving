/**
 * Compresses an image File using Canvas API before upload.
 * Also burns a light OvikaLiving watermark in the center.
 */
export async function compressImage(file, maxPx = 1280, quality = 0.82) {
  if (!file || !file.type.startsWith('image/')) return file;

  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      let { width, height } = img;
      if (width > maxPx || height > maxPx) {
        if (width >= height) {
          height = Math.round(height * maxPx / width);
          width = maxPx;
        } else {
          width = Math.round(width * maxPx / height);
          height = maxPx;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width  = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      // Draw original image
      ctx.drawImage(img, 0, 0, width, height);

      // ── Watermark ────────────────────────────────────────────
      const fontSize   = Math.round(Math.min(width, height) * 0.085);
      const subFontSize = Math.round(fontSize * 0.42);
      const cx = width  / 2;
      const cy = height / 2;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(-18 * Math.PI / 180); // slight tilt

      // Main text — OvikaLiving
      ctx.font        = `600 ${fontSize}px 'Outfit', 'Helvetica Neue', Arial, sans-serif`;
      ctx.fillStyle   = 'rgba(255,255,255,0.16)';
      ctx.textAlign   = 'center';
      ctx.textBaseline = 'middle';
      ctx.letterSpacing = '2px';
      ctx.fillText('OvikaLiving', 0, 0);

      // Subtle underline
      const tw = ctx.measureText('OvikaLiving').width;
      ctx.strokeStyle = 'rgba(255,255,255,0.10)';
      ctx.lineWidth   = Math.max(1, fontSize * 0.04);
      ctx.beginPath();
      ctx.moveTo(-tw / 2, fontSize * 0.62);
      ctx.lineTo( tw / 2, fontSize * 0.62);
      ctx.stroke();

      // Sub-label
      ctx.font      = `400 ${subFontSize}px 'Outfit', Arial, sans-serif`;
      ctx.fillStyle = 'rgba(255,255,255,0.12)';
      ctx.fillText('Smart Urban Living', 0, fontSize * 0.9);

      ctx.restore();
      // ─────────────────────────────────────────────────────────

      canvas.toBlob(
        (blob) => {
          if (!blob) { resolve(file); return; }
          resolve(new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' }));
        },
        'image/jpeg',
        quality
      );
    };

    img.onerror = () => { URL.revokeObjectURL(url); resolve(file); };
    img.src = url;
  });
}

/**
 * Compress an array of files in parallel.
 */
export async function compressAll(files, maxPx = 1280, quality = 0.82) {
  return Promise.all(files.map(f => compressImage(f, maxPx, quality)));
}
