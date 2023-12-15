import moment from "moment";

export function generateDaysArray(currentDate: string) {
  const startDay = moment(currentDate)
    .startOf("month")
    .startOf("week")
    .subtract(1, "day");

  return [...Array(42)].map(() => startDay.add(1, "day").clone());
}
