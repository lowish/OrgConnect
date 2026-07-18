# Connect With Students — Google Sheet → Website

This folder holds the Google Apps Script that turns your Google Form responses
into a JSON API the OrgConnect site reads. Once deployed, **every new form
submission appears on the site after a page refresh — no manual editing.**

```
Google Form  →  Google Sheet (responses)  →  Apps Script Web App (/exec, JSON)  →  OrgConnect website
```

- **Form:** https://forms.gle/rB4Uid1sAvmaQR98A
- **Sheet:** https://docs.google.com/spreadsheets/d/1E_KeDEGcSPXRNxwApXSAZVs8CjctWix-Qv9xNdvd_-k/edit

---

## 1. Add the script to your Sheet

1. Open the responses **Google Sheet** (link above).
2. Menu → **Extensions → Apps Script**. A new editor tab opens.
3. Delete whatever is in `Code.gs`, then paste the entire contents of
   [`Code.gs`](./Code.gs) from this folder.
4. Click **Save** (💾).

> The script reads the **first sheet** by default. If your responses live on a
> differently-named tab, set `SHEET_NAME = "Form Responses 1";` at the top.

## 2. Deploy as a Web App

1. In the Apps Script editor, click **Deploy → New deployment**.
2. Click the ⚙️ gear next to "Select type" → choose **Web app**.
3. Fill in:
   - **Description:** `OrgConnect students API` (anything)
   - **Execute as:** **Me** (your account — so it can read the sheet)
   - **Who has access:** **Anyone**  ← required, so the website can fetch it
4. Click **Deploy**. Approve the permission prompt the first time
   (choose your account → *Advanced* → *Go to project (unsafe)* → *Allow*).
   This is Google warning you about your **own** script; it's expected.
5. Copy the **Web app URL**. It ends in `/exec`, e.g.
   `https://script.google.com/macros/s/AKfy…AbCd/exec`

**Test it:** paste that URL into a browser. You should see JSON like:

```json
{ "students": [ { "id": "student-...", "name": "Jane Cruz", ... } ], "count": 1 }
```

> **Re-deploying after editing the script:** use **Deploy → Manage deployments →**
> ✏️ edit → **Version: New version → Deploy**. The `/exec` URL stays the same.

## 3. Connect it to the website

In the project root, create a file named **`.env.local`** (copy `.env.example`)
and paste your URL:

```bash
VITE_STUDENTS_ENDPOINT=https://script.google.com/macros/s/AKfy…AbCd/exec
```

Restart the dev server (`npm run dev`). The **Connect With Students** section now
renders live data from your sheet. Until this variable is set, the section shows
built-in sample profiles so the layout is always visible.

---

## Form fields → card fields

The script matches columns by keyword, so exact wording is flexible. Recommended
form questions:

| Form question (column)      | Shows on card as        | Notes                                    |
| --------------------------- | ----------------------- | ---------------------------------------- |
| Profile Photo               | Circular avatar         | File upload **or** a pasted image URL     |
| Full Name                   | Name                    | Required — rows with no name are skipped |
| Course                      | Course                  |                                          |
| Year Level                  | Year                    |                                          |
| Organization                | Org chip                | Optional                                 |
| Short Introduction          | Intro quote             |                                          |
| Interests                   | Tags                    | Comma / newline separated                |
| Looking For                 | Tags                    | Comma / newline separated                |
| GitHub                      | GitHub icon link        | Handle or full URL                       |
| LinkedIn                    | LinkedIn icon link      | Handle or full URL                       |
| Portfolio                   | Globe icon link         | Optional                                 |
| Facebook                    | Facebook icon link      | Optional                                 |

### Profile photos (now automatic — works on school accounts)

If **Profile Photo** is a Form *file-upload* question, Google stores the file in
your Drive **privately**, and many school/Workspace accounts block making files
"anyone with the link" — so linking to the file just shows a Google sign-in page.

To avoid that entirely, the script **reads the photo itself, as the sheet owner,
and embeds it directly in the JSON** (a base64 data URI, using a small resized
copy). No public sharing is needed, so photos display even on locked-down
accounts. Students who paste a plain public image URL instead of uploading also
work. If a photo can't be read, the card falls back to the student's initials.

Because it now reads files and makes an authenticated request, the script needs
the **Drive** and **external request** permissions. **When you re-deploy after
this change, Google will ask you to authorize again — approve it** (your account
→ *Advanced* → *Go to project (unsafe)* → *Allow*).

### Optional: consent column

Add a checkbox question containing the word "consent"/"display"/"publish" if you
want an explicit opt-in. A row is hidden only when that box is left **unchecked**.
With no such column, every submitted row is shown (submitting the form is the
opt-in).
