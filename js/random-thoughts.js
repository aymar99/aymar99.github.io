async function fetchAndSetData(aymarJsonData) {
  // Replace 'your-api-endpoint' with the actual API endpoint you want to hit
  const apiUrl =
    "https://script.google.com/macros/s/AKfycbysiLCb5ltvn-tnpHhQr98QjfrsNmIZKhmeAt8rsDwrItdnsO6KQqFo2MLxnpFz70lr/exec";

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
    random_thoughts_data = {
      date_time: currentDate.toISOString(),
      thoughts_list: data,
    };
    if (!aymarJsonData) {
      aymarJsonData = {};
    }
    if (aymarJsonData.random_thoughts_data != random_thoughts_data) {
      console.log("Refreshing content");
      aymarJsonData.random_thoughts_data = random_thoughts_data;
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
  data.forEach((item) => {
    if (item.category) {
      uniqueTypes.add(item.category, "");
    }
  });
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
  html += `<h3 class="heading-green">What I thought about in ...</h3>`;
  data.reverse().forEach((item, index) => {
    const question = item.question;
    const reason = item.reason;
    const category = item.category;
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
    html += `<li>Day ${day} <div><strong>${question}</strong></div>`;
    if (reason) {
      html += `<div style="margin-top: 0.25rem; font-style: italic;">${reason}</div>`;
    }
    if (item.category && item.category != "Misc") {
      html += `<div class="label_info">${category}</div>`;
    }
    html += `</li>`;
  });

  html += `<input type="hidden" class="months-for-year" id="input-${
    headingYearCount - 1
  }" value="${noOfMonths}"></input></div>`;
  document.getElementById("random-thoughts").innerHTML = html;

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
    aymarJsonData.random_thoughts_data &&
    aymarJsonData.random_thoughts_data.date_time &&
    aymarJsonData.random_thoughts_data.thoughts_list
  ) {
    setHtmlContent(aymarJsonData.random_thoughts_data.thoughts_list);
    fetchAndSetData(aymarJsonData);
  } else {
    fetchAndSetData(aymarJsonData);
  }
}
// Call the function to initiate the asynchronous fetch
displayData();