/**
 * OrgConnect — "Connect With Students" data endpoint.
 *
 * Publishes this spreadsheet's Google Form responses as JSON so the OrgConnect
 * website can render a live student directory. Deploy it as a Web App (see
 * README.md) and point the site's VITE_STUDENTS_ENDPOINT at the /exec URL.
 *
 * What it does automatically (no manual editing):
 *  - Finds the response tab wherever it lives (robust to Forms adding tabs).
 *  - Reads each Form file-upload photo as the sheet owner and embeds it in the
 *    JSON as a base64 data URI, so photos display even when the account/domain
 *    blocks public "anyone with the link" sharing (common on school accounts).
 *
 * It only ever reads response rows and photo files; it never edits the sheet.
 * New submissions show up on the next request.
 */

/**
 * Which response tab to read.
 *
 * RESPONSE_SHEET_GID pins one tab by the gid in its URL
 * (docs.google.com/…#gid=THIS_NUMBER). Set it when the spreadsheet has more than
 * one response tab (e.g. an old form's tab plus the current one) so the endpoint
 * always reads the right one. SHEET_NAME does the same by tab name. Leave both
 * null to auto-detect (first tab with a Timestamp/Name header).
 */
var SHEET_NAME = null;
var RESPONSE_SHEET_GID = null; // auto-detect the response tab; set to a gid to pin one

/** GET handler — returns { students: [...], count: N } as JSON. */
function doGet() {
  var students = getStudents();
  var payload = JSON.stringify({ students: students, count: students.length });
  return ContentService
    .createTextOutput(payload)
    .setMimeType(ContentService.MimeType.JSON);
}

/** Read every response row and shape it into a plain student object. */
function getStudents() {
  var sheet = findResponseSheet();
  if (!sheet) return [];

  var range = sheet.getDataRange();
  var values = range.getValues();
  // Display values render a Form file-upload cell as its visible Drive URL text.
  // getValues() can return an inconsistent value for file-upload columns, so we
  // read the "Upload your profile" cell from here instead.
  var display = range.getDisplayValues();
  if (values.length < 2) return []; // header row only, or empty sheet

  // Map each column to a stable key by matching keywords in its header, so the
  // script keeps working even if the form questions are reworded slightly.
  var keys = values[0].map(function (header) {
    return headerToKey(normalizeHeader(header));
  });

  var students = [];
  for (var r = 1; r < values.length; r++) {
    var row = values[r];
    if (isBlankRow(row)) continue;

    var student = { id: 'student-' + r };
    for (var c = 0; c < keys.length; c++) {
      var key = keys[c];
      if (!key) continue;

      // Photo: read the upload cell from display values (the visible Drive URL),
      // falling back to the raw value, then embed it as a Base64 data URI. This
      // is handled before the generic blank-skip below so it is never dropped.
      if (key === 'photoUrl') {
        var photoCell = display[r][c] || row[c];
        if (photoCell === '' || photoCell === null || photoCell === undefined) continue;
        var photo = toPhotoDataUri(photoCell);
        if (photo) student.photoUrl = photo;
        continue;
      }

      var cell = row[c];
      if (cell === '' || cell === null || cell === undefined) continue;
      student[key] = (cell instanceof Date) ? cell.toISOString() : cell;
    }

    // A timestamp makes a more stable id than the row number (which shifts when
    // earlier rows are deleted).
    if (student.timestamp) student.id = 'student-' + String(student.timestamp);
    students.push(student);
  }
  return students;
}

/**
 * Locate the tab that actually holds form responses. Prefers a tab whose header
 * row has a Timestamp or Name column; falls back to the first tab. This keeps
 * the endpoint working even after Google Forms adds or reorders sheets.
 */
function findResponseSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (SHEET_NAME) return ss.getSheetByName(SHEET_NAME);

  var sheets = ss.getSheets();

  // Pin by gid when set (matches the #gid=... in the sheet URL).
  if (RESPONSE_SHEET_GID !== null) {
    for (var g = 0; g < sheets.length; g++) {
      if (sheets[g].getSheetId() === RESPONSE_SHEET_GID) return sheets[g];
    }
  }

  // Otherwise auto-detect: first tab with a Timestamp/Name header row.
  for (var i = 0; i < sheets.length; i++) {
    var lastCol = sheets[i].getLastColumn();
    if (lastCol < 1) continue;
    var header = sheets[i].getRange(1, 1, 1, lastCol).getValues()[0];
    var looksLikeResponses = header.some(function (h) {
      var key = headerToKey(normalizeHeader(h));
      return key === 'timestamp' || key === 'name';
    });
    if (looksLikeResponses) return sheets[i];
  }
  return sheets[0] || null;
}

/** Lowercase a header and strip everything but a-z/0-9 for fuzzy matching. */
function normalizeHeader(header) {
  return String(header).toLowerCase().replace(/[^a-z0-9]/g, '');
}

/** Resolve a normalized header to one of the student fields, or null to skip. */
function headerToKey(h) {
  if (/timestamp/.test(h)) return 'timestamp';
  // "upload"/"profilepic" catch a file-upload question like "Upload your profile".
  if (/(photo|image|picture|avatar|headshot|profilepic|profilephoto|upload)/.test(h)) return 'photoUrl';
  // Check organization before name so "Organization Name" doesn't map to name.
  if (/(organization|organisation|club|society)/.test(h)) return 'organization';
  if (/(fullname|name)/.test(h)) return 'name';
  if (/(course|program|degree)/.test(h)) return 'course';
  if (/year/.test(h)) return 'yearLevel';
  if (/(intro|about|bio|describe|yourself|tagline)/.test(h)) return 'intro';
  if (/(lookingfor|looking|seeking|wantto|collaborat)/.test(h)) return 'lookingFor';
  if (/interest/.test(h)) return 'interests';
  if (/github/.test(h)) return 'github';
  if (/linkedin/.test(h)) return 'linkedin';
  if (/(portfolio|website|personalsite|personalpage)/.test(h)) return 'portfolio';
  if (/(facebook|fb)/.test(h)) return 'facebook';
  if (/(consent|agree|display|permission|publish)/.test(h)) return 'consent';
  return null;
}

/**
 * Turn a Form file-upload answer into a directly embeddable image.
 *
 * A file-upload cell is a Drive link (possibly several, comma-separated). We
 * take the first, extract its Drive file id, and read the image AS THE SHEET
 * OWNER via DriveApp — no public "anyone with the link" sharing required, so it
 * works on locked-down school / Workspace accounts. The result is a Base64 data
 * URI, e.g. "data:image/jpeg;base64,..." or "data:image/png;base64,...".
 *
 * We prefer Drive's own thumbnail to keep the JSON payload small, and fall back
 * to the full-resolution file when no thumbnail exists. A plain pasted image URL
 * passes through unchanged; an unreadable file yields '' (card shows initials).
 */
function toPhotoDataUri(value) {
  var raw = String(value).split(/[,\s]+/).filter(function (s) { return s; })[0];
  if (!raw) return '';

  var id = extractDriveId(raw);
  if (!id) {
    // Not a Drive link — treat it as an already-usable image URL.
    return /^https?:\/\//i.test(raw) ? raw : '';
  }

  // Read the uploaded file as the sheet owner. DriveApp use here also grants the
  // Drive scope the script needs to open Form uploads.
  var file;
  try {
    file = DriveApp.getFileById(id);
  } catch (errFile) {
    return ''; // file not found or no access
  }

  // Preferred: Drive's small thumbnail — ample for an avatar, keeps JSON light.
  try {
    var thumb = file.getThumbnail();
    if (thumb) {
      var tType = thumb.getContentType() || 'image/jpeg';
      return 'data:' + tType + ';base64,' + Utilities.base64Encode(thumb.getBytes());
    }
  } catch (errThumb) {
    // fall through to the full-resolution file
  }

  // Fallback: embed the full uploaded image.
  try {
    var blob = file.getBlob();
    var type = blob.getContentType() || 'image/jpeg';
    if (type.indexOf('image/') !== 0) type = 'image/jpeg';
    return 'data:' + type + ';base64,' + Utilities.base64Encode(blob.getBytes());
  } catch (errBlob) {
    return ''; // unreadable → the website falls back to the student's initials
  }
}

/** Pull a Google Drive file id out of any of its share-URL shapes. */
function extractDriveId(url) {
  var patterns = [/\/file\/d\/([\w-]+)/, /[?&]id=([\w-]+)/, /\/d\/([\w-]+)/];
  for (var i = 0; i < patterns.length; i++) {
    var m = url.match(patterns[i]);
    if (m) return m[1];
  }
  return null;
}

/** True when every cell in the row is blank. */
function isBlankRow(row) {
  for (var i = 0; i < row.length; i++) {
    if (String(row[i]).trim() !== '') return false;
  }
  return true;
}

/**
 * DIAGNOSTIC — run this from the editor (select "debugPhoto" ▸ Run), then open
 * "Executions" (or View ▸ Logs) to read the output. It runs the LATEST saved
 * code (not the deployed version), so it tells you the real state of the photo
 * column regardless of what /exec is currently serving. Read-only; logs only.
 */
function debugPhoto() {
  var sheet = findResponseSheet();
  if (!sheet) { Logger.log('NO response sheet found'); return; }
  Logger.log('Sheet: "' + sheet.getName() + '"');

  var range = sheet.getDataRange();
  var values = range.getValues();
  var display = range.getDisplayValues();
  var headers = values[0];

  var photoCol = -1;
  for (var c = 0; c < headers.length; c++) {
    var key = headerToKey(normalizeHeader(headers[c]));
    Logger.log('Col ' + c + ' | header="' + headers[c] + '" -> key=' + key);
    if (key === 'photoUrl') photoCol = c;
  }

  if (photoCol === -1) {
    Logger.log('>>> PROBLEM: no column maps to photoUrl. Tell me the exact header text above.');
    return;
  }
  Logger.log('>>> photoUrl is column index ' + photoCol);

  for (var r = 1; r < values.length; r++) {
    var rawVal = String(values[r][photoCol]);
    var dispVal = String(display[r][photoCol]);
    Logger.log('Row ' + r + ' | getValues="' + rawVal + '" | getDisplayValues="' + dispVal + '"');
    var cell = dispVal || rawVal;
    if (!cell.trim()) { Logger.log('   >>> EMPTY cell — no photo was uploaded on this row.'); continue; }
    var id = extractDriveId(cell);
    Logger.log('   drive id = ' + id);
    if (!id) { Logger.log('   (not a Drive link — will be used as a plain URL)'); continue; }
    try {
      var file = DriveApp.getFileById(id);
      Logger.log('   DriveApp OK: name="' + file.getName() + '", type=' + file.getBlob().getContentType());
      var uri = toPhotoDataUri(cell);
      Logger.log('   toPhotoDataUri -> length=' + uri.length + ', prefix="' + uri.substring(0, 24) + '"');
    } catch (e) {
      Logger.log('   >>> DriveApp ERROR: ' + e);
    }
  }
}
