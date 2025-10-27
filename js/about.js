function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	earliestTweet = tweet_array.reduce((earliest, current) => {
		return current.time < earliest.time ? current: earliest;
	});

	latestTweet = tweet_array.reduce((latest, current) => {
		return current.time > latest.time ? current: latest;
	});
	
	const options = {
  		weekday: "long",
  		year: "numeric",
  		month: "long",
  		day: "numeric",
	};

	earliestDateString = earliestTweet.time.toLocaleDateString('en-US', options);
	latestDateString = latestTweet.time.toLocaleDateString('en-US', options);

	//This line modifies the DOM, searching for the tag with the numberTweets ID and updating the text.
	//It works correctly, your task is to update the text of the other tags in the HTML file!
	document.getElementById('numberTweets').innerText = tweet_array.length;	
	document.getElementById('firstDate').textContent = earliestDateString;
	document.getElementById('lastDate').textContent = latestDateString;
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});