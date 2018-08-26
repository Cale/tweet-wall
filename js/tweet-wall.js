$( document ).ready(function() {
    var url = new URL(window.location.href);
    var interval = ""; // Time interval between fetching new Tweets.
    var since_id = "1033098018441052161";

    if (url.searchParams.get("interval")) {
        interval = url.searchParams.get("interval");
    } else {
        interval = 60000;
    }

    function displayTweet(tweet, i, tweetCount) {
        console.log(tweet);
        var tweetText;
        if (tweet.retweeted_status) {
            tweetText = tweet.retweeted_status.full_text;
        } else {
            tweetText = tweet.full_text;
        }
        var urls;
        var users;
        var hashtags;
        var tweetUrlRemoved = tweetText
        var urlExpression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
        var usersExpression = /(^|[^@\w])@(\w{1,15})\b/g;
        var hashtagExpression = /(\S*#\[[^\]]+\])|(\S*#\S+)/gi;
        var urlRegex = new RegExp(urlExpression);
        var usersRegex = new RegExp(usersExpression);
        var hashtagRegex = new RegExp(hashtagExpression);
        urls = tweetText.match(urlRegex);
        users = tweetText.match(usersRegex);
        hashtags = tweetText.match(hashtagRegex);
        if (urls) {
            $.each(urls, function( i, url ) {
                console.log(i+' '+url);
                tweetUrlRemoved = tweetUrlRemoved.replace(url,'<a href="'+url+'" target="_blank">'+url+'</a>');
            });
        }
        if (users) {
            $.each(users, function( i, user ) {
                console.log(i+' '+user);
                nospace = user.trim();
                noat = nospace.replace("@",'');
                noat = nospace.replace(".",'');
                tweetUrlRemoved = tweetUrlRemoved.replace(user,' <a href="https://twitter.com/'+noat+'" target="_blank">'+nospace+'</a>');
            });
        }
        if (hashtags) {
            $.each(hashtags, function( i, tag ) {
                console.log(i+' '+tag);
                nospace = tag.trim();
                nohash = nospace.replace("#",'');
                tweetUrlRemoved = tweetUrlRemoved.replace(tag,' <a href="https://twitter.com/hashtag/'+nohash+'?src=hash" target="_blank">'+nospace+'</a>');
            });
        }
        console.log(tweetUrlRemoved);
        $( "p" ).fadeOut( "fast", function() {
            $(".user").html('<a href="https://twitter.com/'+tweet.user.screen_name+'" target="_blank">@'+tweet.user.screen_name+'</a>');
            $(".tweet").html(tweetUrlRemoved);
            $("p").fadeIn( "fast", function() {
                if ( (i+1) == tweetCount ) {
                    fetchTweets();
                    console.log("Fetch more Tweets.");
                }
            });
        });
    }

    function rotateTweets(tweets) {
        console.log(interval / tweets.length);
        tweetCount = tweets.length;
        tweetInterval = interval / tweetCount;
        $.each(tweets, function( i, tweet ) {
            setTimeout(function() { displayTweet( tweet, i, tweetCount ); }, (i+1) * tweetInterval );
        });
    }

    function fetchTweets() {
        $.getJSON( "/json/tweets.php?since_id="+since_id, function( tweets ) {
            console.log("Fetched "+tweets.length+" Tweets.")
            if ( tweets.length > 0) {
                since_id = tweets[0].id_str;
                console.log("id: "+since_id);
                rotateTweets(tweets.reverse());
            } else {
                console.log("No Tweets. Waiting...");
                setTimeout(function() { fetchTweets(); }, interval );
            }
        });
    }

    fetchTweets();
});
