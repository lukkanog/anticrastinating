document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("websiteForm");

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const website = document.getElementById("website").value;
    const timeLimit = parseInt(document.getElementById("timeLimit").value);

    chrome.storage.local.get("websites", function (data) {
      const websites = data.websites || [];
      websites.push({ website, timeLimit });
      chrome.storage.local.set({ websites }, function () {
        alert("Website and time limit added successfully!");
      });
    });
  });
});
