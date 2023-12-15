const monthDictionary: { [key: string]: string } = {
  Januar: "January",
  Februar: "February",
  März: "March",
  April: "April",
  Mai: "May",
  Juni: "June",
  Juli: "July",
  August: "August",
  September: "September",
  Oktober: "October",
  November: "November",
  Dezember: "December",
};

export function replaceGermanMonths(input: string): string {
  return input.replace(
    /\b(Januar|Februar|März|April|Mai|Juni|Juli|August|September|Oktober|November|Dezember)\b/g,
    (match) => monthDictionary[match]
  );
}
