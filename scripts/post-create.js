document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("post-create-form");
    const imageInput = document.getElementById("post-image");
    const imagePreview = document.getElementById("image-preview");

    let uploadedImage = "";

    // ✅ 이미지 미리보기 기능 추가
    imageInput.addEventListener("change", function () {
        const file = imageInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                uploadedImage = e.target.result; // ✅ base64 데이터 저장
                imagePreview.innerHTML = `<img src="${uploadedImage}" alt="업로드된 이미지" class="post-image">`;
            };
            reader.readAsDataURL(file);
        }
    });

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        // ✅ 제목과 내용 가져오기
        const title = document.getElementById("post-title").value.trim();
        const content = document.getElementById("post-content").value.trim();

        if (title === "" || content === "") {
            alert("제목과 내용을 입력해주세요.");
            return;
        }

        // ✅ 게시글 데이터 저장 (이미지 포함)
        const posts = JSON.parse(localStorage.getItem("posts")) || [];
        const newPost = {
            id: Date.now(),
            title,
            content,
            image: uploadedImage,  // ✅ 이미지 데이터 포함
            createdAt: new Date().toLocaleString("ko-KR"),
        };

        posts.push(newPost);
        localStorage.setItem("posts", JSON.stringify(posts));

        // ✅ 게시글 목록으로 이동
        window.location.href = "/posts/posts.html";
    });
});
