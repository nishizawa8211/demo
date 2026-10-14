// 申込管理システム（デモ） 共通処理：ダミー認証・ログイン中表示・ログアウト
// ログイン状態は sessionStorage に保持する（ブラウザのタブ単位。タブを閉じると解除）。
// 各画面の <head> で css の後に読み込む。
// ログインが必要な画面は <html data-auth="required"> を付ける。
(function () {
  'use strict';

  var STORAGE_KEY = 'demoAppLoginUser';
  // デモ用のダミー認証情報（実在の認証情報ではない）
  var DEMO_ID = 'demo-user';
  var DEMO_PASSWORD = 'demo-pass';

  function getUser() {
    try {
      return window.sessionStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function setUser(user) {
    try {
      window.sessionStorage.setItem(STORAGE_KEY, user);
      return true;
    } catch (e) {
      return false;
    }
  }

  function clearUser() {
    try {
      window.sessionStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      // 何もしない
    }
  }

  function isLoggedIn() {
    return getUser() === DEMO_ID;
  }

  // ID/PW を確認し、一致すればログイン状態にする
  function login(id, password) {
    if (id === DEMO_ID && password === DEMO_PASSWORD) {
      return setUser(DEMO_ID);
    }
    return false;
  }

  function goLogin() {
    window.location.replace('login.html');
  }

  function logout() {
    clearUser();
    goLogin();
  }

  var root = document.documentElement;
  var authRequired = root.getAttribute('data-auth') === 'required';

  // 未ログインのガード：画面を描画する前にログイン画面へ移る（一瞬の表示を防ぐため本文は隠す）
  if (authRequired && !isLoggedIn()) {
    root.classList.add('auth-redirect');
    goLogin();
  }

  // 戻るボタンでキャッシュから表示された場合もガードする
  window.addEventListener('pageshow', function (e) {
    if (authRequired && e.persisted && !isLoggedIn()) {
      root.classList.add('auth-redirect');
      goLogin();
    }
  });

  // ヘッダーのログイン中表示・ログアウトボタン
  document.addEventListener('DOMContentLoaded', function () {
    var currentUser = document.getElementById('current-user');
    if (currentUser && isLoggedIn()) {
      currentUser.textContent = getUser() + ' でログイン中';
    }
    var logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
      logoutButton.addEventListener('click', logout);
    }
  });

  window.DemoAuth = {
    isLoggedIn: isLoggedIn,
    login: login,
    logout: logout
  };
})();
