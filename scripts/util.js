var U = {
  toast: function(message) {
    var toastContainer = $('#info-toast');
    toastContainer.html(message);
    toastContainer.removeClass('hidden');
    console.log(message);

    setTimeout(function() {
      toastContainer.addClass('hidden');
    }, 2000);
  },

  lstore: function(key, value) {
    return localStorage.setItem(key, value);
  },

  lget: function(key) {
    return localStorage.getItem(key);
  },

  isImage: function(fileName) {
    return !!(fileName.match(/png|jpg|jpeg|gif/i));
  },

  makeVisible: function(currentClass) {
    $("div[class^='step-']").addClass('hidden');
    $(currentClass).removeClass('hidden');
  },

  loadImage: function(path) {
    var fullPath = U.fullPath(path);
    U.toast("loading image: " + fullPath);
    $("#img-holder").attr("src", "file://" + fullPath);
  },

  fullPath: function(path) {
    var directory = U.lget('directory');
    return fullPath = directory + '/' +  path;
  },

  setImageSelection: function(imageName, value) {
    var json = JSON.parse(U.lget('imageDict'));
    json[imageName] = value;
    U.lstore('imageDict', JSON.stringify(json));
  }
}
