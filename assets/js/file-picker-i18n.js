/* Localized native-file-input presentation. File selection and drop handlers remain unchanged. */
(function () {
  function init() {
    document.querySelectorAll('.file-drop input[type="file"]').forEach(function (input) {
      var status = input.parentElement.querySelector('.file-picker-status');
      if (!status) return;
      function update() {
        var files = input.files;
        var n = files ? files.length : 0;
        status.textContent = n ? (n === 1 ? files[0].name : status.dataset.count.replace('{n}', String(n))) : status.dataset.empty;
      }
      input.addEventListener('change', update);
      update();
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
