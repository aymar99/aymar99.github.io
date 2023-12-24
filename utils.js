function getDateDifferenceBetweenCurrentAndGivenDate(dateString) {
  let givenDate = new Date(dateString);
  let currentDate = new Date();
  let timeDifference = Math.abs(givenDate - currentDate);
  let daysDifference = timeDifference / (1000 * 60 * 60 * 24);
  return daysDifference;
}
