// /scripts/user.js
export function getCurrentUser() {
    // 예시: localStorage에 "currentUser"라는 키로 유저 정보를 JSON 형식으로 저장했다고 가정합니다.
    return JSON.parse(localStorage.getItem("currentUser"));
  }
  