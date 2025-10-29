function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	let activityTypes = new Map([
		["ski", {totalCount: 0, totalDistance: 0}],
		["run", {totalCount: 0, totalDistance: 0}],
		["mtn bike", {totalCount: 0, totalDistance: 0}],
		["bike", {totalCount: 0, totalDistance: 0}],
		["walk", {totalCount: 0, totalDistance: 0}],
		["workout", {totalCount: 0, totalDistance: 0}],
		["yoga", {totalCount: 0, totalDistance: 0}],
		["chair ride", {totalCount: 0, totalDistance: 0}],
		["snowboard", {totalCount: 0, totalDistance: 0}],
		["hike", {totalCount: 0, totalDistance: 0}]
	]);

	let weekdayTotal = 0;
	let weekdayCount = 0;
	let weekendTotal = 0;
	let weekendCount = 0;

	for (let i = 0; i < tweet_array.length; i++) {
		let tweet = tweet_array[i];
		if (tweet.source == "completed_event"
			&& tweet.activityType
			&& activityTypes.has(tweet.activityType)
		) {
			const current = activityTypes.get(tweet.activityType);
			current.totalCount += 1;
			current.totalDistance += tweet.distance;

			const day = tweet.time.getUTCDay();
			if (day == 0 || day == 6) {
				weekendTotal += tweet.distance;
				weekendCount++
			} else {
				weekdayTotal += tweet.distance;
				weekdayCount++
			}
		}
	}

	for (const [type, data] of activityTypes.entries()) {
		if (data.totalCount > 0) {
			console.log(`${type}: count=${data.totalCount}, totalDist=${data.totalDistance.toFixed(2)}, avg=${(data.totalDistance / data.totalCount).toFixed(2)}`);
		}
	}

	let numActivities = Array.from(activityTypes.values())
	.filter(v => v.totalCount > 0).length;

	const mostCommon = Array.from(activityTypes.entries())
	.sort((a, b) => b[1].totalCount - a[1].totalCount);

	const avgDistances = Array.from(activityTypes.entries())
	.map(([type, v]) => ({type, avg: v.totalDistance / v.totalCount}))
	.sort((a, b) => b.avg - a.avg);

	const avgWeekday = weekdayCount > 0 ? weekdayTotal / weekdayCount: 0;
	const avgWeekend = weekendCount > 0 ? weekendTotal / weekendCount: 0;
	
	let whenLonger = "";
	if (avgWeekend > avgWeekday) {
		whenLonger = "weekends";
	} else if (avgWeekday > avgWeekend) {
		whenLonger = "weekdays";
	} else {
		whenLonger = "both weekdays and weekends"
	}

	document.getElementById("numberActivities").textContent = numActivities;
	document.getElementById("firstMost").textContent = mostCommon[0][0];
	document.getElementById("secondMost").textContent = mostCommon[1][0];
	document.getElementById("thirdMost").textContent = mostCommon[2][0];
	document.getElementById("longestActivityType").textContent = avgDistances[0].type;
	document.getElementById("shortestActivityType").textContent = avgDistances[numActivities - 1].type;
	document.getElementById("weekdayOrWeekendLonger").textContent = whenLonger;

	//TODO: create a new array or manipulate tweet_array to create a graph of the number of tweets containing each type of activity.

	activity_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "data": {
	    "values": tweet_array
	  }
	  //TODO: Add mark and encoding
	};
	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});

	//TODO: create the visualizations which group the three most-tweeted activities by the day of the week.
	//Use those visualizations to answer the questions about which activities tended to be longest and when.
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});