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

	document.getElementById("numberActivities").textContent = numActivities;
	document.getElementById("firstMost").textContent = mostCommon[0][0];
	document.getElementById("secondMost").textContent = mostCommon[1][0];
	document.getElementById("thirdMost").textContent = mostCommon[2][0];

	//TODO: create a new array or manipulate tweet_array to create a graph of the number of tweets containing each type of activity.

	const activityCounts = Array.from(activityTypes.entries())
	.map(([activity, data]) => ({ activity, count: data.totalCount }));

		const mostCommonActivities = Array.from(activityTypes.entries())
	.filter(([_, data]) => data.totalCount > 0)
	.sort((a, b) => b[1].totalCount - a[1].totalCount)
	.slice(0, 3)
	.map(([activity]) => activity);

	const distancesByDay = tweet_array
	.filter(tweet => tweet.source === "completed_event" && mostCommonActivities.includes(tweet.activityType))
	.map(tweet => ({
		activity: tweet.activityType,
		distance: tweet.distance,
		day: tweet.time.getUTCDay(),
 	}));

	const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
	distancesByDay.forEach(d => d.dayName = dayNames[d.day]);

	const activityCountsSpec = {
		"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  	"description": "A graph of the number of Tweets containing each type of activity.",
	  	"data": {
			"values": activityCounts
			//TODO: Add mark and encoding
		},
		"mark": "bar",
		"encoding": {
			"x": {"field": "activity", "type": "nominal", "title": "Activity Type"},
    		"y": {"field": "count", "type": "quantitative", "title": "Number of Tweets"}
		}
	};
	vegaEmbed('#activityVis', activityCountsSpec, {actions:false});

	//TODO: create the visualizations which group the three most-tweeted activities by the day of the week.

	const distancePointsSpec = {
		"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  	"description": "A graph of the distances by day of the week for the top 3 activities",
	  	"data": {
			"values": distancesByDay
		},
		"mark": "point",
		"encoding": {
			"x": {"field": "dayName", "type": "ordinal", "title": "Day of Week", "sort": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]},
    		"y": {"field": "distance", "type": "quantitative", "title": "Distance (mi)"},
			"color": {"field": "activity", "type": "nominal", "title": "Activity Type"},
			"tooltip": [
					{"field": "activity", "type": "nominal"},
					{"field": "distance", "type": "quantitative"},
					{"field": "dayName", "type": "ordinal"}
			]
		}
	};
	vegaEmbed('#distanceVis', distancePointsSpec, {actions:false});

	//Use those visualizations to answer the questions about which activities tended to be longest and when.

	const distanceMeanSpec = {
		"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  	"description": "A graph of the mean distance by day for the top 3 activities",
	  	"data": {
			"values": distancesByDay
		},
		"mark": "point",
		"encoding": {
			"x": {"field": "dayName", "type": "ordinal", "title": "Day of Week", "sort": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]},
    		"y": {"field": "distance", "type": "quantitative", "aggregate": "mean", "title": "Average Distance (mi)"},
			"color": {"field": "activity", "type": "nominal", "title": "Activity Type"},
			"tooltip": [
					{"field": "activity", "type": "nominal"},
					{"field": "distance", "type": "quantitative", "aggregate": "mean"},
					{"field": "dayName", "type": "ordinal"}
			]
		}
	};
	// vegaEmbed('#distanceVisAggregated', distanceMeanSpec, {actions:false});

	let showingMean = false;
	const distanceDiv = "#distanceVis";

	document.getElementById("aggregate").addEventListener("click", () => {
		if (showingMean) {
			vegaEmbed(distanceDiv, distancePointsSpec, {actions:false});
		} else {
			vegaEmbed(distanceDiv, distanceMeanSpec, {actions:false});
		}
		showingMean = !showingMean
	});
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});