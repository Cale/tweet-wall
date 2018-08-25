<?php
require "../config.php";
require "../twitteroauth/autoload.php";
use Abraham\TwitterOAuth\TwitterOAuth;

// Get URL parameters
if (isset($_GET["since_id"])) {
    $sinceId = $_GET["since_id"];
} else {
    $sinceId = "1033098018441052161";
}

$connection = new TwitterOAuth($consumer_key, $consumer_secret, $access_token, $access_token_secret);
$content = $connection->get("account/verify_credentials");

$statuses = $connection->get("statuses/home_timeline", ["include_entities" => false, "exclude_replies" => false, "since_id" => $sinceId]);

echo json_encode($statuses);

?>
