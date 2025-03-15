document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get("id");

    let posts = JSON.parse(localStorage.getItem("posts")) || [];
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
    // 등록 시간: post.createdAt을 오른쪽에 작은 글씨로 표시
    document.getElementById("post-date").textContent = post.createdAt;

    // 작성자 정보 표시 (작성자 프로필과 이름)
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (post.author) {
        // 게시글에 작성자 정보가 있다면 사용
        const authorImg = post.authorProfile || (currentUser ? currentUser.profile : "/assets/images/default-profile.png");
        document.getElementById("post-author").innerHTML = `<img src="${authorImg}" alt="프로필" class="author-img"> ${post.author}`;
    } else if (currentUser) {
        // 로그인한 유저 정보 사용
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
        commentsList.innerHTML = ""; // 기존 댓글 초기화
        post.comments = post.comments || [];

        post.comments.forEach((comment, index) => {
            const commentElement = document.createElement("div");
            commentElement.classList.add("comment-item");

            // 댓글 내용 표시 (객체의 text 프로퍼티 사용)
            const commentText = document.createElement("span");
            commentText.textContent = comment.text;
            commentElement.appendChild(commentText);

            // 댓글 등록 시간 표시
            const commentTime = document.createElement("span");
            commentTime.classList.add("comment-time");
            commentTime.textContent = ` (${comment.createdAt})`;
            commentElement.appendChild(commentTime);

            // 수정/삭제 버튼들을 담는 컨테이너
            const actionsContainer = document.createElement("div");
            actionsContainer.classList.add("comment-actions");

            // 수정 버튼
            const editButton = document.createElement("button");
            editButton.textContent = "수정";
            editButton.classList.add("edit-comment");
            editButton.addEventListener("click", function () {
                editComment(index);
            });
            actionsContainer.appendChild(editButton);

            // 삭제 버튼
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
        // 댓글을 객체로 저장 (내용과 등록 시간 포함)
        const newComment = {
            text: commentText,
            createdAt: new Date().toLocaleString("ko-KR")
        };
        post.comments.push(newComment);
        localStorage.setItem("posts", JSON.stringify(posts));
        renderComments();
        commentInput.value = "";
    });

    // 댓글 수정: 모달 창을 통한 수정 기능 (입력창과 동일한 디자인 적용)
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

    // 게시글 수정 버튼 이벤트 (게시글 수정 페이지로 이동)
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

document.addEventListener('DOMContentLoaded', function() {
    // 기존 게시글 데이터 로딩 등 기타 코드...
  
    // 수정 버튼 기능 추가
    const editButton = document.getElementById('edit-button');
    const postContentDiv = document.getElementById('post-content');
  
    editButton.addEventListener('click', function() {
      // 현재 게시글 내용(HTML)을 보관 (취소 시 사용)
      const originalContent = postContentDiv.innerHTML;
  
      // 현재 내용을 textarea로 복사
      const textarea = document.createElement('textarea');
      textarea.id = 'edit-textarea';
      textarea.value = postContentDiv.textContent.trim(); // textContent를 사용하여 순수 텍스트 복사
  
      // 저장 및 취소 버튼 생성
      const saveButton = document.createElement('button');
      saveButton.textContent = '저장';
      saveButton.className = 'button';
      
      const cancelButton = document.createElement('button');
      cancelButton.textContent = '취소';
      cancelButton.className = 'button';
  
      // 버튼을 담을 컨테이너 생성
      const actionDiv = document.createElement('div');
      actionDiv.className = 'edit-actions';
      actionDiv.appendChild(saveButton);
      actionDiv.appendChild(cancelButton);
  
      // 게시글 내용 영역을 비우고 textarea와 액션 버튼 추가
      postContentDiv.innerHTML = '';
      postContentDiv.appendChild(textarea);
      postContentDiv.appendChild(actionDiv);
  
      // 저장 버튼 클릭 시: textarea 내용을 게시글 내용으로 업데이트
      saveButton.addEventListener('click', function() {
        const updatedContent = textarea.value.trim();
        // 여기서 서버 전송 등의 추가 작업 가능
        postContentDiv.innerHTML = updatedContent;
      });
  
      // 취소 버튼 클릭 시: 원래 내용 복원
      cancelButton.addEventListener('click', function() {
        postContentDiv.innerHTML = originalContent;
      });
    });
  });
  
  document.addEventListener('DOMContentLoaded', () => {
    // localStorage에서 저장된 게시글 데이터 불러오기
    const savedPost = localStorage.getItem('postData');
    if (savedPost) {
      const postData = JSON.parse(savedPost);
      document.getElementById('post-title').innerText = postData.title;
      document.getElementById('post-content').innerText = postData.content;
      // 필요한 경우 다른 요소(작성자, 날짜 등)도 업데이트 가능
    }
    
    // 수정 버튼 클릭 시, 게시글 수정 페이지로 이동
    const editButton = document.getElementById('edit-button');
    if (editButton) {
      editButton.addEventListener('click', () => {
        window.location.href = '/posts/post-edit.html';
      });
    }
  });
  