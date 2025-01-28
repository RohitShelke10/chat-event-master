import ApiService from "@/services/api";

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY || '';
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';
const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';

let tokenClient: any;
let gapiInited = false;
let gisInited = false;

export const initializeGoogleApi = async () => {
  const gapiLoaded = () => {
    gapi.load('client', async () => {
      await gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: [DISCOVERY_DOC],
      });
      gapiInited = true;
      maybeInitializeToken();
    });
  };

  const gisLoaded = () => {
    tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES,
      callback: '', // Will be set later
    });
    gisInited = true;
    maybeInitializeToken();
  };

  // Load the Google API scripts
  if (typeof gapi !== 'undefined') {
    gapiLoaded();
  }
  if (typeof google !== 'undefined') {
    gisLoaded();
  }

  // Check for existing token
  try {
    const savedToken = await ApiService.getGoogleToken();
    if (savedToken) {
      gapi.client.setToken({ access_token: savedToken });
      return true;
    }
  } catch (error) {
    console.error('Error checking saved token:', error);
  }

  return false;
};

const maybeInitializeToken = () => {
  return gapiInited && gisInited;
};

export const handleAuthClick = async (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (!tokenClient) {
      console.error('Token client not initialized');
      resolve(false);
      return;
    }

    tokenClient.callback = async (resp: any) => {
      if (resp.error !== undefined) {
        console.error(resp);
        resolve(false);
        return;
      }
      
      try {
        // Send token to backend
        const token = gapi.client.getToken().access_token;
        await ApiService.saveGoogleToken(token);
        resolve(true);
      } catch (error) {
        console.error('Failed to save token:', error);
        resolve(false);
      }
    };

    if (gapi.client.getToken() === null) {
      tokenClient.requestAccessToken({ prompt: 'consent' });
    } else {
      tokenClient.requestAccessToken({ prompt: '' });
    }
  });
};

export const handleSignoutClick = () => {
  const token = gapi.client.getToken();
  if (token !== null) {
    google.accounts.oauth2.revoke(token.access_token);
    gapi.client.setToken('');
    return true;
  }
  return false;
};

export const checkGoogleConnection = async (): Promise<boolean> => {
  try {
    const token = gapi.client.getToken();
    if (!token) return false;

    // Try to make a simple API call to verify the token
    const request = {
      'calendarId': 'primary',
      'timeMin': (new Date()).toISOString(),
      'maxResults': 1,
      'singleEvents': true,
    };
    await gapi.client.calendar.events.list(request);
    return true;
  } catch (error) {
    console.error('Error checking Google connection:', error);
    return false;
  }
};