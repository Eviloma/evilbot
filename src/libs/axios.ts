import axios from 'axios';

export async function getImageByUrl(url: string | null | undefined) {
  if (!url) return null;
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    return Buffer.from(response.data);
  } catch {
    return null;
  }
}
