document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.querySelector("#login-form");

    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const email = document.querySelector("#email").value;
        const password = document.querySelector("#password").value;
        const emailError = document.querySelector("#email-error");
        const passwordError = document.querySelector("#password-error");

        let valid = true;

        if (!checkEmailFormat(email)) {
            emailError.textContent = "올바른 이메일을 입력하세요.";
            emailError.style.display = "block";
            valid = false;
        } else {
            emailError.style.display = "none";
        }

        if (!checkPasswordStrength(password)) {
            passwordError.textContent = "비밀번호는 8자 이상, 숫자와 특수문자를 포함해야 합니다.";
            passwordError.style.display = "block";
            valid = false;
        } else {
            passwordError.style.display = "none";
        }

        if (valid) {
            alert("로그인 성공!");
            window.location.href = "/posts.html";
        }
    });

    function checkEmailFormat(email) {
        const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
        return emailRegex.test(email);
    }

    function checkPasswordStrength(password) {
        return password.length >= 8 && /\d/.test(password) && /[!@#$%^&*]/.test(password);
    }
});
