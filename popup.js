document.getElementById("searchButton").addEventListener("click", function () {
  const query = document.getElementById("searchInput").value;
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const activeTab = tabs[0];
    if (tabs[0].url.match("https://.*.youtube.com/.*")) {
      chrome.tabs.sendMessage(activeTab.id, { action: "search", query: query });
    }
  });
});
