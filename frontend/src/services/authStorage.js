const SESSION_KEY = 'reposentinel-session';

export function readStoredSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY)) || null;
  } catch {
    localStorage.removeItem(SESSION_KEY);
    return null;
  }
}

export function writeStoredSession(session) {
  if (session?.token) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
}

export function getStoredToken() {
  return readStoredSession()?.token || '';
}
