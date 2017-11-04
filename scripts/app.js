console.log('from apps.js');

var toast = function(message) {
  var toastContainer = $('#info-toast');
  toastContainer.html(message);
  toastContainer.removeClass('hidden');
  console.log(message);

  setTimeout(function() {
    toastContainer.addClass('hidden');
  }, 2000);
};

var selectDirectory = function(callback) {
  dialog.showOpenDialog({
    title:"Select a folder",
    properties: ["openDirectory"]
  }, (folderPaths) => {
    callback(folderPaths);
  });
}

var makeVisible = function(currentClass) {
  $("div[class^='step-']").addClass('hidden');
  $(currentClass).removeClass('hidden');
};

$(".select-directory").on('click', function() {
  selectDirectory(function(folderPaths) {
    // folderPaths is an array that contains all the selected paths
    if(folderPaths === undefined){
      toast("No image folder selected");
    }else{
      toast("Selected Folder: " + folderPaths[0]);
      $('#selected-directory').html(folderPaths[0]);
      makeVisible('.step-2');
    }
  });
});
