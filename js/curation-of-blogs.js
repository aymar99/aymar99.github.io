async function fetchAndSetData(aymarJsonData) {
  // Replace 'your-api-endpoint' with the actual API endpoint you want to hit
  const apiUrl =
    "https://script.google.com/macros/s/AKfycby_b3_EE_ouKXRUetp-GQ4k3jWZ25kZm4qzFIrlJtNSh-GCCA1ysxtEyOxFMSNzuXLvjA/exec";

  try {
    // Make a GET request using the fetch function
    const response = await fetch(apiUrl);

    // Check if the response status is OK (200)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Parse the response as JSON
    const data = await response.json();
    let currentDate = new Date();
    curated_blog_data = {
      date_time: currentDate.toISOString(),
      blog_list: data,
    };
    if (!aymarJsonData) {
      aymarJsonData = {};
    }
    if (aymarJsonData.curated_blog_data != curated_blog_data) {
      console.log("Refreshing content");
      aymarJsonData.curated_blog_data = curated_blog_data;
      localStorage.setItem("aymarsitedata", JSON.stringify(aymarJsonData));
      setHtmlContent(data);
    } else {
      console.log("Not refreshing content");
    }
  } catch (error) {
    // Handle any errors that occurred during the fetch
    console.error("Fetch error:", error);
  }
}

function setHtmlContent(data) {
  let typeColorMapping = new Map();
  const colors = ["bg-green", "bg-lgrain", "bg-dtan", "bg-lbrwn"];
  var oldMon = "";
  var oldYear = "";
  var html = "";
  var headingMonthCount = 0;
  var headingYearCount = 0;
  var noOfMonths = 0;
  var oldYear = "";
  let uniqueTypes = new Set();
  index = 0;
  data.forEach((item) => uniqueTypes.add(item.type, ""));
  uniqueTypes.forEach((type) => {
    if (index == colors.length - 1) {
      index = 0;
    }
    html += `<div class="label_info">${type}</div>`;
    if (!typeColorMapping.has(type)) {
      typeColorMapping.set(type, colors[index++]);
    }
  });
  html += `<input type="search" id="inputSearchParam" onsearch=handleClear(this) onkeyup="searchKeyWords()" placeholder="Search for keywords.."/>`;
  html += `<h3 class="heading-green">What i read in ...</h3>`;
  data.reverse().forEach((item, index) => {
    const link = item.link;
    const name = item.name;
    const type = item.type;
    const author = item.author;
    const mon = item.mon;
    const day = item.day;
    const year = item.year;
    if (oldYear != year) {
      if (oldYear != "") {
        html += `</ul></div>`;
      }
      if (headingYearCount != 0) {
        html += `<input type="hidden" class="months-for-year" id="input-${
          headingYearCount - 1
        }" value="${noOfMonths}"></input>`;
        noOfMonths = 0;
      }
      if (headingYearCount == 0) {
        html += `<h4 id="heading-year-${headingYearCount}" class="heading-brwn">${year} <button class="collapsible" type="button" id="collapsible-${headingYearCount}">
          <span id="toggle-symbol-${headingYearCount}">&#9660;</span>
        </button></h4><div id="collapsible-content-${headingYearCount}">`;
      } else {
        html += `<h4 id="heading-year-${headingYearCount}" class="heading-brwn">${year} <button class="collapsible" type="button" id="collapsible-${headingYearCount}">
          <span id="toggle-symbol-${headingYearCount}">&#9654;</span>
        </button></h4><div id="collapsible-content-${headingYearCount}" style="display:none">`;
      }
      headingYearCount++;
    }
    if (oldMon != mon) {
      noOfMonths++;
      if (oldYear != year) {
        oldYear = year;
      } else if (oldMon != "") {
        html += `</ul>`;
      }
      oldMon = mon;
      html += `<h4 id="heading-month-${headingMonthCount}" class="heading-lbrwn">${mon}</h4><ul class="articles-list">`;
      headingMonthCount++;
    }
    html += `<li>Day ${day} <a href=${link} target="_blank">${name} - ${author}</a>`;
    if (item.type != "Misc") {
      html += `<div class="label_info">${type}</div>`;
    }
    html += `</li>`;
  });

  html += `<input type="hidden" class="months-for-year" id="input-${
    headingYearCount - 1
  }" value="${noOfMonths}"></input></div>`;
  document.getElementById("articles").innerHTML = html;

  const collection = document.getElementsByClassName("label_info");
  for (var i = 0; i < collection.length; i++) {
    let label = collection[i].innerHTML;
    collection[i].addEventListener("click", (event) =>
      setLabelInSearchBar(label)
    );
    collection[i].classList.add(typeColorMapping.get(label));
  }
  addCollapseForYears();
}

async function displayData() {
  let aymarSiteData = localStorage.getItem("aymarsitedata");
  let aymarJsonData = JSON.parse(aymarSiteData);
  if (
    aymarJsonData &&
    aymarJsonData.curated_blog_data &&
    aymarJsonData.curated_blog_data.date_time &&
    aymarJsonData.curated_blog_data.blog_list
  ) {
    setHtmlContent(aymarJsonData.curated_blog_data.blog_list);
    fetchAndSetData(aymarJsonData);
  } else {
    fetchAndSetData(aymarJsonData);
  }
}
// Call the function to initiate the asynchronous fetch
displayData();
