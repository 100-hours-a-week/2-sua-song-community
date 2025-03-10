// /scripts/header.js
import { getCurrentUser } from './user.js';

document.addEventListener("DOMContentLoaded", function() {
  fetch('/posts/header.html')
    .then(response => response.text())
    .then(data => {
      // 헤더를 페이지 상단에 삽입
      document.body.insertAdjacentHTML('afterbegin', data);

      // 로그인한 유저 정보 업데이트 (회원가입에서 저장된 프로필 사진)
      const user = getCurrentUser();
      if (user && user.profile) {
        const profileImage = document.getElementById('profileImage');
        if (profileImage) {
          profileImage.src = user.profile;
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
