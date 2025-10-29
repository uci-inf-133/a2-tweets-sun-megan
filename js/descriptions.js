let writtenTweets = [];

function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	//TODO: Filter to just the written tweets
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	writtenTweets = tweet_array.filter(tweet => tweet.source == "completed_event" && tweet.written);
}

function addEventHandlerForSearch() {
	//TODO: Search the written tweets as text is entered into the search box, and add them to the table
	const searchBox = document.getElementById("textFilter");
	const searchCount = document.getElementById("searchCount");
	const searchText = document.getElementById("searchText");
	const tableBody = document.getElementById("tweetTable");

	searchBox.addEventListener("input", function() {
		const search = searchBox.value.trim().toLowerCase();
		tableBody.innerHTML = "";

		if (search == "") {
			searchCount.textContent = 0;
			searchText.textContent = "";
			return;
		}

		const results = writtenTweets.filter(tweet =>
			tweet.text.toLowerCase().includes(search.toLowerCase())

		);

		searchCount.textContent = results.length;
		searchText.textContent = search;

		const fragment = document.createDocumentFragment();

		results.forEach((tweet, i) => {
			const row = document.createElement("tr");
			row.innerHTML = tweet.getHTMLTableRow(i + 1);
			fragment.appendChild(row);
		});

		tableBody.appendChild(fragment);

	});
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(tweets => {
		parseTweets(tweets);
		addEventHandlerForSearch();

		document.getElementById("searchCount").textContent = 0;
		document.getElementById("searchText").textContent = "";
	});
});