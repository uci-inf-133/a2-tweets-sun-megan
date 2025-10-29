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
	
	const dateFormats = {
  		weekday: "long",
  		year: "numeric",
  		month: "long",
  		day: "numeric",
		timeZone: "UTC"
	};

	earliestDateString = earliestTweet.time.toLocaleDateString('en-US', dateFormats);
	latestDateString = latestTweet.time.toLocaleDateString('en-US', dateFormats);

	const numTweets = tweet_array.length;
	let numCompleted = 0;
	let numLive = 0;
	let numAchievement = 0;
	let numMisc = 0;

	for (let i = 0; i < numTweets; i++) {
		const tweet = tweet_array[i];

		if (tweet.source == "completed_event") {
			numCompleted++;
		} else if (tweet.source == "live_event") {
			numLive++;
		} else if (tweet.source == "achievement") {
			numAchievement++;
		} else {
			numMisc++;
		}
	}

	const completedPct = math.format((numCompleted / numTweets) * 100, {notation: "fixed", precision: 2});
	const livePct = math.format((numLive / numTweets) * 100, {notation: "fixed", precision: 2});
	const achievementPct = math.format((numAchievement / numTweets) * 100, {notation: "fixed", precision: 2});
	const miscPct = math.format((numMisc / numTweets) * 100, {notation: "fixed", precision: 2});

	const numWritten = tweet_array.filter(
		text => text.source == "completed_event" && text.written
	).length;

	const writtenPct = math.format((numWritten / numCompleted) * 100, {notation: "fixed", precision: 2});

	//This line modifies the DOM, searching for the tag with the numberTweets ID and updating the text.
	//It works correctly, your task is to update the text of the other tags in the HTML file!
	document.getElementById('numberTweets').innerText = tweet_array.length;	
	document.getElementById('firstDate').textContent = earliestDateString;
	document.getElementById('lastDate').textContent = latestDateString;

	document.querySelectorAll('.completedEvents').forEach(element => {element.textContent = numCompleted});;
	document.querySelector('.liveEvents').textContent = numLive;
	document.querySelector('.achievements').textContent = numAchievement;
	document.querySelector('.miscellaneous').textContent = numMisc;
	document.querySelector('.written').textContent = numWritten;

	document.querySelector('.completedEventsPct').textContent = `${completedPct}%`;
	document.querySelector('.liveEventsPct').textContent = `${livePct}%`;
	document.querySelector('.achievementsPct').textContent = `${achievementPct}%`;
	document.querySelector('.miscellaneousPct').textContent = `${miscPct}%`;
	document.querySelector('.writtenPct').textContent = `${writtenPct}%`;
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});