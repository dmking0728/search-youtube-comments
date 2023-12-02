chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "search") {
    const currentURL = window.location.href;

    const query = request.query;

    chrome.runtime.sendMessage({
      action: "sendURLAndQuery",
      url: currentURL,
      query: query,
    });
  }
});
