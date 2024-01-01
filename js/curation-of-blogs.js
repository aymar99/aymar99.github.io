async function fetchAndSetData(aymarJsonData) {
  // Replace 'your-api-endpoint' with the actual API endpoint you want to hit
  const apiUrl =
    "https://script.google.com/macros/s/AKfycbw_w66UZ17XzukBSrx_QUbFdcGPZgl-DrN4IwY1TXJVadc23HzDNYB28LJ9Vj0iyx_Q_g/exec";

  try {
    // Make a GET request using the fetch function
    const response = await fetch(apiUrl);

    // Check if the response status is OK (200)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Parse the response as JSON
    const data = await response.json();
    var oldMonYear = "";
    var html = "";
    // Print each link as a clickable tag
    var headingCount = 0;
    var curatedBlogs = [];
    data.reverse().forEach((item, index) => {
      const link = item.link;
      const name = item.name;
      const type = item.type;
      const author = item.author;
      const monYear = item.monYear;
      const day = item.day;
      if (oldMonYear != monYear) {
        if (html != "") {
          html += `</ul><h4 id="heading-month-${headingCount}" class="heading-brwn">${monYear}</h4><ul class="articles-list">`;
        } else {
          html += `<input type="search" id="inputSearchParam" onkeyup="searchKeyWords()" placeholder="Search for keywords.."/>`;
          html += `<h4 id="heading-month-${headingCount}" class="heading-brwn">${monYear}</h4><ul class="articles-list">`;
        }
        headingCount++;
        oldMonYear = monYear;
      }
      html += `<li>Day ${day} <a href=${link}>${name} - ${author}</a>`;
      if (item.type != "Misc") {
        html += `<span class="label_info">${type}</span>`;
      }
      html += `</li>`;
      singleBlog = {
        mon_year: monYear,
        link: link,
        type: type,
        day: day,
        author: author,
        name: name,
      };
      curatedBlogs.push(singleBlog);
    });

    document.getElementById("articles").innerHTML = html;

    const collection = document.getElementsByClassName("label_info");
    for (var i = 0; i < collection.length; i++) {
      const label = collection[i].innerHTML;
      if (label == "Tech") {
        collection[i].classList.add("bg-green");
      } else if (label == "Finance") {
        collection[i].classList.add("bg-lgrain");
      } else if (label == "Philosophy") {
        collection[i].classList.add("bg-dtan");
      } else {
        collection[i].classList.add("bg-lbrwn");
      }
    }

    let currentDate = new Date();
    curated_blog_data = {
      date_time: currentDate.toISOString(),
      blog_list: curatedBlogs,
    };
    if (!aymarJsonData) {
      aymarJsonData = {};
    }
    aymarJsonData.curated_blog_data = curated_blog_data;
    localStorage.setItem("aymarsitedata", JSON.stringify(aymarJsonData));
  } catch (error) {
    // Handle any errors that occurred during the fetch
    console.error("Fetch error:", error);
  }
}
async function displayData() {
  let aymarSiteData = localStorage.getItem("aymarsitedata");
  let aymarJsonData = JSON.parse(aymarSiteData);
  if (
    aymarJsonData &&
    aymarJsonData.curated_blog_data &&
    aymarJsonData.curated_blog_data.date_time
  ) {
    var html = "";
    var oldMonYear = "";
    var headingCount = 0;
    aymarJsonData.curated_blog_data.blog_list.forEach((item) => {
      const link = item.link;
      const name = item.name;
      const type = item.type;
      const author = item.author;
      const monYear = item.mon_year;
      const day = item.day;
      if (oldMonYear != monYear) {
        if (html != "") {
          html += `</ul><h4 id="heading-month-${headingCount}" class="heading-brwn">${monYear}</h4><ul class="articles-list">`;
        } else {
          html += `<input type="search" id="inputSearchParam" onsearch=handleClear(this) onkeyup="searchKeyWords()" placeholder="Search for keywords.."/>`;
          html += `<h4 id="heading-month-${headingCount}" class="heading-brwn">${monYear}</h4><ul class="articles-list">`;
        }
        headingCount++;
        oldMonYear = monYear;
      }
      html += `<li>Day ${day} <a href=${link}>${name} - ${author}</a>`;
      if (item.type != "Misc") {
        html += `<span class="label_info">${type}</span>`;
      }
    });
    document.getElementById("articles").innerHTML = html;
    const collection = document.getElementsByClassName("label_info");
    for (var i = 0; i < collection.length; i++) {
      const label = collection[i].innerHTML;
      if (label == "Tech") {
        collection[i].classList.add("bg-green");
      } else if (label == "Finance") {
        collection[i].classList.add("bg-lgrain");
      } else if (label == "Philosophy") {
        collection[i].classList.add("bg-dtan");
      } else {
        collection[i].classList.add("bg-lbrwn");
      }
    }
    fetchAndSetData(aymarJsonData);
  } else {
    fetchAndSetData(aymarJsonData);
  }
}
// Call the function to initiate the asynchronous fetch
displayData();
function searchKeyWords() {
  // Declare variables
  var input, filter, ul, li, a, i, txtValue;
  input = document.getElementById("inputSearchParam");
  filter = input.value.toUpperCase().trim();
  ulCollection = document.getElementsByClassName("articles-list");
  for (var i = 0; i < ulCollection.length; i++) {
    li = ulCollection[i].getElementsByTagName("li");
    var count = 0;
    // Loop through all list items, and hide those who don't match the search query
    for (var j = 0; j < li.length; j++) {
      txtValue = li[j].innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        li[j].style.display = "";
      } else {
        li[j].style.display = "none";
        count += 1;
      }
    }
    console.log(i + " " + count + " " + li.length);
    if (count == li.length) {
      document.getElementById("heading-month-" + i).style.display = "none";
    } else {
      document.getElementById("heading-month-" + i).style.display = "";
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
      console.log(i + " " + count + " " + li.length);
      document.getElementById("heading-month-" + i).style.display = "";
    }
  }
}
