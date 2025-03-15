import { getCurrentUser } from './user.js';

document.addEventListener("DOMContentLoaded", function() {
  fetch('/posts/header.html')
    .then(response => {
      if (!response.ok) {
        throw new Error("Header 파일을 불러올 수 없습니다.");
      }
      return response.text();
    })
    .then(data => {
      document.body.insertAdjacentHTML('afterbegin', data);

      // localStorage에서 저장된 user 객체를 가져옵니다.
      const user = getCurrentUser();
      if (user && user.profile) {
        const profileImage = document.getElementById('profileImage');
        if (profileImage) {
          profileImage.src = user.profile;
        }
      }

      // (이후 드롭다운 메뉴 등 추가 기능 구현 코드)
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
          localStorage.removeItem('user'); // 일관된 키 사용
          window.location.href = '/posts/login.html';
        });
      }
    })
    .catch(error => console.error("Error loading header:", error));
});
