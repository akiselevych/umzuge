export function removeEmptyValues<T extends object>(obj: T) {
  const entries = Object.entries(obj)
  const filteredEntries = entries.filter(
    ([_, value]) => value !== null && value !== undefined && value !== ""
  )
  const result = Object.fromEntries(filteredEntries)
  return result
}
