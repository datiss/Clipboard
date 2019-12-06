<!DOCTYPE html>
<html>


<meta http-equiv="content-language" content="de">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1 ,maximum-scale=1">
<link rel="icon" sizes="96x96" href="img/logo.jpg">



<script src="vendor/jquery/jquery.min.js"></script>
<script src="vendor/jquery/jquery-ui.min.js"></script>
<script src="vendor/bootstrap/bootstrap.min.js"></script>
<script src="vendor/ace/ace.js"></script>
<script src="vendor/husky-um/upload.js"></script>
<script src="js/main.js"></script>

<title>EZ Clipboard</title>

<body>

<div id="clipboard_wrapper">
  <header id="header">
    <h1>EZ Clipboard</h1>
    <button id="toggle-nav" class="btn btn-sm btn-secondary"><i class="fa fa-bars fa-2x"></i></button>
    <div id="logo">
      <a target="_blank" href="https://datiss.it"><img src="img/datiss.png" alt="Datiss.it Logo" /></a>
    </div>
  </header>

  <main id="main">
    <nav id="nav">
      <ul class="nav nav-tabs nav-justified" role="tablist">
        <li class="nav-item">
          <a class="nav-link active" id="clipboard-tab" data-toggle="tab" href="#clipboard-tab-content" role="tab" aria-controls="clipboard-tab-content" aria-selected="true"><i class="fa fa-clipboard"></i> Clipboard</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" id="files-tab" data-toggle="tab" href="#files-tab-content" role="tab" aria-controls="files-tab-content" aria-selected="false"><i class="fa fa-file"></i> Files</a>
        </li>
      </ul>

      <div class="tab-content d-flex flex-column" id="nav-content">
        <div class="tab-pane fade flex-column show active" id="clipboard-tab-content" role="tabpanel" aria-labelledby="clipboard-tab">
          <div class="cp-list d-flex flex-column">
            <ul class="cp-text list-group list-group-flush">
            </ul>
            <div class="cp-action d-flex">
              <button class="btn btn-sm btn-primary cp-add-text"><i class="fa fa-plus fa-fw"></i> Add</button>
              <button class="btn btn-sm btn-secondary cp-copy-text"><i class="fa fa-clipboard fa-fw"></i> Copy</button>
            </div>
          </div>
        </div>
        <div class="tab-pane fade flex-column" id="files-tab-content" role="tabpanel" aria-labelledby="files-tab">

          <div class="cp-list d-flex flex-column">
            <ul class="cp-files list-group list-group-flush">
            </ul>
            <ul class="cp-files-upload list-group list-group-flush">
            </ul>
            <div class="cp-action d-flex">
              <button class="btn btn-sm btn-primary cp-add-file"><i class="fa fa-upload fa-fw"></i> Upload</button>
            </div>
          </div>
        </div>
      </div>
    </nav>


    <article id="article">
      <div class="cp-content">

      </div>
    </article>

  </main>



  <input id="cp-fileupload-input" type="file" multiple>
</div>


<link rel="stylesheet" href="vendor/bootstrap/bootstrap.min.css">
<link rel="stylesheet" href="vendor/fontawesome/css/fontawesome.min.css" />
<link rel="stylesheet" href="css/main.css">

</body>
</html>
