// 申込一覧画面（list.html）
(function () {
  'use strict';

  // 一覧に表示する項目（列順）
  var LIST_FIELDS = [
    'applicationNo',
    'applicationDate',
    'customerName',
    'supplyPointNo',
    'applicationType',
    'capacityBefore',
    'capacityAfter',
    'status',
    'assignee'
  ];

  var table = document.getElementById('application-table');
  var tbody = document.getElementById('application-tbody');
  var countEl = document.getElementById('application-count');
  var listError = document.getElementById('list-error');

  var addButton = document.getElementById('demo-add-button');
  var resetButton = document.getElementById('demo-reset-button');
  var confirmBox = document.getElementById('demo-reset-confirm');
  var confirmButton = document.getElementById('demo-reset-confirm-button');
  var cancelButton = document.getElementById('demo-reset-cancel-button');
  var demoMessage = document.getElementById('demo-message');

  function sortDesc(apps) {
    return apps.slice().sort(function (a, b) {
      if (a.applicationNo < b.applicationNo) return 1;
      if (a.applicationNo > b.applicationNo) return -1;
      return 0;
    });
  }

  function render(apps) {
    var rows = sortDesc(apps);
    var frag = document.createDocumentFragment();
    rows.forEach(function (app) {
      var tr = document.createElement('tr');
      tr.setAttribute('data-application-no', app.applicationNo);
      LIST_FIELDS.forEach(function (key) {
        var td = document.createElement('td');
        td.setAttribute('data-field', key);
        td.textContent = app[key] == null ? '' : String(app[key]);
        tr.appendChild(td);
      });
      var tdBtn = document.createElement('td');
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.id = 'detail-button-' + app.applicationNo;
      btn.setAttribute('data-action', 'detail');
      btn.setAttribute('data-application-no', app.applicationNo);
      btn.textContent = '詳細';
      tdBtn.appendChild(btn);
      tr.appendChild(tdBtn);
      frag.appendChild(tr);
    });
    tbody.textContent = '';
    tbody.appendChild(frag);
    countEl.textContent = '全 ' + rows.length + ' 件';
    countEl.setAttribute('data-count', String(rows.length));
  }

  // 一覧を読み込み直す。完了後に data-loaded="true" を付ける
  function loadList() {
    table.removeAttribute('data-loaded');
    listError.hidden = true;
    return fetch('/api/applications', { cache: 'no-store' })
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function (data) {
        render(data.applications || []);
        table.setAttribute('data-loaded', 'true');
      })
      .catch(function () {
        listError.hidden = false;
      });
  }

  function postJson(url) {
    return fetch(url, { method: 'POST', cache: 'no-store' }).then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    });
  }

  function setDemoBusy(busy) {
    addButton.disabled = busy;
    resetButton.disabled = busy;
    confirmButton.disabled = busy;
    cancelButton.disabled = busy;
  }

  // 詳細ボタン（遷移先の画面はスプリント03で作成）
  tbody.addEventListener('click', function (e) {
    var btn = e.target.closest('button[data-action="detail"]');
    if (!btn) return;
    var no = btn.getAttribute('data-application-no');
    window.location.href = 'detail.html?no=' + encodeURIComponent(no);
  });

  // デモ操作：新規案件を追加
  addButton.addEventListener('click', function () {
    confirmBox.hidden = true;
    demoMessage.textContent = '';
    setDemoBusy(true);
    postJson('/api/demo/add')
      .then(function (result) {
        return loadList().then(function () {
          demoMessage.textContent = result.added.applicationNo + ' を追加しました';
        });
      })
      .catch(function () {
        demoMessage.textContent = '追加できませんでした';
      })
      .then(function () { setDemoBusy(false); });
  });

  // デモ操作：初期データに戻す（画面内の確認表示）
  resetButton.addEventListener('click', function () {
    demoMessage.textContent = '';
    confirmBox.hidden = false;
  });

  cancelButton.addEventListener('click', function () {
    confirmBox.hidden = true;
  });

  confirmButton.addEventListener('click', function () {
    setDemoBusy(true);
    postJson('/api/demo/reset')
      .then(function () {
        confirmBox.hidden = true;
        return loadList().then(function () {
          demoMessage.textContent = '初期データ（20件）に戻しました';
        });
      })
      .catch(function () {
        demoMessage.textContent = '初期データに戻せませんでした';
      })
      .then(function () { setDemoBusy(false); });
  });

  loadList();
})();
