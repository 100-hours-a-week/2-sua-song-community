// 단일 DOMContentLoaded 이벤트 내에서 모든 기능을 처리합니다.
document.addEventListener("DOMContentLoaded", function () {
    console.log("DOMContentLoaded fired in post.js");

    // -- 게시글 작성 페이지 처리 --
    const createForm = document.getElementById("post-create-form");
    if (createForm) {
        const imageInput = document.getElementById("post-image");
        const imagePreview = document.getElementById("image-preview");
        let uploadedImage = "";

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

        createForm.addEventListener("submit", function (event) {
            event.preventDefault();

            // 여기서 반드시 HTML에 존재하는 id를 사용합니다.
            const titleEl = document.getElementById("create-post-title");
            const contentEl = document.getElementById("create-post-content");

            if (!titleEl || !contentEl) {
                console.error("입력 필드를 찾을 수 없습니다.");
                alert("입력 필드를 찾을 수 없습니다. HTML 코드를 확인해주세요.");
                return;
            }

            const title = titleEl.value.trim();
            const content = contentEl.value.trim();

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
            // 경로 확인: 상대 경로 사용 (게시글 목록 페이지 위치에 맞게 수정)
            window.location.href = "/posts/posts.html";
        });
    }

    // -- 게시글 목록 페이지 처리 --
    const postsContainer = document.getElementById("post-list");
    if (postsContainer) {
        let posts = JSON.parse(localStorage.getItem("posts")) || [];
        // 필터링 (필요 시)
        posts = posts.filter(post => post && post.id && post.title && post.content);
        localStorage.setItem("posts", JSON.stringify(posts));
        postsContainer.innerHTML = "";

        if (posts.length === 0) {
            postsContainer.innerHTML = "<p>작성된 게시글이 없습니다.</p>";
        } else {
            posts.forEach(post => {
                const postElement = document.createElement("div");
                postElement.classList.add("post-item");
                postElement.innerHTML = `
                    <h3><a href="post-detail.html?id=${post.id}">${post.title}</a></h3>
                    <p>${post.content}</p>
                    <small>${post.createdAt}</small>
                `;
                postElement.addEventListener("click", function () {
                    if (!post || !post.id) {
                        alert("존재하지 않는 게시글입니다.");
                        return;
                    }
                    window.location.href = `post-detail.html?id=${post.id}`;
                });
                postsContainer.appendChild(postElement);
            });
        }
    }

    // -- 게시글 상세보기 페이지 처리 --
    if (document.getElementById("post-detail")) {
        const params = new URLSearchParams(window.location.search);
        const postId = params.get("id");
        const post = postManager.getPostById(postId);
        if (post) {
            document.getElementById("post-detail").innerHTML = `
                <h2>${post.title}</h2>
                <p>${post.content}</p>
                <small>${post.createdAt}</small>
            `;
            // 댓글 로딩 함수 호출 (정의되어 있으면)
            loadComments(postId);
        } else {
            document.getElementById("post-detail").innerHTML = `<p>게시글을 찾을 수 없습니다.</p>`;
        }
    }

    // -- 게시글 수정 및 삭제 버튼 처리 (상세보기 페이지) --
    const editButton = document.getElementById("edit-button");
    if (editButton) {
        editButton.addEventListener("click", function () {
            const params = new URLSearchParams(window.location.search);
            const postId = params.get("id");
            if (!postId) {
                alert("수정할 게시글을 찾을 수 없습니다.");
                return;
            }
            window.location.href = `post-edit.html?id=${postId}`;
        });
    }
    const deleteButton = document.getElementById("delete-button");
    if (deleteButton) {
        deleteButton.addEventListener("click", function () {
            const params = new URLSearchParams(window.location.search);
            const postId = params.get("id");
            if (!postId) {
                alert("삭제할 게시글을 찾을 수 없습니다.");
                return;
            }
            if (confirm("게시글을 삭제하시겠습니까?")) {
                postManager.deletePost(postId);
                alert("게시글이 삭제되었습니다.");
                window.location.href = "/posts/posts.html";
            }
        });
    }

    // -- 댓글, 기타 기능은 기존 코드대로 처리 --
});
