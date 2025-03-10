document.addEventListener("DOMContentLoaded", function() {
  const profileContainer = document.getElementById("profile-container");
  const profilePreview = document.getElementById("profile-preview");
  const profilePlus = document.getElementById("profile-plus");
  const profileUpload = document.getElementById("profile-upload");

  // 프로필 업로드 영역 클릭 시 파일 선택 창 열기
  profileContainer.addEventListener("click", function() {
    profileUpload.click();
  });

  // 파일 선택 시 미리보기 업데이트
  profileUpload.addEventListener("change", function() {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        profilePreview.src = e.target.result;
        profilePreview.classList.remove("hidden");
        profilePlus.classList.add("hidden");
      };
      reader.readAsDataURL(file);
    }
  });

  // 회원가입 폼 제출 시
  const registerForm = document.getElementById("register-form");
  registerForm.addEventListener("submit", function(e) {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document.getElementById("confirm-password").value.trim();
    const nickname = document.getElementById("nickname").value.trim();
    const profile = profilePreview.src; // 업로드된 이미지 (base64 데이터) 또는 기본값

    if (!email || !password || !confirmPassword || !nickname) {
      alert("모든 필드를 입력해주세요.");
      return;
    }
    if (password !== confirmPassword) {
      alert("비밀번호와 확인이 일치하지 않습니다.");
      return;
    }

    // 사용자 객체 생성
    const newUser = {
      email,
      password,  // 실제 서비스에서는 암호화 필요
      nickname,
      profile
    };

    // localStorage에 currentUser로 저장
    localStorage.setItem("currentUser", JSON.stringify(newUser));
    alert("회원가입이 완료되었습니다.");
    window.location.href = "/posts/posts.html";
  });
});
