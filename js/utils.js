function getDateDifferenceBetweenCurrentAndGivenDate(dateString) {
  let givenDate = new Date(dateString);
  let currentDate = new Date();
  let timeDifference = Math.abs(givenDate - currentDate);
  let daysDifference = timeDifference / (1000 * 60 * 60 * 24);
  return daysDifference;
}

const scrollProgress = document.getElementById("scroll-progress");
const height =
  document.documentElement.scrollHeight - document.documentElement.clientHeight;

window.addEventListener("scroll", () => {
  var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  var height =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;
  var scrolled = (winScroll / height) * 100;
  scrollProgress.style.width = `${scrolled}%`;
});
