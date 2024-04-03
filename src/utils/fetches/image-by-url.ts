export default async function getImageByUrl(url: string | null | undefined) {
  try {
    if (!url) return null;
    const response = await fetch(url);
    return await response.arrayBuffer();
  } catch {
    return null;
  }
}
