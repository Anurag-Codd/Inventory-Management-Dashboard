export default (inputDate) => {
  const date = new Date(inputDate);
  if (Number.isNaN(date.getTime())) return "---";
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear().toString().slice(-2);
  return `${day}-${month}-${year}`;
};
