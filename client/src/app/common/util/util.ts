// General purpose for helper methods

export const combineDateAndTime = (date: Date, time: Date) => {
  const timeString = time.getHours() + ':' + time.getMinutes() + ':00';

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  // Get Date will give us the date, getDay will get us the day whereas we don't want that.
  const dateString = `${year}-${month}-${day}`;
  return new Date(dateString + ' ' + timeString);
}