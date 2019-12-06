var UM = function(url, config){
  config = config || {};

  this.chunckPos = 0;
  this.chunckLimit = 0;
  this.chunckSize = config.chunckSize || 1024*1024*2;

  this.dataAdd = config.dataAdd || [];
  this.files = [];
  this.upFiles = [];
  this.activeFile = false;
  this.reupload = false;

  this.returnObj = {};
  this.url = url;

  this.action = config.action || "upload-file";
  this.uploading = false;
  this.autoUpload = config.autoUpload || false;
  this.onFinish = function(){};
  this.failedEvent = function(){};

  this.onUploadStart = function(file){
    $(file.d).find(".name .fa").removeClass("fa-pause").addClass("fa-upload");
  };
  this.onUploadNext = function(file){

  };
  this.onUploadProgress = function(file, progress){
    $(file.d).find(".up-bg").css("width", progress+"%");
  };
  this.onUploadLoad = function(file, progress){

  };
  this.onUploadFinish = function(file,json){
    $(file.d).addClass("text-white");
    $(file.d).find(".up-bg").css("width", "100%");
    $(file.d).find(".name .fa").removeClass("fa-upload").addClass("fa-check");
  };
  this.onUploadError = function(file, json){
    $(file.d).addClass("text-white");
    $(file.d).find(".up-bg").addClass("bg-danger");
    $(file.d).find(".up-bg").css("width", "100%");
    $(file.d).find(".name .fa").removeClass("fa-upload").addClass("fa-exclamation");
    $(file.d).find(".error").html(json.m);
  };


}

UM.prototype.isUploading = function(){
  return this.uploading;
};

UM.prototype.addFile = function(file, dom, data){
  if(!Array.isArray(data)){
    data = [data];
  }
  if(typeof file == "string"){
    this.files.push({f: file, s: UM.strToByte(file), d: dom, o: data});
  }
  else{
    this.files.push({f: file, d: dom, o: data});
  }

  if(this.autoUpload && !this.uploading){
    this.uploadStart();
  }
};

UM.prototype.addFileString = function(str, name, dom, data){
  this.files.push({f: str, n: name, s: UM.strToByte(str), d: dom, o: data});
  if(this.autoUpload && !this.uploading){
    this.uploadStart();
  }
};

UM.prototype.addFiles = function(files){
  this.files = this.files.concat(files);
  if(this.autoUpload && !this.uploading){
    this.uploadStart();
  }
};

UM.prototype.uploadStart = function(){
  var that = this;
  var data = new FormData();
  var xhr = new XMLHttpRequest();

  that.uploading = true;
  var offset = 0;
  if(that.files.length == 0 && that.activeFile === false){
    //console.log("Upload fertig");
    that.onFinish(this.returnObj);
    that.uploading = false;
    return false;
  }
  else if(that.activeFile === false){
    //console.log("Nächste Datei");
    that.activeFile = that.files.splice(0,1)[0];
    that.chunckPos = 0;
    offset = 0;

    if(typeof that.activeFile.f == "string"){
      that.chunckLimit = Math.ceil(that.activeFile.s/that.chunckSize,that.chunckSize);
      if(that.activeFile.s <= that.chunckSize){
        data.append("upload-end", 1);
        if(that.files.length == 0){
          data.append("upload-last", 1);
        }
      }
      if(this.activeFile.n){
        data.append("n", this.activeFile.n);
      }
      var s = slice(this.activeFile.f, offset,offset+that.chunckSize);
      data.append("f", s);
    }
    else{
      that.chunckLimit = Math.ceil(that.activeFile.f.size/that.chunckSize,that.chunckSize);

      if(that.activeFile.f.size <= that.chunckSize){
        data.append("upload-end", 1);
        if(that.files.length == 0){
          data.append("upload-last", 1);
        }
      }
      data.append("n", this.activeFile.f.name);
      data.append("f", slice(this.activeFile.f, offset,offset+that.chunckSize));
    }

    data.append("t", "n");
    this.onUploadStart(that.activeFile);
  }
  else{
    //console.log("Datei fortführen");
    if(typeof that.activeFile.f == "string"){
      var perce = Math.round((that.chunckPos/that.chunckLimit)*100);
      $(that.activeFile.d).find(".up-bg").css("width", perce+"%");
      offset = that.chunckSize*that.chunckPos;
      if(that.chunckPos+1 >= that.chunckLimit){
        data.append("upload-end", 1);
        if(that.files.length == 0){
          data.append("upload-last", 1);
        }
      }

      data.append("f", slice(this.activeFile.f, offset,offset+that.chunckSize));
    }
    else{
      var perce = Math.round((that.chunckPos/that.chunckLimit)*100);
      $(that.activeFile.d).find(".up-bg").css("width", perce+"%");
      offset = that.chunckSize*that.chunckPos;
      if(that.chunckPos+1 >= that.chunckLimit){
        data.append("upload-end", 1);
        if(that.files.length == 0){
          data.append("upload-last", 1);
        }
      }

      data.append("f", slice(this.activeFile.f, offset,offset+that.chunckSize));
    }

    data.append("t", "c");
    data.append("n", this.activeFile.name);

    this.onUploadNext(that.activeFile);
  }

  data.append("a", this.action);
  $.each(that.dataAdd, function(index, element){
    data.append(element.n, element.v);
  });

  if(this.activeFile.o){
    if(Array.isArray(this.activeFile.o)){
      $.each(that.activeFile.o, function(index, element){
        data.append(element.n, element.v);
      });
    }
    else{
      data.append(this.activeFile.o.n, this.activeFile.o.v);
    }
  }



  xhr.upload.addEventListener("progress", function(e){that.progressEvent(e);});
  xhr.upload.addEventListener("load", function(e){that.loadEvent(e);});
  xhr.onload = function(e){that.onloadEvent(e);};
  xhr.open("POST", that.url);
  xhr.send(data);
};

UM.prototype.progressEvent = function(e){
  if (e.lengthComputable && this.activeFile) {
    var perce = Math.round((e.loaded / e.total)*(1/this.chunckLimit)*100+(this.chunckPos/this.chunckLimit)*100);
    this.onUploadProgress(this.activeFile, perce);
  }
};

UM.prototype.loadEvent = function(e){
  if (this.activeFile) {
    this.onUploadLoad(this.activeFile, 100);
  }
};

UM.prototype.onloadEvent = function(e){
  if (e.currentTarget.status == 200 && e.currentTarget.responseText.length > 0) {
    var json = JSON.parse(e.currentTarget.responseText);
    if(json.r == 1){
      if(json.m == "New"){
        this.activeFile.name = json.n;
      }
      this.returnObj = json;
      this.chunckPos++;
      if(this.chunckPos >= this.chunckLimit){
          this.upFiles.push(this.activeFile);

          this.onUploadFinish(this.activeFile, this.returnObj);
          this.activeFile = false;
      }

      this.uploadStart();
    }
    else{
      if(json.e){
        console.log(json.e);
        this.onUploadError(this.activeFile, json);
        this.files.splice(0,0,this.activeFile);
        this.reupload = true;
      }
      else{
        this.onUploadError(this.activeFile, json);
        this.files.splice(0,0,this.activeFile);
        this.reupload = true;
      }
      this.activeFile = false;
    }
  }
};

function slice(file, start, end) {
  var slice = file.mozSlice ? file.mozSlice :
              file.webkitSlice ? file.webkitSlice :
              file.slice ? file.slice : noop;

  return slice.bind(file)(start, end);
}

UM.strToByte = function(str){
  // Force string type
      str = String(str);

      var byteLen = 0;
      for (var i = 0; i < str.length; i++) {
          var c = str.charCodeAt(i);
          byteLen += c < (1 <<  7) ? 1 :
                     c < (1 << 11) ? 2 :
                     c < (1 << 16) ? 3 :
                     c < (1 << 21) ? 4 :
                     c < (1 << 26) ? 5 :
                     c < (1 << 31) ? 6 : Number.NaN;
      }
      return byteLen;
};
