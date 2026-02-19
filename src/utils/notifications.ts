import { isApiError } from "../api/index.js";
import { escapeHtml } from "./escape-html.js";

/**
 * Renders a dismissible error toast into #notifications.
 */
export function showError(error: unknown): void {
  const message = isApiError(error)
    ? `${error.message}${error.details ? ` — ${error.details}` : ""}`
    : error instanceof Error
      ? error.message
      : "An unexpected error occurred.";

  showNotification(message, "error");
}

/**
 * Renders a dismissible info toast into #notifications.
 */
export function showInfo(message: string): void {
  showNotification(message, "info");
}

function showNotification(message: string, type: "info" | "error"): void {
  const container = document.getElementById("notifications");
  if (!container) return;

  const article = document.createElement("article");
  article.setAttribute("role", type === "error" ? "alert" : "status");
  article.className = `notification notification--${type}`;
  article.innerHTML = `
    <span>${escapeHtml(message)}</span>
    <button class="notification__close" aria-label="Dismiss notification" type="button">✕</button>
  `;

  article.querySelector(".notification__close")?.addEventListener("click", () => {
    article.remove();
  });

  container.prepend(article);
}
