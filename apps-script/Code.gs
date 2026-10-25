/**
 * Blue Whale enquiries → Leads sheet + email notification.
 *
 * Runs as a Google Apps Script web app on Nic's Google account, bound to the
 * "Blue Whale Leads" spreadsheet. The site's Pages Function (functions/api/enquiry.ts)
 * POSTs each enquiry here after checking Turnstile and validating the fields.
 *
 * Setup is in docs/enquiries.md. Script properties (Project settings → Script properties):
 *   TOKEN         long random string, the same value as APPS_SCRIPT_TOKEN in Cloudflare
 *   NOTIFY_EMAIL  where notifications go (comma-separate for several)
 */

var SHEET_NAME = 'Leads';

// Column order in the sheet. New columns go on the end so old rows stay aligned.
// "Status" and "Notes" are for Nic; the script never writes to them.
var COLUMNS = [
  ['receivedAt', 'Received'],
  ['name', 'Name'],
  ['email', 'Email'],
  ['phone', 'Phone'],
  ['organisation', 'Organisation'],
  ['interest', 'Area of interest'],
  ['offer', 'Offer page'],
  ['message', 'Message'],
  ['utmSource', 'UTM source'],
  ['utmMedium', 'UTM medium'],
  ['utmCampaign', 'UTM campaign'],
  ['utmContent', 'UTM content'],
  ['country', 'Country'],
  [null, 'Status'],
  [null, 'Notes'],
];

function doPost(e) {
  try {
    var body = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    var props = PropertiesService.getScriptProperties();
    var token = props.getProperty('TOKEN');
    if (!token || body.token !== token) return reply({ ok: false, error: 'unauthorised' });

    var enquiry = body.enquiry || {};
    if (!enquiry.email || !enquiry.name) return reply({ ok: false, error: 'missing fields' });

    appendRow(enquiry);
    notify(enquiry, props.getProperty('NOTIFY_EMAIL'));
    return reply({ ok: true });
  } catch (err) {
    console.error(err);
    return reply({ ok: false, error: String(err) });
  }
}

/** Visiting the URL in a browser shows this, which is a quick check it's deployed. */
function doGet() {
  return reply({ ok: true, service: 'blue-whale-enquiries' });
}

function appendRow(enquiry) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var sheet = getSheet();
    var row = COLUMNS.map(function (c) {
      if (!c[0]) return '';
      var v = enquiry[c[0]] == null ? '' : String(enquiry[c[0]]);
      if (c[0] === 'receivedAt' && v) return new Date(v);
      // Stop a value starting with = + - @ being run as a spreadsheet formula.
      return /^[=+\-@]/.test(v) ? "'" + v : v;
    });
    sheet.appendRow(row);
  } finally {
    lock.releaseLock();
  }
}

function getSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(COLUMNS.map(function (c) { return c[1]; }));
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, COLUMNS.length).setFontWeight('bold');
    sheet.getRange('A:A').setNumberFormat('d mmm yyyy, h:mm am/pm');
    sheet.setColumnWidth(8, 420);
  }
  return sheet;
}

function notify(enquiry, to) {
  if (!to) return;
  var lines = [
    'New enquiry from the Blue Whale website',
    '',
    'Name: ' + enquiry.name,
    'Email: ' + enquiry.email,
    enquiry.phone ? 'Phone: ' + enquiry.phone : null,
    enquiry.organisation ? 'Organisation: ' + enquiry.organisation : null,
    'Area of interest: ' + enquiry.interest,
    enquiry.offer ? 'From the offer page: /services/' + enquiry.offer : null,
    enquiry.utmMedium === 'qr' ? 'Came from QR code: ' + (enquiry.utmContent || 'unknown sticker') : null,
    '',
    enquiry.message,
    '',
    '—',
    'Reply to this email to answer ' + enquiry.name + ' directly.',
    'All enquiries: ' + SpreadsheetApp.getActiveSpreadsheet().getUrl(),
  ].filter(function (l) { return l !== null; });

  MailApp.sendEmail({
    to: to,
    replyTo: enquiry.email,
    name: 'Blue Whale website',
    subject: 'New enquiry: ' + enquiry.name + ' — ' + enquiry.interest,
    body: lines.join('\n'),
  });
}

function reply(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/** Run once from the editor to create the header row and approve permissions. */
function setup() {
  getSheet();
  var props = PropertiesService.getScriptProperties();
  if (!props.getProperty('TOKEN')) throw new Error('Set the TOKEN script property first (see docs/enquiries.md).');
  if (!props.getProperty('NOTIFY_EMAIL')) throw new Error('Set the NOTIFY_EMAIL script property first.');
  console.log('Ready. Sheet: ' + SpreadsheetApp.getActiveSpreadsheet().getUrl());
}
