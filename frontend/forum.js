// forum.js
document.addEventListener('DOMContentLoaded', () => {

    const API_URL = 'http://localhost:3000'; // URL do seu servidor
    const postsContainer = document.getElementById('posts-container');
    const postContentInput = document.getElementById('post-content-input');
    const submitPostBtn = document.getElementById('submit-post-btn');

    let loggedInUser = null;
    try {
        loggedInUser = JSON.parse(localStorage.getItem('usuario'));
    } catch (e) {
        console.error('Nenhum usuário logado encontrado.', e);
    }

    if (!loggedInUser || !loggedInUser.id) {
        alert('Você precisa estar logado para ver o fórum.');
        window.location.href = 'login.html'; // Mude para sua página de login
        return;
    }

    async function loadPosts() {
        try {
            const response = await fetch(`${API_URL}/forum/posts`);
            const data = await response.json();
            if (!data.success) throw new Error(data.message);

            postsContainer.innerHTML = ''; 
            for (const post of data.posts) {
                const postElement = createPostElement(post);
                postsContainer.appendChild(postElement);
                await loadComments(post.id, postElement.querySelector('.comments-list'));
            }
        } catch (err) {
            console.error('Erro ao carregar posts:', err);
            postsContainer.innerHTML = '<p>Erro ao carregar posts.</p>';
        }
    }

    function createPostElement(post) {
        // Usa a classe .section que já existe no seu CSS
        const postCard = document.createElement('div');
        postCard.className = 'section post-card'; 
        postCard.dataset.postId = post.id;

        postCard.innerHTML = `
            <h5 class="post-author">${post.user_name}</h5>
            <p class="post-content">${post.content}</p>
            <div class="div-acoes">
                <button class="like-btn">❤️</button>
                <span class="like-count">${post.like_count}</span>
            </div>
            
            <div class="comments-section">
                <h6>Comentários</h6>
                <div class="comments-list"></div>
                <div class="comment-form">
                    <input type="text" class="comment-input" placeholder="Escreva um comentário...">
                    <button class="comment-submit-btn button-form">Comentar</button>
                </div>
            </div>
        `;

        postCard.querySelector('.like-btn').addEventListener('click', () => handleLike(post.id));
        
        postCard.querySelector('.comment-submit-btn').addEventListener('click', () => {
            const commentInput = postCard.querySelector('.comment-input');
            handleComment(post.id, commentInput.value);
            commentInput.value = '';
        });

        return postCard;
    }

    async function loadComments(postId, commentsListElement) {
        try {
            const response = await fetch(`${API_URL}/forum/comments/${postId}`);
            const data = await response.json();
            if (!data.success) throw new Error(data.message);

            commentsListElement.innerHTML = '';
            if (data.comments.length === 0) {
                commentsListElement.innerHTML = '<p class="no-comments">Nenhum comentário ainda.</p>';
            }
            for (const comment of data.comments) {
                const commentElement = document.createElement('div');
                commentElement.className = 'comment';
                commentElement.innerHTML = `
                    <strong>${comment.user_name}:</strong>
                    <p>${comment.content}</p>
                `;
                commentsListElement.appendChild(commentElement);
            }
        } catch (err) {
            console.error(`Erro ao carregar comentários do post ${postId}:`, err);
        }
    }

    async function handleCreatePost() {
        const content = postContentInput.value.trim();
        if (!content) return;

        try {
            const response = await fetch(`${API_URL}/forum/post`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: content,
                    user_id: loggedInUser.id
                })
            });
            const data = await response.json();
            if (data.success) {
                postContentInput.value = '';
                loadPosts();
            } else {
                throw new Error(data.message);
            }
        } catch (err) {
            console.error('Erro ao criar post:', err);
        }
    }

    async function handleLike(postId) {
        try {
            const response = await fetch(`${API_URL}/forum/like`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    post_id: postId,
                    user_id: loggedInUser.id
                })
            });
            const data = await response.json();
            if (data.success) {
                const postCard = document.querySelector(`.post-card[data-post-id="${postId}"]`);
                const likeCountElement = postCard.querySelector('.like-count');
                let currentLikes = parseInt(likeCountElement.textContent);
                likeCountElement.textContent = data.message === 'Like adicionado' ? currentLikes + 1 : currentLikes - 1;
            } else {
                 throw new Error(data.message);
            }
        } catch (err) {
             console.error('Erro ao dar like:', err);
        }
    }

    async function handleComment(postId, content) {
        if (!content.trim()) return;

        try {
             const response = await fetch(`${API_URL}/forum/comment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    post_id: postId,
                    user_id: loggedInUser.id,
                    content: content
                })
            });
            const data = await response.json();
            if (data.success) {
                const postCard = document.querySelector(`.post-card[data-post-id="${postId}"]`);
                const commentsListElement = postCard.querySelector('.comments-list');
                loadComments(postId, commentsListElement);
            } else {
                throw new Error(data.message);
            }
        } catch (err) {
            console.error('Erro ao comentar:', err);
        }
    }

    submitPostBtn.addEventListener('click', handleCreatePost);
    loadPosts();
});