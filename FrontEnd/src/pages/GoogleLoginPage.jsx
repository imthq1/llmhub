import { useEffect, useState } from "react";
import authService from "../services/authService";

const pendingGoogleLogins = new Map();

function GoogleLoginPage() {
  const [status, setStatus] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has("error"))
      return "Google sign-in was cancelled or denied. Please try again.";
    const expected = sessionStorage.getItem("google_oauth_state");
    if (!params.get("code") || !expected || params.get("state") !== expected)
      return "Unable to verify the Google sign-in response. Please try again.";
    return "Signing you in with Google…";
  });

  useEffect(() => {
    let alive = true;
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const error = params.get("error");
    const expectedState = sessionStorage.getItem("google_oauth_state");
    const receivedState = params.get("state");

    if (error || !code || !expectedState || receivedState !== expectedState)
      return () => {
        alive = false;
      };

    if (!pendingGoogleLogins.has(code)) {
      const request = authService.loginWithGoogleCode(code);
      pendingGoogleLogins.set(code, request);
      request.finally(() => pendingGoogleLogins.delete(code)).catch(() => {});
    }

    const loginRequest = pendingGoogleLogins.get(code);
    loginRequest.then((result) => {
        if (result.access_token)
          localStorage.setItem("access_token", result.access_token);
        if (result.user)
          localStorage.setItem("user", JSON.stringify(result.user));
        sessionStorage.removeItem("google_oauth_state");
        if (alive) window.location.replace("/");
      })
      .catch((requestError) => {
        sessionStorage.removeItem("google_oauth_state");
        if (alive)
          setStatus(
            requestError.response?.data?.message ||
              requestError.message ||
              "Google sign-in failed.",
          );
      });

    return () => {
      alive = false;
    };
  }, []);

  return (
    <main className="auth-page">
      <section className="auth-card" aria-live="polite">
        <a className="wordmark" href="/">
          llm<span>hub</span>
        </a>
        <div className="auth-spinner" aria-hidden="true" />
        <h1>Google sign-in</h1>
        <p>{status}</p>
        <a className="auth-retry" href="/login">
          Back to login
        </a>
      </section>
    </main>
  );
}

export default GoogleLoginPage;
