// ── Cloudinary Upload Helper ──
// Uses unsigned upload preset for direct browser uploads

const CLOUD_NAME = 'duss2ml0e'
const UPLOAD_PRESET = 'quickbite_unsigned'
const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`

export interface CloudinaryUploadResult {
  secure_url: string
  public_id: string
  width: number
  height: number
  format: string
  bytes: number
}

/**
 * Upload an image file directly to Cloudinary (unsigned).
 * @param file - The File or Blob to upload
 * @param folder - Cloudinary folder (e.g. "quickbite/avatars")
 * @returns The upload result with secure_url
 */
export async function uploadToCloudinary(
  file: File,
  folder = 'quickbite',
): Promise<CloudinaryUploadResult> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', UPLOAD_PRESET)
  formData.append('folder', folder)

  const res = await fetch(UPLOAD_URL, {
    method: 'POST',
    body: formData,
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error?.message || 'Upload ảnh thất bại')
  }

  return res.json()
}

/**
 * Get optimized Cloudinary URL with transformations.
 * @param url - Original Cloudinary URL
 * @param options - Transformation options
 */
export function getOptimizedUrl(
  url: string,
  options: { width?: number; height?: number; quality?: number; crop?: string } = {},
): string {
  if (!url || !url.includes('cloudinary.com')) return url

  const { width, height, quality = 80, crop = 'fill' } = options
  const transforms: string[] = [`q_${quality}`, 'f_auto']
  if (width) transforms.push(`w_${width}`)
  if (height) transforms.push(`h_${height}`)
  if (width || height) transforms.push(`c_${crop}`)

  // Insert transforms after /upload/
  return url.replace('/upload/', `/upload/${transforms.join(',')}/`)
}
