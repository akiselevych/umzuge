export function getFormattedTime(time?: string) {
	if (!time) return "00:00"

	const [hours, minutes] = time.split(":")
	return `${hours}:${minutes}`
}