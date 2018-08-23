<?php
$timeline = "";

// Get URL parameters
if (isset($_GET["timeline"])) {
    $timeline = $_GET["timeline"];
};
echo $timeline;

 ?>
