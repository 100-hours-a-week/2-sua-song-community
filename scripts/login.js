document.addEventListener('DOMContentLoaded', function() {
  const loginForm = document.getElementById('loginForm');

  loginForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    // 초기화: 이전 오류 메시지 제거
    emailError.textContent = '';
    passwordError.textContent = '';

    // 간단한 입력 검증
    let isValid = true;
    if (!email) {
      emailError.textContent = '이메일을 입력해주세요.';
      isValid = false;
    }
    if (!password) {
      passwordError.textContent = '비밀번호를 입력해주세요.';
      isValid = false;
    }
    if (!isValid) return;

    // localStorage에서 "user" 키로 저장된 유저 정보 가져오기
    const storedUserStr = localStorage.getItem('user');
    let storedUser = null;
    try {
      storedUser = JSON.parse(storedUserStr);
    } catch (err) {
      console.error("Error parsing stored user:", err);
    }

    if (!storedUser || Object.keys(storedUser).length === 0) {
      emailError.textContent = '등록된 사용자가 없습니다. 회원가입을 진행해주세요.';
      return;
    }

    // 이메일과 비밀번호 비교
    if (storedUser.email === email && storedUser.password === password) {
      alert('로그인 성공!');
      window.location.href = '/posts/posts.html'; // 로그인 성공 후 이동할 페이지
    } else {
      emailError.textContent = '이메일 또는 비밀번호가 일치하지 않습니다.';
      passwordError.textContent = '이메일 또는 비밀번호가 일치하지 않습니다.';
    }
  });
});
