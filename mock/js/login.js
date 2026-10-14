// ログイン画面（login.html）
// ログイン済みでもフォームを表示する（自動で一覧へ移らない）。
(function () {
  'use strict';

  var form = document.getElementById('login-form');
  var idInput = document.getElementById('login-id');
  var passwordInput = document.getElementById('login-password');
  var errorEl = document.getElementById('login-error');

  function showError(message) {
    errorEl.textContent = message;
    errorEl.hidden = false;
  }

  function clearError() {
    errorEl.textContent = '';
    errorEl.hidden = true;
  }

  // ボタンのクリック・Enter キーのどちらでも submit で処理する
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    clearError();
    if (window.DemoAuth.login(idInput.value, passwordInput.value)) {
      window.location.href = 'list.html';
    } else {
      showError('IDまたはパスワードが正しくありません');
    }
  });
})();
