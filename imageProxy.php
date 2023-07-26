<?php
// Get the image URL from the query parameter
$imageUrl = $_GET['url'];

// Get the image data
$imageData = file_get_contents($imageUrl);

// Set the content type as image
header('Content-Type: image/jpeg');

// Output the image data
echo $imageData;
?>
