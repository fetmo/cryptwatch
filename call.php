<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$url = $_GET['url'] . ((isset($_GET['addr'])) ? '&addr=' . $_GET['addr'] : '');

if (!isset($_GET['is_post'])) {
    echo file_get_contents($url);
} else {

    $url = substr($url, 1, -1);
    $curl = \curl_init();

    $fields = $_GET['blocks'];
    $fields = [
        'fields' => json_decode($fields)
    ];

    //set the url, number of POST vars, POST data
    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_POST, count($fields));
    curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($fields));

    //execute post
    $result = curl_exec($curl);

    var_dump($result);
}
