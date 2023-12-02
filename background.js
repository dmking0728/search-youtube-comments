function fetchAllComments(apiUrl, comments = []) {
  return fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      if (data.items) {
        data.items.forEach((comment) => {
          const topLevelCommentText =
            comment.snippet.topLevelComment.snippet.textDisplay;
          comments.push(topLevelCommentText);

          // Check if the comment has replies
          if (comment.replies && comment.replies.comments) {
            // Extract replies directly from the replies property
            const replyComments = comment.replies.comments.map(
              (reply) => reply.snippet.textDisplay
            );
            comments = comments.concat(replyComments);
          }
        });

        // Check if there are more pages of comments
        if (data.nextPageToken) {
          // Fetch the next page of comments
          const nextPageUrl = `${apiUrl}&pageToken=${data.nextPageToken}`;
          return fetchAllComments(nextPageUrl, comments);
        } else {
          // All comments have been fetched
          return comments;
        }
      } else {
        // Log the data for inspection in case of an issue
        console.log(data);
        // No comments found on this page
        return comments;
      }
    });
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "sendURLAndQuery") {
    const apiKey = "AIzaSyDjkoeL8J4NSgBfmvAySahgQz67tBslIOQ";
    const currentURL = request.url;
    const regex = /v=([a-zA-Z0-9_-]+)/;
    const match = currentURL.match(regex);
    const videoId = match[1];
    const query = request.query;
    console.log(query);

    // Define the API endpoint
    const apiUrl = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet,replies&videoId=${videoId}&key=${apiKey}`;

    // Create an array to store the comments
    const allComments = [];

    // Make the API request
    fetchAllComments(apiUrl, allComments).then((result) => {
      console.log(result);
      // Process the comments as needed
    });
  }
});
