document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get("id");

    let posts = JSON.parse(localStorage.getItem("posts")) || [];
    const post = posts.find(p => p.id == postId);

    if (!post) {
        alert("존재하지 않는 게시글입니다.");
        window.location.href = "/posts/posts.html";
        return;
    }

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

    // ✅ 좋아요 버튼 동작 추가
    const likeButton = document.getElementById("like-button");
    const likeCount = document.getElementById("like-count");
    likeCount.textContent = post.likes;

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

    // ✅ 댓글 개수 업데이트
    document.getElementById("comment-count").textContent = post.comments ? post.comments.length : 0;

    // ✅ 수정 버튼 이벤트 추가
    document.getElementById("edit-button").addEventListener("click", function () {
        window.location.href = `/posts/post-edit.html?id=${postId}`;
    });

    // ✅ 삭제 버튼 이벤트 추가 (목록에서 삭제 반영)
    document.getElementById("delete-button").addEventListener("click", function () {
        if (confirm("게시글을 삭제하시겠습니까?")) {
            posts = posts.filter(p => p.id != postId);
            localStorage.setItem("posts", JSON.stringify(posts));
            alert("게시글이 삭제되었습니다.");
            window.location.href = "/posts/posts.html";
        }
    });
});
