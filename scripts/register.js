document.addEventListener('DOMContentLoaded', function() {
    const profileContainer = document.getElementById('profile-container');
    const profileUpload = document.getElementById('profile-upload');
    const profilePreview = document.getElementById('profile-preview');
    const profilePlus = document.getElementById('profile-plus');
    const registerForm = document.getElementById('register-form');
  
    // 프로필 영역 클릭 시, 기존 이미지가 있다면 삭제 후 파일 선택창 열기
    profileContainer.addEventListener('click', function() {
      // 이미지가 이미 있다면 삭제 (즉시 초기화)
      if (!profilePreview.classList.contains('hidden')) {
        profilePreview.src = "";
        profilePreview.classList.add('hidden');
        profilePlus.style.display = 'block';
        profileUpload.value = "";
      }
      // 파일 선택창 열기
      profileUpload.click();
    });
  
    // 파일 선택 후 미리보기 처리
    profileUpload.addEventListener('change', function(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
          profilePreview.src = e.target.result;
          profilePreview.classList.remove('hidden');
          profilePlus.style.display = 'none';
        }
        reader.readAsDataURL(file);
      }
    });
  
    // 폼 제출 시 비밀번호 일치 여부 확인
    registerForm.addEventListener('submit', function(e) {
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirm-password').value;
      if (password !== confirmPassword) {
        e.preventDefault();
        alert("비밀번호가 다릅니다");
      }
    });
  });
  