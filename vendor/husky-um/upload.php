<?php


class Uploadmanager{
  public $path = "";
  public $prefix = "";
	public function __construct($path){
    $this->path = $path;

    if(!is_dir($this->path)){
      mkdir($this->path);
    }
  }

  public function upload($file, $name, $contentfile = false){
    $return = array();

    $mode = "a";
    if($_POST[$this->prefix."t"] == "n"){
      $mode = "w";
    }
    if($handle = fopen($this->path.$name, $mode)){
      if($contentfile){
        $content = $file;
      }else{
        $content = file_get_contents($file['tmp_name']);
      }
      if(!$content){
        $return["e"] = "File is empty ".$this->path.$name;
      }
      else{
        $r = fwrite($handle, $content);
        if($r){
          if(isset($_POST[$this->prefix."upload-end"])){
            if(isset($_POST[$this->prefix."upload-last"])){
              $return["m"] = "Finish";
            }
            else{
              $return["m"] = "End";
            }
          }
          else{
            if($_POST[$this->prefix."t"] == "n"){
              $return["m"] = "New";
              $return["n"] = $name;
            }
            else{
              $return["m"] = "Continue";
            }
          }
        }
        else{
          $return["e"] = "Can't write file ".$this->path.$name;
        }
      }
    }
    else{
      $return["e"] = "Can't open file ".$this->path.$name;
    }

    return $return;
  }
}

?>
