document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get("id");

    let posts = JSON.parse(localStorage.getItem("posts")) || [];
    const postIndex = posts.findIndex(p => p.id == postId);
    const post = posts[postIndex];

    if (!post) {
        alert("존재하지 않는 게시글입니다.");
        window.location.href = "/posts/posts.html";
        return;
    }

    // ✅ 제목, 내용, 작성일 표시
    document.getElementById("post-title").textContent = post.title;
    document.getElementById("post-content").textContent = post.content;
    document.getElementById("post-date").textContent = post.createdAt;

    // ✅ 이미지 표시
    if (post.image) {
        document.getElementById("post-image-container").innerHTML = `
            <img src="${post.image}" alt="게시글 이미지" class="post-image">
        `;
    }

    // ✅ 조회수 증가
    post.views = (post.views || 0) + 1;
    document.getElementById("view-count").textContent = post.views;
    localStorage.setItem("posts", JSON.stringify(posts));

    // ✅ 좋아요 기능
    const likeButton = document.getElementById("like-button");
    const likeCount = document.getElementById("like-count");
    likeCount.textContent = post.likes || 0;

    likeButton.addEventListener("click", function () {
        if (!post.likedBy) post.likedBy = [];

        const isLiked = post.likedBy.includes("guest");

        if (isLiked) {
            post.likedBy = post.likedBy.filter(id => id !== "guest");
            post.likes -= 1;
            likeButton.classList.remove("active");
        } else {
            post.likedBy.push("guest");
            post.likes += 1;
            likeButton.classList.add("active");
        }

        likeCount.textContent = post.likes;
        localStorage.setItem("posts", JSON.stringify(posts));
    });

    // ✅ 댓글 기능
    const commentInput = document.getElementById("comment-input");
    const commentButton = document.getElementById("comment-button");
    const commentsList = document.getElementById("comments");

    function renderComments() {
        commentsList.innerHTML = ""; // 기존 댓글 초기화
        post.comments = post.comments || [];

        post.comments.forEach((comment, index) => {
            const commentElement = document.createElement("div");
            commentElement.classList.add("comment-item");

            const commentText = document.createElement("span");
            commentText.textContent = comment;
            commentElement.appendChild(commentText);

            // ✅ 수정 버튼
            const editButton = document.createElement("button");
            editButton.textContent = "수정";
            editButton.classList.add("edit-comment");
            editButton.addEventListener("click", function () {
                editComment(index);
            });

            // ✅ 삭제 버튼
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "삭제";
            deleteButton.classList.add("delete-comment");
            deleteButton.addEventListener("click", function () {
                deleteComment(index);
            });

            commentElement.appendChild(editButton);
            commentElement.appendChild(deleteButton);
            commentsList.appendChild(commentElement);
        });

        document.getElementById("comment-count").textContent = post.comments.length;
    }

    commentButton.addEventListener("click", function () {
        const commentText = commentInput.value.trim();
        if (commentText === "") {
            alert("댓글을 입력해주세요.");
            return;
        }

        post.comments.push(commentText);
        localStorage.setItem("posts", JSON.stringify(posts));

        renderComments();
        commentInput.value = "";
    });

    function editComment(index) {
        const newComment = prompt("수정할 내용을 입력하세요:", post.comments[index]);
        if (newComment !== null && newComment.trim() !== "") {
            post.comments[index] = newComment.trim();
            localStorage.setItem("posts", JSON.stringify(posts));
            renderComments();
        }
    }

    function deleteComment(index) {
        if (confirm("댓글을 삭제하시겠습니까?")) {
            post.comments.splice(index, 1);
            localStorage.setItem("posts", JSON.stringify(posts));
            renderComments();
        }
    }

    renderComments();

    // ✅ 수정 버튼 이벤트 추가
    document.getElementById("edit-button").addEventListener("click", function () {
        window.location.href = `/posts/post-edit.html?id=${postId}`;
    });

    // ✅ 삭제 버튼 이벤트 추가
    document.getElementById("delete-button").addEventListener("click", function () {
        if (confirm("게시글을 삭제하시겠습니까?")) {
            posts.splice(postIndex, 1);
            localStorage.setItem("posts", JSON.stringify(posts));
            alert("게시글이 삭제되었습니다.");
            window.location.href = "/posts/posts.html";
        }
    });
});
