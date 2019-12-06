$(function() {
  cb.init(init);
});

function sync() {
  cb.text.sort(cb.sortFunc);
  cb.data.sort(cb.sortFunc);

  // Update text files
  if (cb.text.length > 0) {
    $(".cp-content").html('<pre id="editor" class="ph"></pre>');

    initEditor();
    $(".cp-text").html("");
    for (var i = 0; i < cb.text.length; i++) {
      var n = 'Empty';
      if (!cb.text[i].n) {
        n = cb.text[i].text.split("\n")[0].substr(0, 10);
        if (n.length <= 0) {
          n = "Empty";
        }
      }
      var text = getText(htmlEntities(n) ,cb.text[i]);
      $(".cp-text").append(text);
    }

    if (selectedText && $("#" + selectedText).length > 0) {
      $("#" + selectedText).click();
    }
  } else {
    $(".cp-content").html('<div class="info"><p>Zum hinzufügen von neuen Texten, klicken Sie einfach oben rechts auf das <span class="fa fa-plus fa-2x"></span></p></div>');
  }


  // Update files
  if (cb.data.length > 0) {
    $(".cp-files").html('');
    for (var i = 0; i < cb.data.length; i++) {
      var n = '&nbsp;';
      if (cb.data[i].length > 0) {
        n = cb.data[i];
      }

      var file = getFile(cb.data[i]);
      $(".cp-files").append(file);
    }
  } else {
  //  $("#data").html('<div id="addData"><span class="fa fa-upload"></span> Datei Upload</div><div class="info"><p>Zum hinzufügen von neuen Datein, ziehen Sie diese einfach in das Browserfenster.</p></div>');
  }

}

function getText(name, file){
  var idvalue = ' id="text' + file.id + '"';
  var text = $('<a href="javascript:;" class="list-group-item list-group-item-action list-group-item-light d-flex justify-content-between align-items-center"'+idvalue+'><span class="name">' + name + '</span><button class="cp-del btn btn-link"><i class="fa fa-trash fa-fw"></i></button><span class="badge badge-secondary badge-pill">'+file.date+'</span></a>');
  $(text).bind("click", selText);
  $(text).find(".cp-del").bind("click", delText);
  $(text).data("obj", file);

  return text;
}

function getFile(file){
  var text = $('<a id="file' + encodeURI(file.name) + '"  title="'+htmlEntities(file.name)+' herunterladen" target="_blank" href="download.php?n=' + encodeURI(file.name) + '" class="list-group-item list-group-item-action list-group-item-light d-flex justify-content-between align-items-center"><span class="name">' + htmlEntities(file.name) + '</span><button class="cp-del btn btn-link"><i class="fa fa-trash fa-fw"></i></button><span class="badge badge-secondary badge-pill">'+file.date+'</span></a>');
  $(text).find(".cp-del").bind("click", delFile);
  $(text).data("obj", file);

  return text;
}

function getUploadfile(file){
  var text = $('<li id="file' + encodeURI(file.name) + '" class="list-group-item list-group-item-action list-group-item-light d-flex justify-content-between align-items-center"><span class="name">' + htmlEntities(file.name) + '</span></a>');
  $(text).find(".cp-del").bind("click", delFile);
  $(text).data("obj", file);
  return text;
}

function toggleNav(){
  $("#nav").toggleClass("hide");
}

function init() {
  // Bind event handler
  $(".cp-add-text").bind("click", addText);
  $(".cp-copy-text").bind("click", copyText);
  $(".cp-add-file").bind("click", addFile);
  $("#toggle-nav").bind("click", toggleNav);

  cb.text.sort(cb.sortFunc);
  cb.data.sort(cb.sortFunc);
  // Init text files
  if (cb.text.length > 0) {
    $(".cp-content").html('<pre id="editor" class="ph"></pre>');

    initEditor();

    for (var i = 0; i < cb.text.length; i++) {
      var n = 'Empty';
      if (cb.text[i].name.length == 0) {
        n = cb.text[i].text.split("\n")[0].substr(0, 10);
        if (n.length <= 0) {
          n = "Empty";
        }
      }
      var text = getText(htmlEntities(n) ,cb.text[i]);
      $(".cp-text").append(text);
    }

    $($(".cp-text li")[0]).click();
  } else {
    $(".cp-content").html('<div class="info"><p>Zum hinzufügen von neuen Texten, klicken Sie einfach oben rechts auf das <span class="fa fa-plus fa-2x"></span></p></div>');
  }


  // Init files
  if (cb.data.length > 0) {
    for (var i = 0; i < cb.data.length; i++) {
      var n = '&nbsp;';
      if (cb.data[i].length > 0) {
        n = cb.data[i];
      }

      var file = getFile(cb.data[i]);
      $(".cp-files").append(file);
    }
  } else {
  //  $(".cp-files").html('<div id="addData"><span class="fa fa-upload"></span>  Datei Upload</div><div class="info"><p>Zum hinzufügen von neuen Datein, ziehen Sie diese einfach in das Browserfenster.</p></div>');
  }

  // Init file upload
  $("#cp-fileupload-input").bind("change", function(e) {
    var files = $(e.currentTarget).prop("files");
    if ($("#data .info").length > 0) {
      //$("#data").html('<div id="addData"><span class="fa fa-upload"></span>  Datei Upload</div><ul id="datalist" class="list-group"></ul><ul id="uploadlist" class="list-group"></ul>');
    }

    for (var i = 0; i < files.length; i++) {
      var file = files[i];

      var found = false;
      var f = getUploadfile(file);

      $(".cp-files-upload").append(f);
      uploadFile(file, f);
    }

  });

  // Init file upload via drag and drop
  $("body")[0].addEventListener('dragover', function(e) {
    e.stopPropagation();
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }, false);
  $("body")[0].addEventListener('drop', function(e) {
    e.stopPropagation();
    e.preventDefault();

    if ($("#data .info").length > 0) {
    //  $("#data").html('<div id="addData"><span class="fa fa-upload"></span>  Datei Upload</div><ul id="datalist" class="list-group"></ul><ul id="uploadlist" class="list-group"></ul>');
    }

    var files = e.dataTransfer.files;
    for (var i = 0; i < files.length; i++) {
      var file = files[i];

      var found = false;
      var f = getUploadfile(file);

      $(".cp-files-upload").append(f);
      uploadFile(file, f);
    }
  }, false);


  // Init sync interval
  setInterval(function() { cb.sync(sync); }, 1000 * 3);
}

function copyText(){
  var sel = editor.selection.toJSON(); // save selection
  editor.selectAll();
  editor.focus();
  document.execCommand('copy');
  editor.selection.fromJSON(sel); // restore selection
}


function addFile(e) {
  $("#cp-fileupload-input").click();
}

function delFile(e) {
  e.preventDefault();
  var n = $(e.currentTarget).parent(".list-group-item").children(".name").text();
  cb.delFile(n);
  $(e.currentTarget).parent(".list-group-item").remove();
  if ($(".cp-files").length == 0) {
    //$("#data").html('<div id="addData"><span class="fa fa-upload"></span>  Datei Upload</div><div class="info"><p>Zum hinzufügen von neuen Texten, klicken Sie einfach oben rechts auf das <span class="fa fa-plus fa-2x"></span></p></div>');
  }
}


function uploadFile(file, dom) {
  if (file.size < 1) {
    showMsgFalse('Die Datei darf nicht leer sein.');
    $(dom).remove();
  } else if (file.name.length > 255) {
    showMsgFalse('Der Name darf maximal 255 Zeichen enthalten.');
  } else {

    var prog = $('<div class="progress progress-bar-striped active"></div>');
    var proc = $('<div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width: 60%;">Warte..</div>');
    prog.append(proc);
    dom.append(prog);

    cb.uploadmanager.addFile(file, dom, []);
  }
}


var editor;

function initEditor(value) {
  value = value || '';
  if (ace) {
    var mode = "ace/mode/javascript";
    editor = ace.edit("editor");
    editor.session.setMode(mode);
    editor.setValue(value);
    editor.getSession().blockScrolling = Infinity;
    editor.getSession().on('change', function(e) {
      if (editor.curOp && editor.curOp.command.name) {
        var obj = $(".cp-text .list-group-item.active").data("obj");
        obj.text = editor.getValue();
        if (!obj.n) {
          var n = obj.text.split("\n")[0].substr(0, 10);
          if (n.length <= 0) {
            n = "Empty";
          }
          $(".cp-text .list-group-item.active .name").text(n);
        }
        cb.editText(obj.id, obj.text);
      }
    });
    editor.$blockScrolling = Infinity;
    return editor;
  }

  return false;
}

function addText(e) {
  var obj = cb.addText('');
  var text = getText("Empty", obj);

  $(".cp-text").prepend(text);

  if (cb.text.length == 1) {
    $(".cp-content").html('<pre id="editor" class="ph"></pre>');
    initEditor();
  }
  /*
    var help = $('<textarea id="helptext"></textarea>');
    $("body").append(help);
    $(help)[0].focus();
    document.execCommand("Paste");
    */
  $(text).click();
}

function delText(e) {
  if ($(e.currentTarget).hasClass("active")) {

    var next = $(e.currentTarget).prev(".list-group-item");
    if (next.length == 0) {
      next = $(e.currentTarget).next(".list-group-item");
    }

    if (next.length > 0) {
      $(next).click();
    } else {
      $(".cp-content").html('<div class="info"><p>Zum hinzufügen von neuen Texten, klicken Sie einfach oben rechts auf das <span class="fa fa-plus fa-2x"></span></p></div>');
    }
  }

  var obj = $(e.currentTarget).parent(".list-group-item").data("obj");
  cb.delText(obj.id);
  $(e.currentTarget).parent(".list-group-item").remove();
}

var selectedText;

function selText(e) {
  if (!$(e.currentTarget).hasClass("active")) {
    $(".cp-text .list-group-item.active").removeClass("active");
    $(e.currentTarget).addClass("active");
  }

  selectedText = $(e.currentTarget).prop("id");
  var obj = $(e.currentTarget).data("obj");
  editor.setValue(obj.text);
  editor.focus();
}

function showMsgFalse() {

}

function showMsgTrue() {

}

function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}


var cb = {}

cb.text = Array();
cb.data = Array();
cb.uploadmanager = new UM("ajax.php", {autoUpload: true});


cb.onUploadProgress = function(file, progress){
  file.d.find(".progress-bar").css("width", progress+"%").text(progress+"%");
};

cb.onUploadFinish = function(file, json){
  if (json.r == 1) {
    var f = getFile(json.f);
    $(".cp-files").prepend(f);

    file.d.remove();
  } else {
    showMsgFalse(json.m, false);
    file.d.remove();
  }
};

cb.onUploadError = function(file, json){
  console.log("Upload error: ", json);
  file.d.remove();
};



cb.sortFunc = function(a, b){
  return b.timestamp - a.timestamp;
};


cb.sync = function(callback) {
  callback = callback || function() {};
  $.ajax({
    async: "false",
    type: "POST",
    url: "ajax.php",
    dataType: "json",
    data: {
      a: "sync",
      tt: cb.textTime,
      dt: cb.dataTime
    },
    success: function(e) {
      if (e.r == 1) {
        if (e.t !== false) {
          cb.text = e.t;
        }
        if (e.d !== false) {
          cb.data = e.d;
        }

        cb.textTime = e.tt;
        cb.dataTime = e.dt;
        callback();
      }
    },
    error: function(a, t, e) {
      showMsgFalse('<p>Fehler</p>');
      console.log(a, t, e);
    }
  });
}

cb.init = function(callback) {
  callback = callback || function() {};

  this.uploadmanager.onUploadProgress = cb.onUploadProgress;
  this.uploadmanager.onUploadFinish = cb.onUploadFinish;
  this.uploadmanager.onUploadError = cb.onUploadError;

  $.ajax({
    async: "false",
    type: "POST",
    url: "ajax.php",
    dataType: "json",
    data: {
      a: "init",
    },
    success: function(e) {
      if (e.r == 1) {
        cb.text = e.t;
        cb.data = e.d;
        cb.textTime = e.tt;
        cb.dataTime = e.dt;
      } else {
        showMsgFalse('<p>Datei konnten leider nicht geladen werden.</p>');
      }
      callback();
    },
    error: function(a, t, e) {
      showMsgFalse('<p>Fehler</p>');
      console.log(a, t, e);
      callback();
    }
  });
}

cb.addText = function(text) {
  var id = Math.floor((Math.random() * 100000) + 1);
  var found = false;
  do {
    for (var i = 0; i < this.text.length; i++) {
      if (this.text[i].id == id) {
        found = true;
        id = Math.floor((Math.random() * 100000) + 1);
      }
    }
  }
  while (found);

  $.ajax({
    async: "false",
    type: "POST",
    url: "ajax.php",
    dataType: "json",
    data: {
      a: "addText",
      id: id,
      text: text
    },
    success: function(e) {
      if (e.r == 1) {
        cb.textTime = e.tt;
      } else {
        showMsgFalse('<p>Beim erstellen des Textes ist leider ein Fehler aufgetreten</p>');
      }
    },
    error: function(a, t, e) {
      showMsgFalse('<p>Fehler</p>');
      console.log(a, t, e);
    }
  });

  var d = new Date();
  var day = d.getDate();
  var month = d.getMonth()+1;
  var year = d.getFullYear();

  if(day.toString().length == 1){
    day = "0" + day;
  }
  if(month.toString().length == 1){
    month = "0" + month;
  }
  var obj = {
    id: id,
    text: text,
    name: "",
    date: day+"."+month+"."+year,
    timestamp: Math.round(d.getTime()/1000)
  };

  this.text.push(obj);
  return obj;
};


cb.editText = function(id, text) {
  $.ajax({
    async: "false",
    type: "POST",
    url: "ajax.php",
    dataType: "json",
    data: {
      a: "editText",
      id: id,
      text: text
    },
    success: function(e) {
      if (e.r == 1) {
        cb.textTime = e.tt;
      } else {
        showMsgFalse('<p>Beim ändern des Textes ist leider ein Fehler aufgetreten</p>');
      }
    },
    error: function(a, t, e) {
      showMsgFalse('<p>Fehler</p>');
      console.log(a, t, e);
    }
  });

  if (this.text[id]) {
    this.text[id] = text;
    return true;
  }

  return false;
};

cb.delText = function(id) {
  $.ajax({
    async: "false",
    type: "POST",
    url: "ajax.php",
    dataType: "json",
    data: {
      a: "delText",
      id: id,
    },
    success: function(e) {
      if (e.r == 1) {
        cb.textTime = e.tt;
      } else {
        showMsgFalse('<p>Beim löschen des Textes ist leider ein Fehler aufgetreten</p>');
      }
    },
    error: function(a, t, e) {
      showMsgFalse('<p>Fehler</p>');
      console.log(a, t, e);
    }
  });

  for (var i = 0; i < this.text.length; i++) {
    if (this.text[i].id == id) {
      this.text.splice(i, 1);
      return true;
    }
  }

  return false;
}

cb.addFile = function(data) {

}

cb.delFile = function(name) {
  $.ajax({
    async: "false",
    type: "POST",
    url: "ajax.php",
    dataType: "json",
    data: {
      a: "delFile",
      n: name,
    },
    success: function(e) {
      if (e.r == 1) {
        cb.textTime = e.tt;
      } else {
        showMsgFalse('<p>Beim löschen der Datei ist leider ein Fehler aufgetreten</p>');
      }
    },
    error: function(a, t, e) {
      showMsgFalse('<p>Fehler</p>');
      console.log(a, t, e);
    }
  });

  for (var i = 0; i < this.data.length; i++) {
    if (this.data[i] == name) {
      this.data.splice(i, 1);
      return true;
    }
  }

  return false;
}
