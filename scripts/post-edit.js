document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get("id");

    if (!postId) {
        alert("게시글을 찾을 수 없습니다.");
        window.location.href = "/posts/posts.html";
        return;
    }

    let posts = JSON.parse(localStorage.getItem("posts")) || [];
    const postIndex = posts.findIndex(post => post.id == postId);

    if (postIndex === -1) {
        alert("게시글을 찾을 수 없습니다.");
        window.location.href = "/posts/posts.html";
        return;
    }

    const post = posts[postIndex];

    console.log("🔹 수정할 게시글:", post); // ✅ 디버깅용 로그

    // ✅ 기존 제목과 내용 불러오기
    document.getElementById("post-title").value = post.title;
    document.getElementById("post-content").value = post.content;

    // ✅ 기존 이미지 표시
    if (post.image) {
        document.getElementById("image-preview").innerHTML = `
            <img src="${post.image}" alt="게시글 이미지" class="post-image">
        `;
    }

    document.getElementById("post-edit-form").addEventListener("submit", function (event) {
        event.preventDefault();

        console.log("✏️ 수정 완료 버튼 클릭됨");

        const newTitle = document.getElementById("post-title").value.trim();
        const newContent = document.getElementById("post-content").value.trim();
        const imageFile = document.getElementById("post-image").files[0];

        if (newTitle === "" || newContent === "") {
            console.warn("⚠️ 제목 또는 내용이 비어 있음");
            alert("제목과 내용을 입력해주세요.");
            return;
        }

        console.log("✅ 수정된 제목:", newTitle);
        console.log("✅ 수정된 내용:", newContent);

        if (imageFile) {
            const reader = new FileReader();
            reader.onload = function (e) {
                post.image = e.target.result;
                updatePostData();
            };
            reader.readAsDataURL(imageFile);
        } else {
            updatePostData();
        }

        function updatePostData() {
            post.title = newTitle;
            post.content = newContent;
            post.editedAt = new Date().toISOString();

            localStorage.setItem("posts", JSON.stringify(posts));
            console.log("✅ 게시글 수정 완료:", post);

            // ✅ detail.html로 확실하게 이동시키기
            setTimeout(() => {
                console.log("🔄 detail.html 이동 중...");
                window.location.replace(`/posts/post-detail.html?id=${postId}`);
            }, 500);
        }
    });
});
