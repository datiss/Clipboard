<?php
$dpath = 'data/';
$tpath = 'data/text/';

if(is_dir($dpath) && is_dir($tpath)){
  switch($_POST["a"]){
    case "sync" :
      $text = false;
      $files = false;

      if($_POST["tt"] < filemtime("textlock")){
        $text = array();
        $data = array_diff(scandir($tpath), array('..', '.'));
        foreach($data as $f){
          if($f != "." && $f != ".."){
            $timestamp = filemtime($tpath.$f);
            $text[] = (object) array("id" => $f, "name" => "", "date" => date("d.m.Y", $timestamp), "timestamp" => $timestamp, "text" => file_get_contents($tpath.$f));
          }
        }
      }

      if($_POST["dt"] < filemtime("datalock")){
        $files = array();
        $data = array_diff(scandir($dpath), array('..', '.'));
        foreach($data as $f){
          if($f != "." && $f != ".." && is_file($dpath.$f)){
            $timestamp = filemtime($dpath.$f);
            $files[] = (object) array("name" => $f, "date" => date("d.m.Y", $timestamp), "timestamp" => $timestamp);
          }
        }
      }
      if($text === false && $files === false){
        echo(json_encode(array("r" => 0)));
      }
      else{
        echo(json_encode(array("r" => 1, "t" => $text, "d" => $files, "tt" => filemtime("textlock"), "dt" => @filemtime("datalock"))));
      }
    break;
    case "init" :
      $text = array();
      $data = array_diff(scandir($tpath), array('..', '.'));
      foreach($data as $f){
        if($f != "." && $f != ".."){
          $timestamp = filemtime($tpath.$f);
          $text[] = (object) array("id" => $f, "name" => "", "date" => date("d.m.Y", $timestamp), "timestamp" => $timestamp, "text" => file_get_contents($tpath.$f));
        }
      }

      $files = array();
      $data = array_diff(scandir($dpath), array('..', '.'));
      foreach($data as $f){
        if($f != "." && $f != ".." && is_file($dpath.$f)){
          $timestamp = filemtime($dpath.$f);
          $files[] = (object) array("name" => $f, "date" => date("d.m.Y", $timestamp), "timestamp" => $timestamp);
        }
      }
      echo(json_encode(array("r" => 1, "t" => $text, "d" => $files, "tt" => filemtime("textlock"), "dt" => @filemtime("datalock"))));
    break;
    case "addText" :
      $id = basename($_POST["id"]);
      $text = $_POST["text"];
      $time = time();
      if(file_put_contents($tpath.$id, $text) === false){
        echo(json_encode(array("r" => 0)));
      }
      else{
        touch("textlock", $time);
        echo(json_encode(array("r" => 1, "date" => date("d.m.Y", filemtime($tpath.$id)), "tt" => filemtime("textlock"))));
      }
    break;
    case "editText" :
      $id = basename($_POST["id"]);
      $text = $_POST["text"];
      $time = time();
      if(file_put_contents($tpath.$id, $text) === false){
        echo(json_encode(array("r" => 0)));
      }
      else{
          touch("textlock", $time);
        echo(json_encode(array("r" => 1, "tt" => filemtime("textlock"))));
      }
    break;
    case "delText" :
      $id = basename($_POST["id"]);
      if(is_file($tpath.$id)){
        $time = time();
        if(unlink($tpath.$id) === false){
          echo(json_encode(array("r" => 0)));
        }
        else{
            touch("textlock", $time);
          echo(json_encode(array("r" => 1, "tt" => filemtime("textlock"))));
        }
      }
    break;
    case "upload-file" :
      $contentfile = false;
      $file = $_FILES["f"];
      if(!isset($file)){
        $file = $_POST["f"];
        $file = json_decode($file);
        $file = $file->f;
        $contentfile = true;
      }

      $name = "";
      if($_POST["t"] == "n"){
        $name = $_POST["n"];

        if(is_file($dpath.$name)){
          unlink($dpath.basename($name));
        }
      }
      else{
        if(isset($_POST["n"])){
          $name = $_POST["n"];
        }
      }


      include_once("vendor/husky-um/upload.php");
      $uploadmanager = new Uploadmanager($dpath);
      $r = $uploadmanager->upload($file, $name, $contentfile);

      if(!isset($r["e"])){
        if(isset($_POST["upload-end"])){
          touch("datalock", time());
          $timestamp = filemtime("datalock");

          $obj = (object) array("name" => $name, "date" => date("d.m.Y", $timestamp), "timestamp" => $timestamp);
          echo(json_encode(array_merge(array("r" => 1, "f" => $obj, "dt" => $timestamp), $r)));
        }
        else{
          echo(json_encode(array_merge($r, array("r" => 1))));
        }
      }
      else{
        echo(json_encode(array("r" => 0, "m" => "Datei Upload fehlgeschlagen.", "e" => "Can't move file.")));
      }


    break;
    case "delFile" :
      $name = basename($_POST["n"]);
      if(is_file($dpath.$name)){
        $time = time();
        if(unlink($dpath.$name)){
          touch("datalock", $time);
          echo(json_encode(array("r" => 1)));
        }
        else{
          echo(json_encode(array("r" => 0, "d" => "<p>Datei konnte nicht gelöscht werden.</p>")));
        }
      }
    break;
  }
}
else{
  echo(json_encode(array("r" => 0, "d" => "Data dir not found!")));
}




?>
