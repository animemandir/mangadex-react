<?php

if(in_array($_SERVER['HTTP_ORIGIN'],["http://localhost:3000","https://mangadex-react.herokuapp.com"])){
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Content-Type: application/json');
}

$url = str_replace("https://malleus.moe/dex-proxy/chapter.php","https://api.mangadex.org/chapter","https://{$_SERVER[HTTP_HOST]}{$_SERVER[REQUEST_URI]}");
echo file_get_contents($url);