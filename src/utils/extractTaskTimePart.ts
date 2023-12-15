export function extractDate(date: string) {
  return date.split("T")[0]
}

export function extractTime(date: string) {
  return date.split("T")[1].slice(0, 5)
}

export function removeSeconds(date: string) {
  return date.split(":")[0] + ":" + date.split(":")[1]
}
