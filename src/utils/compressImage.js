/**
 * Compresses an image File using Canvas API before upload.
 * Reduces large photos (3-10 MB) down to ~300-600 KB.
 *
 * @param {File} file     - Original image file
 * @param {number} maxPx  - Max width/height in pixels (default 1280)
 * @param {number} quality - JPEG quality 0-1 (default 0.78)
 * @returns {Promise<File>} Compressed file (or original if not an image / already small)
 */
export async function compressImage(file, maxPx = 1280, quality = 0.78) {
  if (!file || !file.type.startsWith('image/')) return file;
  // Skip if already small (< 300 KB)
  if (file.size < 300 * 1024) return file;

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
      canvas.width = width;
      canvas.height = height;
      canvas.getContext('2d').drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob || blob.size >= file.size) {
            resolve(file); // compressed is larger — keep original
          } else {
            resolve(new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' }));
          }
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
export async function compressAll(files, maxPx = 1280, quality = 0.78) {
  return Promise.all(files.map(f => compressImage(f, maxPx, quality)));
}
