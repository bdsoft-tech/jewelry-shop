export const DEMO_USER_SESSION_KEY = "aurelle-demo-user-session";
export const DEMO_ADMIN_SESSION_KEY = "aurelle-demo-admin-session";

export type DemoSessionRole = "user" | "admin";

function getSessionKey(role: DemoSessionRole) {
  return role === "admin" ? DEMO_ADMIN_SESSION_KEY : DEMO_USER_SESSION_KEY;
}

function canUseSessionStorage() {
  return typeof window !== "undefined";
}

export function setDemoSession(role: DemoSessionRole, email: string) {
  if (!canUseSessionStorage()) {
    return;
  }

  window.sessionStorage.setItem(
    getSessionKey(role),
    JSON.stringify({
      email,
      signedInAt: new Date().toISOString(),
    }),
  );
}

export function hasDemoSession(role: DemoSessionRole) {
  if (!canUseSessionStorage()) {
    return false;
  }

  return window.sessionStorage.getItem(getSessionKey(role)) !== null;
}

export function clearDemoSession(role: DemoSessionRole) {
  if (!canUseSessionStorage()) {
    return;
  }

  window.sessionStorage.removeItem(getSessionKey(role));
}

export function getSafeRedirectPath(value: string | null, fallback: string) {
  if (!value) {
    return fallback;
  }

  if (!value.startsWith("/") || value.startsWith("//")) {
    return fallback;
  }

  return value;
}
