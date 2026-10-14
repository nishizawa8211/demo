// 申込管理システム（デモ）用の簡易サーバー
// 起動：リポジトリのルートで `node mock/server.js`（http://localhost:8080）
// Node 標準モジュールのみ使用（npm install 不要）
'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const ROOT = __dirname; // mock/
const DATA_DIR = path.join(ROOT, 'data');
const DATA_FILE = path.join(DATA_DIR, 'dummy.json');       // 現在のデータ（追加分もここに保存）
const INITIAL_FILE = path.join(DATA_DIR, 'initial.json');  // 初期20件（リセット用・変更しない）
const CANDIDATES_FILE = path.join(DATA_DIR, 'candidates.json'); // 追加候補（順番に使う）

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function writeData(data) {
  const tmp = DATA_FILE + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2) + '\n', 'utf8');
  fs.renameSync(tmp, DATA_FILE);
}

function loadApplications() {
  if (!fs.existsSync(DATA_FILE)) {
    writeData(readJson(INITIAL_FILE));
  }
  return readJson(DATA_FILE).applications || [];
}

// 申込番号の降順（DM-YYYY-NNNN は固定長なので文字列比較で並ぶ）
function sortDesc(apps) {
  return apps.slice().sort((a, b) => (a.applicationNo < b.applicationNo ? 1 : a.applicationNo > b.applicationNo ? -1 : 0));
}

function formatDate(d) {
  return d.getFullYear() + '/' + String(d.getMonth() + 1).padStart(2, '0') + '/' + String(d.getDate()).padStart(2, '0');
}

function nextApplicationNo(apps) {
  let maxYear = '2026';
  let maxSeq = 0;
  let maxNo = '';
  for (const a of apps) {
    const m = /^DM-(\d{4})-(\d{4})$/.exec(a.applicationNo);
    if (m && a.applicationNo > maxNo) {
      maxNo = a.applicationNo;
      maxYear = m[1];
      maxSeq = Number(m[2]);
    }
  }
  return 'DM-' + maxYear + '-' + String(maxSeq + 1).padStart(4, '0');
}

function addApplication() {
  const apps = loadApplications();
  const initialCount = readJson(INITIAL_FILE).applications.length;
  const candidates = readJson(CANDIDATES_FILE).candidates;
  // 初期データからの追加件数で候補を決める（リセット後は必ず先頭の候補から）
  const addedCount = Math.max(0, apps.length - initialCount);
  const c = candidates[addedCount % candidates.length];

  const today = new Date();
  const desired = new Date(today);
  desired.setDate(desired.getDate() + 30);

  const record = {
    applicationNo: nextApplicationNo(apps),
    applicationDate: formatDate(today),
    customerName: c.customerName,
    supplyPointNo: c.supplyPointNo,
    applicationType: c.applicationType,
    capacityBefore: c.capacityBefore,
    capacityAfter: c.capacityAfter,
    status: '受付済',
    assignee: c.assignee,
    siteAddress: c.siteAddress,
    desiredDate: formatDate(desired),
    scheduledWorkDate: '未定',
    receptionNo: '未採番',
    remarks: c.remarks || '',
  };
  apps.push(record);
  writeData({ applications: apps });
  return { added: record, count: apps.length };
}

function resetApplications() {
  const initial = readJson(INITIAL_FILE);
  writeData(initial);
  return { count: initial.applications.length };
}

function sendJson(res, status, obj) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  });
  res.end(JSON.stringify(obj));
}

function serveStatic(req, res, pathname) {
  if (pathname === '/') pathname = '/index.html';
  let decoded;
  try {
    decoded = decodeURIComponent(pathname);
  } catch (e) {
    res.writeHead(400); res.end('Bad Request'); return;
  }
  const filePath = path.normalize(path.join(ROOT, decoded));
  if (!filePath.startsWith(ROOT + path.sep)) {
    res.writeHead(403); res.end('Forbidden'); return;
  }
  fs.stat(filePath, (err, st) => {
    if (err || !st.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not Found');
      return;
    }
    res.writeHead(200, {
      'Content-Type': MIME[path.extname(filePath).toLowerCase()] || 'application/octet-stream',
      'Cache-Control': 'no-store',
    });
    fs.createReadStream(filePath).pipe(res);
  });
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  const p = url.pathname;
  try {
    if (p === '/api/applications' && req.method === 'GET') {
      const apps = sortDesc(loadApplications());
      return sendJson(res, 200, { count: apps.length, applications: apps });
    }
    if (p === '/api/demo/add' && req.method === 'POST') {
      return sendJson(res, 200, addApplication());
    }
    if (p === '/api/demo/reset' && req.method === 'POST') {
      return sendJson(res, 200, resetApplications());
    }
    if (p === '/favicon.ico') {
      // アイコンは用意しない（404 をブラウザのコンソールエラーにしないため）
      res.writeHead(204, { 'Cache-Control': 'no-store' });
      res.end();
      return;
    }
    if (p.startsWith('/api/')) {
      return sendJson(res, 404, { error: 'not found' });
    }
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      res.writeHead(405); res.end('Method Not Allowed'); return;
    }
    return serveStatic(req, res, p);
  } catch (e) {
    console.error(e);
    return sendJson(res, 500, { error: 'server error' });
  }
});

server.listen(PORT, () => {
  console.log('申込管理システム（デモ）: http://localhost:' + PORT + '/list.html');
});
