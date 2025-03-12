document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("post-create-form");
    const imageInput = document.getElementById("post-image");
    const imagePreview = document.getElementById("image-preview");

    let uploadedImage = "";

    // 이미지 미리보기 기능
    if (imageInput) {
        imageInput.addEventListener("change", function () {
            const file = imageInput.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    uploadedImage = e.target.result;
                    imagePreview.innerHTML = `<img src="${uploadedImage}" alt="이미지 미리보기" class="post-image">`;
                };
                reader.readAsDataURL(file);
            }
        });
    }

    if (form) {
        form.addEventListener("submit", function (event) {
            event.preventDefault();

            // 고유 id를 사용하여 제목과 내용 가져오기
            const titleElement = document.getElementById("create-post-title");
            const contentElement = document.getElementById("create-post-content");

            if (!titleElement || !contentElement) {
                console.error("제목 또는 내용 입력 필드를 찾을 수 없습니다.");
                return;
            }

            const title = titleElement.value.trim();
            const content = contentElement.value.trim();

            if (title === "" || content === "") {
                alert("제목과 내용을 입력해주세요.");
                return;
            }

            // 게시글 데이터 저장
            const posts = JSON.parse(localStorage.getItem("posts")) || [];
            const newPost = {
                id: Date.now(),
                title: title,
                content: content,
                image: uploadedImage,
                likes: 0,
                likedBy: [],
                createdAt: new Date().toLocaleString("ko-KR")
            };

            posts.unshift(newPost);
            localStorage.setItem("posts", JSON.stringify(posts));

            alert("게시글이 등록되었습니다.");
            // 상대 경로 사용 (필요 시 경로를 조정하세요)
            window.location.href = "/posts.html";
        });
    }
});
