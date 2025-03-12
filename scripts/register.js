document.addEventListener('DOMContentLoaded', () => {
  // 프로필 이미지 업로드 처리
  const profileContainer = document.getElementById('profile-container');
  const profilePreview = document.getElementById('profile-preview');
  const profilePlus = document.getElementById('profile-plus');
  const profileUpload = document.getElementById('profile-upload');

  profileContainer.addEventListener('click', () => profileUpload.click());

  profileUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        profilePreview.src = ev.target.result;
        profilePreview.classList.remove('hidden');
        profilePlus.classList.add('hidden');
      };
      reader.readAsDataURL(file);
    }
  });

  const registerForm = document.getElementById('register-form');

  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // 모든 에러 메시지 초기화
    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');

    // 입력 값 가져오기
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const nicknameInput = document.getElementById('nickname');

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const confirmPassword = confirmPasswordInput.value.trim();
    const nickname = nicknameInput.value.trim();
    const profile = profilePreview.src || '';

    let isValid = true;

    // 이메일 검증
    if (!email) {
      document.querySelector('#email + .error-message').textContent = '이메일을 입력해주세요.';
      isValid = false;
    } else {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(email)) {
        document.querySelector('#email + .error-message').textContent = '이메일 형식이 아닙니다.';
        isValid = false;
      }
    }

    // 비밀번호 검증: 최소 8자, 대문자, 소문자, 숫자, 특수문자 포함
    if (!password) {
      document.querySelector('#password + .error-message').textContent = '비밀번호를 입력해주세요.';
      isValid = false;
    } else {
      const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
      if (!passRegex.test(password)) {
        document.querySelector('#password + .error-message').textContent = '비밀번호는 최소 8자 이상, 대문자, 소문자, 숫자, 특수문자를 포함해야 합니다.';
        isValid = false;
      }
    }

    // 비밀번호 확인 검증
    if (!confirmPassword) {
      document.querySelector('#confirm-password + .error-message').textContent = '비밀번호 확인을 입력해주세요.';
      isValid = false;
    } else if (password !== confirmPassword) {
      document.querySelector('#confirm-password + .error-message').textContent = '비밀번호와 일치하지 않습니다.';
      isValid = false;
    }

    // 닉네임 검증
    if (!nickname) {
      document.querySelector('#nickname + .error-message').textContent = '닉네임을 입력해주세요.';
      isValid = false;
    }

    if (!isValid) return; // 검증 실패 시 중단

    // 사용자 정보 객체 생성
    const newUser = { email, password, nickname, profile };

    // "API 호출" 시뮬레이션 (백엔드가 있다고 가정)
    console.log('회원가입 API 호출 중...');
    setTimeout(() => {
      // localStorage에 사용자 정보 저장
      localStorage.setItem('user', JSON.stringify(newUser));
      console.log('회원가입완료!');
      // 로그인 페이지로 이동
      window.location.href = '/posts/login.html';
    }, 1000);
  });
});

// register.js (회원가입 성공 후 부분 수정)
setTimeout(() => {
  // localStorage에 사용자 정보 저장
  localStorage.setItem('user', JSON.stringify(newUser));
  console.log('회원가입완료!');

  // 커스텀 알림창 생성
  const alertDiv = document.createElement('div');
  alertDiv.className = 'custom-alert';
  alertDiv.textContent = '회원가입완료! 로그인페이지로 이동합니다!';
  document.body.appendChild(alertDiv);

  // 2초 후 알림창 제거 후 로그인 페이지로 이동
  setTimeout(() => {
    alertDiv.remove();
    window.location.href = '/posts/login.html';
  }, 2000);
}, 1000);
