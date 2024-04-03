import env from '../env';

export default async function henrikDevValorant(path: string) {
  try {
    const response = await fetch(`https://api.henrikdev.xyz${path}`, {
      headers: {
        Authorization: `${env.HENRIK_VALORANT_API_KEY}`,
      },
    });
    return await response.json();
  } catch {
    return null;
  }
}
