const SPREADSHEET_ID = import.meta.env.VITE_SPREADSHEET_ID;
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const DRIVE_FOLDER_ID = import.meta.env.VITE_MAIN_DRIVE_FOLDER_ID;
const APPS_SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL;

// A1. Kusoma Orodha ya Watumiaji kutoka Google Sheet
export const fetchUsersFromSheet = async () => {
  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/Access_Control_List!A2:F?key=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (!data.values) return [];
    
    return data.values.map((row) => ({
      email: row[0],
      name: row[1],
      requestedTime: row[2],
      status: row[3],
      lastSeen: row[4],
      role: row[5],
    }));
  } catch (error) {
    console.error("Kosa la kusoma watumiaji:", error);
    return [];
  }
};

// A2. Kuandika/Kusajili Mtumiaji Mpya kupitia Google Apps Script
export const registerUser = async (email, name) => {
  try {
    const response = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify({
        action: "REGISTER",
        email: email,
        name: name
      }),
    });
    return await response.json();
  } catch (error) {
    console.error("Kosa la kusajili mtumiaji:", error);
  }
};

// A3. Kubadilisha Status ya Mtumiaji (kwa Mfano Admin ku-Approve)
export const updateUserStatus = async (email, newStatus) => {
  try {
    const response = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify({
        action: "CHANGE_STATUS",
        email: email,
        newStatus: newStatus
      }),
    });
    return await response.json();
  } catch (error) {
    console.error("Kosa la kubadilisha status:", error);
  }
};

// B. Kusoma Mafaili kutoka Google Drive Folder
export const fetchDriveFiles = async (folderId) => {
  try {
    const targetFolder = folderId || DRIVE_FOLDER_ID;
    const query = `'${targetFolder}' in parents and trashed = false`;
    const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=files(id,name,mimeType,webViewLink,webContentLink)&key=${API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();
    return data.files || [];
  } catch (error) {
    console.error("Kosa la kusoma mafaili ya Drive:", error);
    return [];
  }
};