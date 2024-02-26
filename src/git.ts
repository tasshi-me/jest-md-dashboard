export const parseRemoteUrl = (
  url: string,
): { serverUrl: string; repository: string } => {
  // HTTPS or HTTP (e.g. https://github.com/USERNAME/REPOSITORY.git)
  if (url.startsWith("https://") || url.startsWith("http://")) {
    const _url = new URL(url);
    const serverUrl = _url.origin;
    const matched = _url.pathname.match(/\/([^/]+\/[^/]+).git$/);
    const repository =
      matched !== null && matched.length >= 1 ? matched[1] : undefined;
    if (repository === undefined) {
      throw new Error(`cannot parse repository from URL: ${url}`);
    }
    return { serverUrl, repository };
  }

  // SSH (e.g. git@github.com:USERNAME/REPOSITORY.git)
  const matched = url.match(/git@(.+):([^/]+\/[^/]+).git/);
  const hostname =
    matched !== null && matched.length >= 2 ? matched[1] : undefined;
  const repository =
    matched !== null && matched.length >= 2 ? matched[2] : undefined;
  if (hostname === undefined) {
    throw new Error(`cannot parse hostname from URL: ${url}`);
  }
  if (repository === undefined) {
    throw new Error(`cannot parse repository from URL: ${url}`);
  }
  return { serverUrl: `https://${hostname}`, repository };
};
