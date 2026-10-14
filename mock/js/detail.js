// 申込詳細画面（detail.html?no=<申込番号>）
(function () {
  'use strict';

  var backButton = document.getElementById('back-to-list-button');
  backButton.addEventListener('click', function () {
    window.location.href = 'list.html';
  });

  // 未ログインの場合は app.js がログイン画面へ移すので、詳細の読み込みは行わない
  if (!window.DemoAuth || !window.DemoAuth.isLoggedIn()) return;

  // 詳細に表示する項目（docs/screens.md 1-2 の順）
  var DETAIL_FIELDS = [
    'applicationNo',
    'applicationDate',
    'customerName',
    'supplyPointNo',
    'applicationType',
    'capacityBefore',
    'capacityAfter',
    'status',
    'assignee',
    'siteAddress',
    'desiredDate',
    'scheduledWorkDate',
    'receptionNo',
    'remarks'
  ];

  var NOT_FOUND_MESSAGE = '該当する申込が見つかりません';
  var LOAD_ERROR_MESSAGE = 'データを読み込めませんでした';

  var detail = document.getElementById('application-detail');
  var title = document.getElementById('detail-title');
  var errorEl = document.getElementById('detail-error');

  function getRequestedNo() {
    try {
      return new URLSearchParams(window.location.search).get('no') || '';
    } catch (e) {
      return '';
    }
  }

  function clearValues() {
    DETAIL_FIELDS.forEach(function (key) {
      var el = document.getElementById('field-' + key);
      if (el) el.textContent = '';
    });
  }

  // エラー表示：値は出さず、data-loaded も付けない
  function showError(message) {
    detail.removeAttribute('data-loaded');
    clearValues();
    detail.hidden = true;
    title.textContent = '申込詳細';
    errorEl.textContent = message;
    errorEl.hidden = false;
  }

  function render(app) {
    DETAIL_FIELDS.forEach(function (key) {
      var el = document.getElementById('field-' + key);
      if (el) el.textContent = app[key] == null ? '' : String(app[key]);
    });
    title.textContent = '申込詳細（' + app.applicationNo + '）';
    errorEl.textContent = '';
    errorEl.hidden = true;
    detail.hidden = false;
  }

  function loadDetail() {
    detail.removeAttribute('data-loaded');
    var no = getRequestedNo();
    if (!no) {
      showError(NOT_FOUND_MESSAGE);
      return Promise.resolve();
    }
    return fetch('/api/applications', { cache: 'no-store' })
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function (data) {
        var apps = data.applications || [];
        var app = null;
        for (var i = 0; i < apps.length; i++) {
          if (apps[i].applicationNo === no) { app = apps[i]; break; }
        }
        if (!app) {
          showError(NOT_FOUND_MESSAGE);
          return;
        }
        render(app);
        // 14項目を表示し終えてから完了の目印を付ける
        detail.setAttribute('data-loaded', 'true');
      })
      .catch(function () {
        showError(LOAD_ERROR_MESSAGE);
      });
  }

  // 戻る／進むでキャッシュから表示された場合も最新のデータで表示し直す
  window.addEventListener('pageshow', function (e) {
    if (e.persisted && window.DemoAuth.isLoggedIn()) loadDetail();
  });

  loadDetail();
})();
