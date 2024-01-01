function getDateDifferenceBetweenCurrentAndGivenDate(dateString) {
  let givenDate = new Date(dateString);
  let currentDate = new Date();
  let timeDifference = Math.abs(givenDate - currentDate);
  let daysDifference = timeDifference / (1000 * 60 * 60 * 24);
  return daysDifference;
}

const scrollProgress = document.getElementById("scroll-progress");

window.addEventListener("scroll", () => {
  var scrollY = window.scrollY || window.pageYOffset;

  if (scrollProgress) {
    if (scrollY >= 6.4) {
      scrollProgress.style.display = "block";
    } else {
      scrollProgress.style.display = "none";
    }
    scrollProgress.style.width = `${_get_scroll_percentage()}%`;
  }
});

/**
 * Get current browser viewpane heigtht
 */
function _get_window_height() {
  return (
    window.innerHeight ||
    document.documentElement.clientHeight ||
    document.body.clientHeight ||
    0
  );
}

/**
 * Get current absolute window scroll position
 */
function _get_window_Yscroll() {
  return (
    window.pageYOffset ||
    document.body.scrollTop ||
    document.documentElement.scrollTop ||
    0
  );
}

/**
 * Get current absolute document height
 */
function _get_doc_height() {
  return Math.max(
    document.body.scrollHeight || 0,
    document.documentElement.scrollHeight || 0,
    document.body.offsetHeight || 0,
    document.documentElement.offsetHeight || 0,
    document.body.clientHeight || 0,
    document.documentElement.clientHeight || 0,
  );
}

/**
 * Get current vertical scroll percentage
 */
function _get_scroll_percentage() {
  return (
    ((_get_window_Yscroll() + _get_window_height()) / _get_doc_height()) * 100
  );
}
