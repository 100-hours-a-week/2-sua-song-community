const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');
const submitButton = document.getElementById('submitButton');
const passwordError = document.getElementById('passwordError');
const passwordValidationError = document.getElementById('passwordValidationError');
const confirmPasswordError = document.getElementById('confirmPasswordError');
const toast = document.getElementById('toast');

passwordInput.addEventListener('input', validateForm);
confirmPasswordInput.addEventListener('input', validateForm);

function validateForm() {
  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value;
  let valid = true;
  
  // 에러 메시지 초기화
  passwordError.classList.add('hidden');
  passwordValidationError.classList.add('hidden');
  confirmPasswordError.classList.add('hidden');
  submitButton.classList.add('cursor-not-allowed');
  submitButton.classList.remove('bg-purple-500');
  submitButton.classList.add('bg-purple-300');
  submitButton.disabled = true;
  
  // 비밀번호 입력 체크
  if (!password) {
    passwordError.classList.remove('hidden');
    valid = false;
  } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/.test(password)) {
    passwordValidationError.classList.remove('hidden');
    valid = false;
  }
  
  // 비밀번호 확인 체크
  if (password !== confirmPassword) {
    confirmPasswordError.classList.remove('hidden');
    valid = false;
  }
  
  // 모든 조건 만족 시 버튼 활성화
  if (valid) {
    submitButton.classList.remove('cursor-not-allowed');
    submitButton.classList.remove('bg-purple-300');
    submitButton.classList.add('bg-purple-500');
    submitButton.disabled = false;
  }
}

document.getElementById('passwordForm').addEventListener('submit', function(event) {
  event.preventDefault();
  if (submitButton.disabled) return;
  toast.classList.remove('hidden');
  setTimeout(() => {
    toast.classList.add('hidden');
  }, 3000);
});
