document.addEventListener("DOMContentLoaded", function () {
    // 이벤트 처리 
    
    // 게시글 작성 버튼 클릭 이벤트
    const createBtn = document.getElementById("create-post-btn");
    if (createBtn) {
      createBtn.addEventListener("click", function () {
        // 게시글 작성 페이지로 이동 (또는 모달 오픈)
        window.location.href = "post-create.html";
      });
    }
    
    // 댓글 작성 이벤트 처리 (예시)
    const commentBtn = document.getElementById("comment-button");
    if (commentBtn) {
      commentBtn.addEventListener("click", function () {
        const commentInput = document.getElementById("comment-input");
        const commentText = commentInput.value.trim();
        if (commentText === "") {
          alert("댓글을 입력해주세요.");
          return;
        }
        // 예시로 콘솔에 댓글 내용을 출력합니다.
        console.log("댓글 제출됨:", commentText);
        // 실제 로직에서는 localStorage에 댓글 추가 혹은 UI 업데이트 로직을 넣습니다.
        commentInput.value = "";  // 입력창 초기화
      });
    }
    
    //  Fetch API 적용 
    
    // 임의의 서버에 요청한다고 가정하여 /data/remotePosts.json 파일에서 데이터를 불러옵니다.
    // 이 JSON 파일은 예를 들어 아래와 같은 구조로 되어 있다고 가정:
    // [
    //   { "id": 101, "title": "Remote Post 1", "content": "This is remote content 1." },
    //   { "id": 102, "title": "Remote Post 2", "content": "This is remote content 2." }
    // ]

    fetch("/data/remotePosts.json")
      .then(response => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then(remotePosts => {
        console.log("Fetched remote posts:", remotePosts);
        // remotePosts 데이터를 표시할 컨테이너가 HTML에 있다고 가정합니다.
        // 예를 들어, posts 목록 아래쪽에 id="remote-posts"인 div가 있다면...
        const remoteContainer = document.getElementById("remote-posts");
        if (remoteContainer) {
          remoteContainer.innerHTML = "";  // 초기화
          remotePosts.forEach(post => {
            const postDiv = document.createElement("div");
            postDiv.className = "remote-post-item";
            postDiv.innerHTML = `
              <h3>${post.title}</h3>
              <p>${post.content}</p>
            `;
            // 클릭 시 상세 페이지로 이동하는 예시 (필요 시)
            postDiv.addEventListener("click", function () {
              window.location.href = `post-detail.html?id=${post.id}`;
            });
            remoteContainer.appendChild(postDiv);
          });
        }
      })
      .catch(error => {
        console.error("Error fetching remote posts:", error);
      });
  });
  