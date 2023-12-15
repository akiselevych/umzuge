function flattenObject(obj: any, prefix: string = ""): any {
  const flattened: any = {}

  for (const key in obj) {
    if (typeof obj[key] === "object" && obj[key] !== null) {
      const subObject = obj[key]
      const subPrefix = prefix ? `${prefix}_${key}` : key
      const subFlattened = flattenObject(subObject, subPrefix)
      Object.assign(flattened, subFlattened)
    } else {
      const finalKey = prefix ? `${prefix}_${key}` : key
      flattened[finalKey] = obj[key]
    }
  }

  return flattened
}

export function downloadCSV(data: any[], filename: string) {
  const flattenedData = data.map((order) => flattenObject(order))
  const headers = Object.keys(flattenedData[0]).join(",")
  const rows = flattenedData.map((obj) => Object.values(obj).join(","))

  const csvContent = [headers, ...rows].join("\n")

  const blob = new Blob([csvContent], { type: "text/csv" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
