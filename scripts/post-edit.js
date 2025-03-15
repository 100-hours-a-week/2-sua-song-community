document.addEventListener("DOMContentLoaded", function () {
  // URL 파라미터에서 게시글 id 가져오기
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get("id");
  console.log("URL 파라미터 id:", postId);

  // localStorage에서 게시글 배열 불러오기 (없으면 빈 배열)
  let posts = JSON.parse(localStorage.getItem("posts")) || [];
  console.log("불러온 posts:", posts);

  // 해당 게시글 찾기 (id가 일치하는 게시글) → 문자열(postId)를 숫자로 변환하여 비교
  const postIndex = posts.findIndex(p => p.id === Number(postId));
  if (postIndex === -1) {
    alert("게시글을 찾을 수 없습니다.");
    window.location.href = "/posts/posts.html";
    return;
  }
  const post = posts[postIndex];
  console.log("찾은 게시글:", post);

  // 수정 폼 필드에 기존 게시글 데이터 채우기
  document.getElementById("edit-title").value = post.title;
  document.getElementById("edit-content").value = post.content;

  // 현재 이미지가 있다면 해당 영역에 이미지 태그 삽입
  if (post.image) {
    document.getElementById("current-image").innerHTML = `<img src="${post.image}" alt="게시글 이미지" class="post-image">`;
  } else {
    document.getElementById("current-image").innerHTML = `<p>이미지가 없습니다.</p>`;
  }

  // 수정 폼 제출 이벤트 처리
  const editForm = document.getElementById("editForm");
  editForm.addEventListener("submit", function (e) {
    e.preventDefault();
    // 입력값 가져오기
    const updatedTitle = document.getElementById("edit-title").value.trim();
    const updatedContent = document.getElementById("edit-content").value.trim();

    // 게시글 데이터 업데이트 (id는 그대로 유지)
    posts[postIndex].title = updatedTitle;
    posts[postIndex].content = updatedContent;

    // localStorage에 수정된 posts 배열 저장
    localStorage.setItem("posts", JSON.stringify(posts));

    alert("게시글 수정 완료!");
    // 수정 완료 후 상세보기 페이지로 이동 (id 유지)
    window.location.href = `/posts/post-detail.html?id=${postId}`;
  });

  // 취소 버튼 처리: 수정 취소 시 상세보기 페이지로 돌아감
  document.getElementById("cancelEdit").addEventListener("click", function () {
    window.location.href = `/posts/post-detail.html?id=${postId}`;
  });
});

