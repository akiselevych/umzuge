import { serverDomain } from "services/API"

export function getNextPageURL(fullURL: string | null, page: number) {
  if (!fullURL) return ""
	
  const nextPageUrl = `${
    fullURL.replace("http", "https").split(serverDomain)[1]
  }&page=${page + 1}`

  return nextPageUrl
}
