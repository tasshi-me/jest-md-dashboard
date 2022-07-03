export const parseRemoteUrl = (
  url: string
): { serverUrl: string; repository: string } => {
  // HTTPS or HTTP (e.g. https://github.com/USERNAME/REPOSITORY.git)
  if (url.startsWith("https://") || url.startsWith("http://")) {
    const _url = new URL(url);
    const serverUrl = _url.origin;
    const repository = _url.pathname.match(/\/([^/]+\/[^/]+).git$/)?.at(1);
    if (repository === undefined) {
      throw new Error(`cannot parse repository from URL: ${url}`);
    }
    return { serverUrl, repository };
  }

  // SSH (e.g. git@github.com:USERNAME/REPOSITORY.git)
  const matched = url.match(/git@(.+):([^/]+\/[^/]+).git/);
  const hostname = matched?.at(1);
  const repository = matched?.at(2);
  if (hostname === undefined) {
    throw new Error(`cannot parse hostname from URL: ${url}`);
  }
  if (repository === undefined) {
    throw new Error(`cannot parse repository from URL: ${url}`);
  }
  return { serverUrl: `https://${hostname}`, repository };
};
