//check and load TODO
var collapsibleElement = document.getElementById("collapsible");
var toggleElement = document.getElementById("toggle-symbol");
var i;
collapsibleElement.addEventListener("click", function () {
  this.classList.toggle("active");
  var content = document.getElementById("collapsible-content");
  if (content.style.display === "block") {
    content.style.display = "none";
    toggleElement.innerHTML = "&#9654;";
  } else {
    content.style.display = "block";
    toggleElement.innerHTML = "&#9660;";
  }
});
document.addEventListener("DOMContentLoaded", function () {
  const rssFeedUrl = "https://proxy.cors.sh/https://aymar.substack.com/feed";
  async function fetchAndDisplay(url) {
    let aymarSiteData = localStorage.getItem("aymarsitedata");
    let aymarJsonData = JSON.parse(aymarSiteData);
    try {
      const response = await fetch(url, {
        headers: {
          "x-cors-api-key": "temp_8df4a0a411b4ca37be86186fe3cea4c7",
        },
      });
      const xml = await response.text();

      // Parse the XML content
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xml, "application/xml");

      // Extract items from the XML
      const items = xmlDoc.querySelectorAll("item");

      // Create HTML content from the RSS feed items
      let html = '<ul class="blog">';
      let prevTitle = "";
      let nextTitle = "";
      let blog_list = [];
      // TODO populate this and show for linking
      items.forEach((item) => {
        const title = item.querySelector("title").textContent;
        const sanitisedTitle = title.replace(/[^a-zA-Z0-9]/g, "");
        html += `<li><a href="full-blog.html?title=${sanitisedTitle}">${title}</a></li>`;
        blog_list.push({
          sanitised_title: sanitisedTitle,
          actual_title: title,
        });
        localStorage.setItem(`${sanitisedTitle}`, item.outerHTML);
      });
      html += "</ul>";
      // Get the current date and time
      let currentDate = new Date();

      // Create a JSON object with the key "datetime"
      my_blog_data = {
        date_time: currentDate.toISOString(), // Using toISOString to get a standardized string representation
        blog_list: blog_list,
      };

      if (!aymarJsonData) {
        aymarJsonData = {};
      }

      aymarJsonData.my_blog_data = my_blog_data;

      // Convert the JSON object to a JSON-formatted string
      let jsonString = JSON.stringify(aymarJsonData);

      localStorage.setItem("aymarsitedata", jsonString);

      // Display the HTML content in the specified div
      document.getElementById("rss-feed").innerHTML = html;
    } catch (error) {
      console.error("Error fetching RSS feed:", error);
    }
  }

  // Function to fetch and display the RSS feed
  async function displayRssFeed(url) {
    let cacheData = localStorage.getItem("aymarsitedata");
    let jsonObject = JSON.parse(cacheData);

    if (
      jsonObject &&
      jsonObject.my_blog_data &&
      jsonObject.my_blog_data.date_time
    ) {
      // Given date string
      // Check if the difference is within 1 day
      if (
        getDateDifferenceBetweenCurrentAndGivenDate(
          jsonObject.my_blog_data.date_time,
        ) <= 1
      ) {
        if (jsonObject.my_blog_data.blog_list) {
          let html = '<ul class="blog">';
          jsonObject.my_blog_data.blog_list.forEach((item) => {
            html += `<li><a href="full-blog.html?title=${item.sanitised_title}">${item.actual_title}</a></li>`;
          });
          html += "</ul>";
          document.getElementById("rss-feed").innerHTML = html;
        }
      } else {
        fetchAndDisplay(rssFeedUrl);
      }
    } else {
      fetchAndDisplay(rssFeedUrl);
    }
  }
  // Call the asynchronous function with the RSS feed URL
  displayRssFeed(rssFeedUrl);
});
