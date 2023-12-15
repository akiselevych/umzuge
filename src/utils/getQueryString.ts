export function getQueryString<T extends Record<string, any>>(
  obj: T,
  removeEmpty: boolean = true
) {
  const queryString = Object.entries(obj)
    .filter(([_, e]) => !removeEmpty || e)
    .map((e) => `${e[0].toLocaleLowerCase()}=${e[1]}`)
    .join("&")
  return queryString
}
