var selectDirectory = function(callback) {
  dialog.showOpenDialog({
    title:"Select a folder",
    properties: ["openDirectory"]
  }, (folderPaths) => {
    callback(folderPaths);
  });
}

$(".select-directory").on('click', function() {
  var cwd = window.cwd;
  if(cwd) {
    U.toast("Selected Folder: " + cwd);
    $('#selected-directory').html(cwd);
    U.lstore('directory', cwd);
    U.makeVisible('.step-2');
  } else {
    selectDirectory(function(folderPaths) {
      // folderPaths is an array that contains all the selected paths
      if(folderPaths === undefined){
        U.toast("No image folder selected");
      }else{
        U.toast("Selected Folder: " + folderPaths[0]);
        $('#selected-directory').html(folderPaths[0]);
        U.lstore('directory', folderPaths[0]);
        U.makeVisible('.step-2');
      }
    });
  }
});

$('.proceed-to-yes-no').on('click', function() {
  var directory = U.lget('directory');
  U.toast("Proceeding to select images from " +  directory);

  var files = fs.readdirSync(directory);
  var imageFiles = R.filter(U.isImage, files);

  U.lstore('images', imageFiles);

  if(imageFiles.length > 0) {
    U.loadImage(imageFiles[0]);
    initImgJson(imageFiles);
    U.makeVisible('.step-3');
  } else {
    $('#selected-directory').html("No image files present in directory");
    U.toast("No image files present in directory");
  }
});

var initImgJson = function(images) {
  var j = R.reduce(function(acc, value) {
    var valueAtImage = acc[U.fullPath(value)];

    if(valueAtImage) {
      acc[U.fullPath(value)] = valueAtImage;
    } else {
      acc[U.fullPath(value)] = null;
    }

    return acc;
  }, {}, images);

  U.lstore('imageDict', JSON.stringify(j));
}

// efp-select

var reshuffleImageJson = function() {
  var directory = U.lget('directory');
  var files = fs.readdirSync(directory);
  var imageFiles = R.filter(U.isImage, files);

  setTimeout(function() {
    initImgJson(imageFiles);
  }, 0);
}

$('.efp-select').on('click', function() {
  reshuffleImageJson();
  selectAs('normal');
});

$('.efp-deselect').on('click', function() {
  reshuffleImageJson();
  selectAs('abnormal');
});

$('.efp-save-dump').on('click', function(){
  dialog.showSaveDialog((fileName) => {
    if (fileName === undefined){
      U.toast("You didn't save the file");
      return;
    }

    fs.writeFile(fileName, U.lget('imageDict'), (err) => {
      if(err){
        U.toast("An error ocurred creating the file "+ err.message);
      }

      U.toast("The file has been succesfully saved");
    });
  });
});

var findNextNull = function() {
  var imageDict = JSON.parse(U.lget('imageDict'));
  var keys = R.keys(imageDict);

  var nextImage = R.find(function(img) {
    return imageDict[img] == null;
  }, keys);

  return nextImage;
}

var selectAs = function(selectionType) {
  var nImg = findNextNull();
  var pImg = U.lget('cImg');

  if(pImg) {
    U.setImageSelection(pImg, selectionType);
  }

  if(nImg) {
    U.loadImage(nImg);
    U.lstore('cImg', nImg);
  } else {
    U.toast('Viewed All Images');
    U.makeVisible('.step-4');
  }

}

$('.back-once').on('click', function() {
  var currentImage = U.lget('cImg');
  var imageDict = JSON.parse(U.lget('imageDict'));

  var keys = R.keys(imageDict);
  var imgIndex = R.indexOf(currentImage, keys);

  if(imgIndex > 0) {
    var nImg = keys[imgIndex - 1];
    if(nImg) {
      U.makeVisible('.step-3');
      U.loadImage(nImg);
      U.lstore('cImg', nImg);
    } else {
      U.toast('Cannot go back. No image history back this point');
    }
  }
});

$('.reset').on('click', function() {
  U.toast('Starting from beginning');
  setTimeout(function() {
    localStorage.clear();
    window.location.reload();
  }, 2000);
});


$(function(){
  if(fs.existsSync('/tmp/directory')) {
    window.cwd = fs.readFileSync('/tmp/directory', {encoding: 'utf8'});
  }

  var directory = U.lget('directory');
  var imageFilesString = U.lget('images');
  if(imageFilesString) {
    var imageFiles = U.lget('images').split(',');
  }

  if(directory && imageFilesString) {
    var currentImage = U.lget('cImg');
    U.loadImage(currentImage);
    U.makeVisible('.step-3');
  }
});
