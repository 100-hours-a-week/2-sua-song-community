// /scripts/user.js
export function getCurrentUser() {
    return JSON.parse(localStorage.getItem("User"));
  }
  