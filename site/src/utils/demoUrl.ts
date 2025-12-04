export function toEmbedDemoUrl(repoOwner: string, repoName: string, branch: string, demoPath: string) {
  const normalized = demoPath.replace(/^\/+/, '');
  return `https://raw.githack.com/${repoOwner}/${repoName}/${branch}/site/public/${normalized}`;
}

export async function resolveEmbed(demoPath: string) {
  const url = toEmbedDemoUrl('harvey9091', 'Component_library', 'main', demoPath);
  try {
    const resp = await fetch(url, { method: 'HEAD' });
    if (resp.ok) return url;
  } catch(e) {}
  return url; // still return githack url
}