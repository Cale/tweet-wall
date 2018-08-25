<?php
require "../config.php";
require "../twitteroauth/autoload.php";
use Abraham\TwitterOAuth\TwitterOAuth;

$connection = new TwitterOAuth($consumer_key, $consumer_secret, $access_token, $access_token_secret);
$content = $connection->get("account/verify_credentials");

$statuses = $connection->get("statuses/home_timeline", ["include_entities" => false, "exclude_replies" => false, "since_id" => 1033098018441052161]);

echo json_encode($statuses);
//print_r($statuses);
?>
