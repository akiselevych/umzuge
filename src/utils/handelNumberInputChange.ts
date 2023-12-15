export const handleNumberInputChange = (e: any) => {
  if (
    e.which != 8 &&
    e.which != 0 &&
    e.which != 46 &&
    e.which != 37 &&
    e.which != 39 &&
    (e.which < 48 || (e.which > 57 && e.which !== 190))
  ) {
    e.preventDefault()
  }
}
