// /scripts/header.js
import { getCurrentUser } from './user.js';

document.addEventListener("DOMContentLoaded", function() {
  fetch('/posts/header.html')
    .then(response => response.text())
    .then(data => {
      // 헤더를 문서 상단에 삽입
      document.body.insertAdjacentHTML('afterbegin', data);

      // 로그인한 유저 정보 업데이트
      const user = getCurrentUser();
      if (user && user.profile) {
        const profileImgEl = document.getElementById('profileImage');
        if (profileImgEl) {
          profileImgEl.src = user.profile;
        }
      }

      // 드롭다운 메뉴 기능
      const profileImage = document.getElementById('profileImage');
      const dropdownContent = document.getElementById('dropdownContent');
      const logoutBtn = document.getElementById('logoutBtn');

      if (profileImage && dropdownContent) {
        profileImage.addEventListener('click', function(e) {
          e.stopPropagation();
          dropdownContent.classList.toggle('show');
        });
        document.addEventListener('click', function(e) {
          if (!dropdownContent.contains(e.target)) {
            dropdownContent.classList.remove('show');
          }
        });
      }

      if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
          e.preventDefault();
          localStorage.removeItem('currentUser');
          window.location.href = '/login.html';
        });
      }
    })
    .catch(error => console.error("Error loading header:", error));
});
