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

function searchKeyWords() {
  // Declare variables
  var input, filter, ul, li, a, i, txtValue;
  var yearCounter = 0;
  var monthHiddenCounter = 0;
  var yearValue = 0;
  var sum = 0;
  input = document.getElementById("inputSearchParam");
  filter = input.value.toUpperCase().trim();
  ulCollection = document.getElementsByClassName("articles-list");
  var months_for_year = document.getElementsByClassName("months-for-year");
  for (var i = 0; i < ulCollection.length; i++) {
    li = ulCollection[i].getElementsByTagName("li");
    var count = 0;
    for (var j = 0; j < li.length; j++) {
      txtValue = li[j].innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        li[j].style.display = "";
      } else {
        li[j].style.display = "none";
        count += 1;
      }
    }
    if (count == li.length) {
      document.getElementById("heading-month-" + i).style.display = "none";
      monthHiddenCounter++;
    } else {
      document.getElementById("heading-month-" + i).style.display = "";
    }
    if (monthHiddenCounter == months_for_year[yearCounter].value) {
      document.getElementById("heading-year-" + yearCounter).style.display =
        "none";
    } else {
      document.getElementById("heading-year-" + yearCounter).style.display = "";
    }

    if (
      yearCounter < months_for_year.length &&
      i + 1 - sum == months_for_year[yearCounter].value
    ) {
      sum += i + 1;
      monthHiddenCounter = 0;
      yearCounter++;
    }
  }
}

function handleClear(input) {
  if (input.value == "") {
    ulCollection = document.getElementsByClassName("articles-list");
    for (var i = 0; i < ulCollection.length; i++) {
      li = ulCollection[i].getElementsByTagName("li");
      var count = 0;
      // Loop through all list items, and hide those who don't match the search query
      for (var j = 0; j < li.length; j++) {
        li[j].style.display = "";
      }
      document.getElementById("heading-month-" + i).style.display = "";
    }
    var months_for_year = document.getElementsByClassName("months-for-year");
    for (var i = 0; i < months_for_year.length; i++) {
      document.getElementById("heading-year-" + i).style.display = "";
    }
  }
}

function addCollapseForYears() {
  var collapsibleElement = document.getElementsByClassName("collapsible");
  for (var i = 0; i < collapsibleElement.length; i++) {
    let itr = i;
    collapsibleElement[i].addEventListener("click", (event) =>
      toggleShowContent(itr),
    );
  }
}
function toggleShowContent(itr) {
  var content = document.getElementById("collapsible-content-" + itr);
  var toggleElement = document.getElementById("toggle-symbol-" + itr);
  if (content.style.display === "") {
    content.style.display = "none";
    toggleElement.innerHTML = "&#9654;";
  } else {
    content.style.display = "";
    toggleElement.innerHTML = "&#9660;";
  }
}
