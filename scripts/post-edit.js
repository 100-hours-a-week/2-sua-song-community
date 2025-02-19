document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get("id");

    if (!postId) {
        alert("게시글을 찾을 수 없습니다.");
        window.location.href = "/posts/posts.html";
        return;
    }

    const posts = JSON.parse(localStorage.getItem("posts") || "[]");
    const postIndex = posts.findIndex(post => post.id == postId);

    if (postIndex === -1) {
        alert("게시글을 찾을 수 없습니다.");
        window.location.href = "/posts/posts.html";
        return;
    }

    const post = posts[postIndex];

    // ✅ 기존 제목과 내용 불러오기
    document.getElementById("edit-title").value = post.title;
    document.getElementById("edit-content").value = post.content;

    // ✅ 수정 완료 버튼 클릭 시 저장
    document.getElementById("post-edit-form").addEventListener("submit", function (event) {
        event.preventDefault(); // 기본 동작 방지

        const newTitle = document.getElementById("edit-title").value.trim();
        const newContent = document.getElementById("edit-content").value.trim();

        if (newTitle === "" || newContent === "") {
            alert("제목과 내용을 입력해주세요.");
            return;
        }

        // ✅ 게시글 수정
        posts[postIndex].title = newTitle;
        posts[postIndex].content = newContent;
        posts[postIndex].editedAt = new Date().toISOString(); // 수정 날짜 저장

        localStorage.setItem("posts", JSON.stringify(posts));

        // 📌 모달 표시
        showSuccessModal(postId);
    });
});

// ✅ 모달을 표시하는 함수
function showSuccessModal(postId) {
    // 기존 모달이 있으면 삭제
    const existingModal = document.querySelector(".modal-overlay");
    if (existingModal) {
        document.body.removeChild(existingModal);
    }

    // 모달 생성
    const modal = document.createElement("div");
    modal.className = "modal-overlay";
    modal.innerHTML = `
        <div class="modal">
            <div class="modal-title">게시글 수정 완료</div>
            <div class="modal-content">게시글이 성공적으로 수정되었습니다.</div>
            <div class="modal-buttons">
                <button class="modal-confirm">확인</button>
            </div>
        </div>
    `;

    // 모달을 문서에 추가
    document.body.appendChild(modal);
    modal.style.display = "flex"; // 표시

    // 확인 버튼 클릭 시 상세보기 페이지로 이동
    modal.querySelector(".modal-confirm").addEventListener("click", function () {
        document.body.removeChild(modal);
        window.location.href = `/posts/post-detail.html?id=${postId}`;
    });
}
