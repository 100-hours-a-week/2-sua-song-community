document.addEventListener("DOMContentLoaded", function () {
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
  
        const posts = JSON.parse(localStorage.getItem("posts")) || [];
        const newPost = {
          id: Date.now(),
          title: title,
          content: content,
          image: uploadedImage,
          likes: 0,
          likedBy: [],
          views: 0,
          comments: [],
          createdAt: new Date().toLocaleString("ko-KR")
        };
  
        posts.unshift(newPost);
        localStorage.setItem("posts", JSON.stringify(posts));
  
        alert("게시글이 등록되었습니다.");
        window.location.href = "/posts/posts.html";
      });
    }
  
    // -- 게시글 목록 페이지 처리 --
    const postsContainer = document.getElementById("post-list");
    if (postsContainer) {
      let posts = JSON.parse(localStorage.getItem("posts")) || [];
      // 필터링: 게시글 객체에 필수 값이 있는지 확인
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
            <small>${post.createdAt}</small>
          `;
          postElement.addEventListener("click", function () {
            window.location.href = `post-detail.html?id=${post.id}`;
          });
          postsContainer.appendChild(postElement);
        });
      }
    }
  });
  