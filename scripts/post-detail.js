document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get("id");
  
    let posts = JSON.parse(localStorage.getItem("posts")) || [];
    // URL에서 받은 postId(문자열)를 Number로 변환하여 비교
    const postIndex = posts.findIndex(p => p.id === Number(postId));
    const post = posts[postIndex];
  
    if (!post) {
      alert("존재하지 않는 게시글입니다.");
      window.location.href = "/posts/posts.html";
      return;
    }
  
    // 제목, 내용, 작성일 표시
    document.getElementById("post-title").textContent = post.title;
    document.getElementById("post-content").textContent = post.content;
    document.getElementById("post-date").textContent = post.createdAt;
  
    // 작성자 정보 표시 (작성자 프로필과 이름)
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (post.author) {
      const authorImg = post.authorProfile || (currentUser ? currentUser.profile : "/assets/images/default-profile.png");
      document.getElementById("post-author").innerHTML = `<img src="${authorImg}" alt="프로필" class="author-img"> ${post.author}`;
    } else if (currentUser) {
      document.getElementById("post-author").innerHTML = `<img src="${currentUser.profile}" alt="프로필" class="author-img"> ${currentUser.name}`;
    } else {
      document.getElementById("post-author").textContent = "익명";
    }
  
    // 이미지 표시
    if (post.image) {
      document.getElementById("post-image-container").innerHTML = `
        <img src="${post.image}" alt="게시글 이미지" class="post-image">
      `;
    }
  
    // 조회수 증가
    post.views = (post.views || 0) + 1;
    document.getElementById("view-count").textContent = post.views;
    localStorage.setItem("posts", JSON.stringify(posts));
  
    // 좋아요 기능 (토글 시 좋아요 수를 1 또는 0으로 설정)
    const likeButton = document.getElementById("like-button");
    const likeCount = document.getElementById("like-count");
    likeCount.textContent = post.likes || 0;
    likeButton.addEventListener("click", function () {
      if (!post.likedBy) post.likedBy = [];
      const isLiked = post.likedBy.includes("guest");
      if (isLiked) {
        post.likedBy = post.likedBy.filter(id => id !== "guest");
        post.likes = 0;
        likeButton.classList.remove("active");
      } else {
        post.likedBy.push("guest");
        post.likes = 1;
        likeButton.classList.add("active");
      }
      likeCount.textContent = post.likes;
      localStorage.setItem("posts", JSON.stringify(posts));
    });
  
    // 댓글 기능
    const commentInput = document.getElementById("comment-input");
    const commentButton = document.getElementById("comment-button");
    const commentsList = document.getElementById("comments");
  
    function renderComments() {
      commentsList.innerHTML = "";
      post.comments = post.comments || [];
  
      post.comments.forEach((comment, index) => {
        const commentElement = document.createElement("div");
        commentElement.classList.add("comment-item");
  
        const commentText = document.createElement("span");
        commentText.textContent = comment.text;
        commentElement.appendChild(commentText);
  
        const commentTime = document.createElement("span");
        commentTime.classList.add("comment-time");
        commentTime.textContent = ` (${comment.createdAt})`;
        commentElement.appendChild(commentTime);
  
        const actionsContainer = document.createElement("div");
        actionsContainer.classList.add("comment-actions");
  
        const editButton = document.createElement("button");
        editButton.textContent = "수정";
        editButton.classList.add("edit-comment");
        editButton.addEventListener("click", function () {
          editComment(index);
        });
        actionsContainer.appendChild(editButton);
  
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "삭제";
        deleteButton.classList.add("delete-comment");
        deleteButton.addEventListener("click", function () {
          deleteComment(index);
        });
        actionsContainer.appendChild(deleteButton);
  
        commentElement.appendChild(actionsContainer);
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
      const newComment = {
        text: commentText,
        createdAt: new Date().toLocaleString("ko-KR")
      };
      post.comments.push(newComment);
      localStorage.setItem("posts", JSON.stringify(posts));
      renderComments();
      commentInput.value = "";
    });
  
    function editComment(index) {
      let modal = document.getElementById("edit-comment-modal");
      if (!modal) {
        modal = document.createElement("div");
        modal.id = "edit-comment-modal";
        modal.className = "modal-overlay";
        modal.innerHTML = `
          <div class="modal">
            <h2>댓글 수정</h2>
            <textarea id="edit-comment-text" class="modal-textarea"></textarea>
            <div class="modal-buttons">
              <button id="save-comment-button" class="modal-confirm">저장</button>
              <button id="cancel-comment-button" class="modal-cancel">취소</button>
            </div>
          </div>
        `;
        document.body.appendChild(modal);
      }
      modal.style.display = "flex";
      const editTextarea = document.getElementById("edit-comment-text");
      editTextarea.value = post.comments[index].text;
      const saveButton = document.getElementById("save-comment-button");
      const cancelButton = document.getElementById("cancel-comment-button");
  
      function saveHandler() {
        const newText = editTextarea.value.trim();
        if (newText !== "") {
          post.comments[index].text = newText;
          localStorage.setItem("posts", JSON.stringify(posts));
          renderComments();
        }
        modal.style.display = "none";
        saveButton.removeEventListener("click", saveHandler);
        cancelButton.removeEventListener("click", cancelHandler);
      }
      function cancelHandler() {
        modal.style.display = "none";
        saveButton.removeEventListener("click", saveHandler);
        cancelButton.removeEventListener("click", cancelHandler);
      }
      saveButton.addEventListener("click", saveHandler);
      cancelButton.addEventListener("click", cancelHandler);
    }
  
    function deleteComment(index) {
      if (confirm("댓글을 삭제하시겠습니까?")) {
        post.comments.splice(index, 1);
        localStorage.setItem("posts", JSON.stringify(posts));
        renderComments();
      }
    }
  
    renderComments();
  
    // 게시글 수정 버튼 이벤트
    document.getElementById("edit-button").addEventListener("click", function () {
      window.location.href = `/posts/post-edit.html?id=${postId}`;
    });
  
    // 게시글 삭제 버튼 이벤트
    document.getElementById("delete-button").addEventListener("click", function () {
      if (confirm("게시글을 삭제하시겠습니까?")) {
        posts.splice(postIndex, 1);
        localStorage.setItem("posts", JSON.stringify(posts));
        alert("게시글이 삭제되었습니다.");
        window.location.href = "/posts/posts.html";
      }
    });
  });
  