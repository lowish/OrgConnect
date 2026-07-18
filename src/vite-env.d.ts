/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * URL of the deployed Google Apps Script Web App (ends in /exec) that returns
   * student profiles as JSON. See google-apps-script/README.md. When unset, the
   * "Connect With Students" section shows built-in sample profiles.
   */
  readonly VITE_STUDENTS_ENDPOINT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
