class PostManager {
    constructor() {
        this.posts = JSON.parse(localStorage.getItem("posts")) || [];
        this.comments = JSON.parse(localStorage.getItem("comments")) || {}; // 댓글 저장소 추가
    }

    savePosts() {
        localStorage.setItem("posts", JSON.stringify(this.posts));
    }

    saveComments() {
        localStorage.setItem("comments", JSON.stringify(this.comments)); // 댓글 저장
    }

    addPost(title, content) {
        const newPost = {
            id: Date.now(),
            title,
            content,
            createdAt: new Date().toLocaleString()
        };
        this.posts.unshift(newPost); // 새 게시글을 맨 앞에 추가
        this.savePosts();
    }

    getAllPosts() {
        return this.posts;
    }

    getPostById(id) {
        return this.posts.find(post => post.id === Number(id));
    }

    updatePost(id, newTitle, newContent) {
        const post = this.getPostById(id);
        if (post) {
            post.title = newTitle;
            post.content = newContent;
            this.savePosts();
        }
    }

    deletePost(id) {
        this.posts = this.posts.filter(post => post.id !== Number(id));
        this.savePosts();
    }

    addComment(postId, commentText) {
        if (!this.comments[postId]) {
            this.comments[postId] = [];
        }
        this.comments[postId].push(commentText);
        this.saveComments();
    }

    getCommentsByPostId(postId) {
        return this.comments[postId] || [];
    }
}

const postManager = new PostManager();

document.addEventListener("DOMContentLoaded", function () {
    if (document.getElementById("post-list")) {
        loadPosts();  // ✅ 게시글 목록 로드
    }
    if (document.getElementById("post-detail")) {
        loadPostDetail();
    }

    const form = document.getElementById("post-create-form");
    if (form) {
        form.addEventListener("submit", function (event) {
            event.preventDefault(); // 기본 동작 방지

            // 제목과 내용 가져오기
            const title = document.getElementById("post-title").value.trim();
            const content = document.getElementById("post-content").value.trim();

            if (title === "" || content === "") {
                alert("제목과 내용을 입력해주세요.");
                return;
            }

            // 게시글 추가
            postManager.addPost(title, content);

            // 📌 'posts.html'로 이동
            window.location.href = "posts.html"; 
        });
    }

    // 댓글 작성 버튼 이벤트 추가
    const commentButton = document.getElementById("comment-button");
    if (commentButton) {
        commentButton.addEventListener("click", addComment);
    }

    // 수정 버튼 이벤트 추가
    const editButton = document.getElementById("edit-button");
    if (editButton) {
        editButton.addEventListener("click", editPost);
    }

    // 삭제 버튼 이벤트 추가
    const deleteButton = document.getElementById("delete-button");
    if (deleteButton) {
        deleteButton.addEventListener("click", deletePost);
    }
});

// ✅ 게시글 목록 불러오기 함수
function loadPosts() {
    const postsContainer = document.getElementById("post-list"); // ✅ 'posts-container' → 'post-list'
    postsContainer.innerHTML = ""; // 기존 목록 초기화

    const posts = postManager.getAllPosts();

    if (posts.length === 0) {
        postsContainer.innerHTML = "<p>작성된 게시글이 없습니다.</p>";
        return;
    }

    posts.forEach(post => {
        const postElement = document.createElement("div");
        postElement.classList.add("post-item");
        postElement.innerHTML = `
            <h3><a href="post-detail.html?id=${post.id}">${post.title || "제목 없음"}</a></h3>
            <p>${post.content || "내용 없음"}</p>
            <small>${post.createdAt || "날짜 없음"}</small>
        `;
        postsContainer.appendChild(postElement);
    });
}

// ✅ 게시글 상세보기 함수
function loadPostDetail() {
    const params = new URLSearchParams(window.location.search);
    const postId = params.get("id");
    const post = postManager.getPostById(postId);

    if (post) {
        document.getElementById("post-detail").innerHTML = `
            <h2>${post.title}</h2>
            <p>${post.content}</p>
            <small>${post.createdAt}</small>
        `;

        loadComments(postId);
    } else {
        document.getElementById("post-detail").innerHTML = `<p>게시글을 찾을 수 없습니다.</p>`;
    }
}

// ✅ 댓글 불러오기 함수
function loadComments(postId) {
    const commentsContainer = document.getElementById("comments");
    commentsContainer.innerHTML = "";

    const comments = postManager.getCommentsByPostId(postId);
    comments.forEach(comment => {
        const commentElement = document.createElement("div");
        commentElement.classList.add("comment");
        commentElement.innerHTML = `<p>${comment}</p>`;
        commentsContainer.appendChild(commentElement);
    });
}
function loadPosts() {
    const postsContainer = document.getElementById("post-list"); // ✅ 'posts-container' → 'post-list'
    postsContainer.innerHTML = ""; // 기존 목록 초기화

    const posts = postManager.getAllPosts();

    if (posts.length === 0) {
        postsContainer.innerHTML = "<p>작성된 게시글이 없습니다.</p>";
        return;
    }

    posts.forEach(post => {
        const postElement = document.createElement("div");
        postElement.classList.add("post-item"); // ✅ 카드 형태로 표시

        postElement.innerHTML = `
            <h3><a href="post-detail.html?id=${post.id}">${post.title || "제목 없음"}</a></h3>
            <p>${post.content || "내용 없음"}</p>
            <small>${post.createdAt || "날짜 없음"}</small>
        `;

        postsContainer.appendChild(postElement);
    });
}
// 수정 버튼 클릭 시 수정 페이지로 이동
document.getElementById("edit-button").addEventListener("click", function () {
    const params = new URLSearchParams(window.location.search);
    const postId = params.get("id"); // 현재 게시글 ID 가져오기

    if (!postId) {
        alert("수정할 게시글을 찾을 수 없습니다.");
        return;
    }

    // ✅ 수정 페이지로 이동 (게시글 ID 포함)
    window.location.href = `post-edit.html?id=${postId}`;
});
document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("post-create-form");
    const imageInput = document.getElementById("post-image");
    const imagePreview = document.getElementById("image-preview");
    let uploadedImage = null;

    // ✅ 이미지 미리보기 기능 추가
    imageInput.addEventListener("change", function () {
        const file = imageInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (event) {
                uploadedImage = event.target.result;
                imagePreview.innerHTML = `<img src="${uploadedImage}" alt="이미지 미리보기" class="post-image">`;
            };
            reader.readAsDataURL(file);
        }
    });

    if (form) {
        form.addEventListener("submit", function (event) {
            event.preventDefault();

            const title = document.getElementById("post-title").value.trim();
            const content = document.getElementById("post-content").value.trim();

            if (title === "" || content === "") {
                alert("제목과 내용을 입력해주세요.");
                return;
            }

            const posts = JSON.parse(localStorage.getItem("posts")) || [];

            const newPost = {
                id: Date.now(),
                title,
                content,
                image: uploadedImage, // ✅ 이미지 추가
                likes: 0,
                likedBy: [],
                createdAt: new Date().toLocaleString("ko-KR")
            };

            posts.unshift(newPost);
            localStorage.setItem("posts", JSON.stringify(posts));

            alert("게시글이 등록되었습니다.");
            window.location.href = "/posts/posts.html";
        });
    }
});
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
                uploadedImage = e.target.result; // ✅ base64 이미지 저장
                imagePreview.innerHTML = `<img src="${uploadedImage}" alt="업로드된 이미지" class="preview-image">`;
            };
            reader.readAsDataURL(file);
        }
    });

    if (form) {
        form.addEventListener("submit", function (event) {
            event.preventDefault();

            const title = document.getElementById("post-title").value.trim();
            const content = document.getElementById("post-content").value.trim();

            if (title === "" || content === "") {
                alert("제목과 내용을 입력해주세요.");
                return;
            }

            const posts = JSON.parse(localStorage.getItem("posts")) || [];

            const newPost = {
                id: Date.now(),
                title,
                content,
                image: uploadedImage, // ✅ 이미지 추가
                likes: 0,
                likedBy: [],
                createdAt: new Date().toLocaleString("ko-KR")
            };

            posts.unshift(newPost);
            localStorage.setItem("posts", JSON.stringify(posts));

            alert("게시글이 등록되었습니다.");
            window.location.href = "/posts/posts.html";
        });
    }
});
document.addEventListener("DOMContentLoaded", function () {
    const postsContainer = document.getElementById("post-list");
    let posts = JSON.parse(localStorage.getItem("posts")) || [];

    // ✅ 존재하지 않는 게시글 제거
    posts = posts.filter(post => post && post.id && post.title && post.content);
    localStorage.setItem("posts", JSON.stringify(posts));

    postsContainer.innerHTML = ""; // 기존 목록 초기화

    if (posts.length === 0) {
        postsContainer.innerHTML = "<p>작성된 게시글이 없습니다.</p>";
        return;
    }

    // ✅ 게시글 목록 렌더링
    posts.forEach(post => {
        const postElement = document.createElement("div");
        postElement.classList.add("post-item");
        postElement.innerHTML = `
            <h3><a href="post-detail.html?id=${post.id}">${post.title}</a></h3>
            <p>${post.content}</p>
            <small>${post.createdAt}</small>
        `;

        // ✅ 클릭 시 게시글 상세 페이지로 이동
        postElement.addEventListener("click", function () {
            if (!post || !post.id) {
                alert("존재하지 않는 게시글입니다.");
                return;
            }
            window.location.href = `post-detail.html?id=${post.id}`;
        });

        postsContainer.appendChild(postElement);
    });
});

