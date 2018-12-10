<?php

$fh = fopen('summary.md','r+');

$array = [];

while(!feof($fh)){
  $line = fgets($fh);

  $key = explode('?key=',$line)[1] ?? null;
  $key = rtrim($key,")\n");

  $name = explode('[',$line)[1] ?? null;
  $name = explode('](',$name)[0];

  if($key){
    $array[] = [$key=>$name];
  }
}

file_put_contents('./summary.ts',
"const summary = \n `" . json_encode($array,JSON_UNESCAPED_UNICODE) . "`\n export default summary;");
