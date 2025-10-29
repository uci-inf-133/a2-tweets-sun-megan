class Tweet {
	private text:string;
	time:Date;

	constructor(tweet_text:string, tweet_time:string) {
        this.text = tweet_text;
		this.time = new Date(tweet_time);//, "ddd MMM D HH:mm:ss Z YYYY"
	}

	//returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
    get source():string {
        //TODO: identify whether the source is a live event, an achievement, a completed event, or miscellaneous.
        const text = this.text;
        
        if (text.startsWith("Just completed") || (text.startsWith("Just posted"))) {
            return 'completed_event';
        } else if (text.includes("right now") || (text.includes("Watch my"))) {
            return 'live_event';
        } else if (text.startsWith("Achieved a new personal record")) {
            return 'achievement'
        } else {
            return 'miscellaneous';
        }
    }

    //returns a boolean, whether the text includes any content written by the person tweeting.
    get written():boolean {
        //TODO: identify whether the tweet is written
        let text = this.text;

        const urlIndex = text.indexOf("https://t.co/");
        if (urlIndex !== -1) {
            text = text.substring(0, urlIndex);
       }

       return text.includes(" - ");
    }

    get writtenText():string {
        if(!this.written) {
            return "";
        }

        let text = this.text;

        //TODO: parse the written text from the tweet
        const dashIndex = text.indexOf(" - ");
        if (dashIndex !== -1) {
            const beforeURL = text.substring(dashIndex + 3);
            const urlIndex = beforeURL.indexOf("https://t.co/");
            return urlIndex !== -1 ? beforeURL.substring(0, urlIndex).trim() : beforeURL.trim();
        }
        return "";
    }

    get activityType():string {
        if (this.source != 'completed_event') {
            return "unknown";
        }
        //TODO: parse the activity type from the text of the tweet
        return "";
    }

    get distance():number {
        if(this.source != 'completed_event') {
            return 0;
        }
        //TODO: prase the distance from the text of the tweet
        return 0;
    }

    getHTMLTableRow(rowNumber:number):string {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
        return "<tr></tr>";
    }
}