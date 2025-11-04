// perfil.js
document.addEventListener('DOMContentLoaded', () => {

    const API_URL = 'http://localhost:3000';

    // --- 1. Autenticação: Pegar usuário do localStorage ---
    let loggedInUser = null;
    try {
        loggedInUser = JSON.parse(localStorage.getItem('usuario'));
    } catch (e) {
        console.error('Erro ao buscar usuário:', e);
    }

    // Se não estiver logado, volta para a página de cadastro/login
    if (!loggedInUser || !loggedInUser.id) {
        alert('Você precisa estar logado para ver seu perfil.');
        window.location.href = 'index.html'; // Ou 'login.html'
        return;
    }

    // --- 2. Referências do DOM ---
    const btnSair = document.getElementById('btn-sair');
    const btnDeletar = document.getElementById('btn-deletar');
    const createPostForm = document.getElementById('create-post-form');
    const postContentInput = document.getElementById('publicacao');
    const userPostsContainer = document.getElementById('user-posts-container');

    // --- 3. Lógica dos Botões de Ação ---

    // Botão SAIR
    btnSair.addEventListener('click', () => {
        localStorage.removeItem('user');
        alert('Você saiu da sua conta.');
        window.location.href = 'login.html'; // Mude para sua página de login
    });

    // Botão DELETAR PERFIL
    btnDeletar.addEventListener('click', async () => {
        if (!confirm('TEM CERTEZA?\nIsso apagará permanentemente sua conta e todos os seus posts e comentários.')) {
            return;
        }

        try {
            const response = await fetch(`${API_URL}/usuario/${loggedInUser.id}`, {
                method: 'DELETE'
            });
            const data = await response.json();

            if (data.success) {
                localStorage.removeItem('user');
                alert('Conta deletada com sucesso.');
                window.location.href = 'index.html'; // Volta para a página de cadastro
            } else {
                throw new Error(data.message);
            }
        } catch (err) {
            console.error('Erro ao deletar conta:', err);
            alert('Não foi possível deletar sua conta.');
        }
    });

    // Formulário CRIAR POST
    createPostForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Impede o recarregamento da página
        const content = postContentInput.value.trim();

        if (!content) {
            alert('Seu post não pode estar vazio.');
            return;
        }

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
                postContentInput.value = ''; // Limpa o textarea
                loadUserPosts(); // Recarrega a lista de posts
            } else {
                throw new Error(data.message);
            }
        } catch (err) {
            console.error('Erro ao criar post:', err);
            alert('Não foi possível criar o post.');
        }
    });


    // --- 4. Lógica de Carregar Posts ---

    /**
     * Busca e exibe todos os posts do usuário logado
     */
    async function loadUserPosts() {
        try {
            const response = await fetch(`${API_URL}/forum/posts/user/${loggedInUser.id}`);
            const data = await response.json();
            
            if (!data.success) throw new Error(data.message);

            userPostsContainer.innerHTML = ''; // Limpa os posts antigos
            
            if (data.posts.length === 0) {
                 userPostsContainer.innerHTML = '<p style="text-align: center; padding: 20px;">Você ainda não criou nenhum post.</p>';
            }

            for (const post of data.posts) {
                const postElement = createPostElement(post);
                userPostsContainer.appendChild(postElement);
            }
        } catch (err) {
            console.error('Erro ao carregar posts do usuário:', err);
            userPostsContainer.innerHTML = '<p>Erro ao carregar seus posts.</p>';
        }
    }

    /**
     * Cria o elemento HTML para um post (reutilizando a lógica do forum.js)
     */
    function createPostElement(post) {
        // Cria um <section> com a classe "section" que você já estilizou
        const postCard = document.createElement('section');
        postCard.className = 'section post-card'; // Adiciona 'post-card' para CSS se precisar
        postCard.dataset.postId = post.id;

        // Preenche o HTML interno
        postCard.innerHTML = `
            <h4>@${post.user_name}</h4>
            <p>${post.content}</p>
            <hr>
            <div class="div-acoes">
                <button class="like-btn">❤️</button>
                <span class="like-count">${post.like_count}</span>
                </div>
        `;

        // Adiciona a funcionalidade de "like"
        postCard.querySelector('.like-btn').addEventListener('click', () => handleLike(post.id));

        return postCard;
    }

    /**
     * Cuida do clique no botão de "Like" (copiado do forum.js)
     */
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
                // Atualiza a contagem de likes na tela
                const postCard = document.querySelector(`.post-card[data-post-id="${postId}"]`);
                const likeCountElement = postCard.querySelector('.like-count');
                let currentLikes = parseInt(likeCountElement.textContent);
                
                if (data.message === 'Like adicionado') {
                    likeCountElement.textContent = currentLikes + 1;
                } else {
                    likeCountElement.textContent = currentLikes - 1;
                }
            } else {
                 throw new Error(data.message);
            }
        } catch (err) {
             console.error('Erro ao dar like:', err);
        }
    }

    // --- 5. Inicialização ---
    // Carrega os posts do usuário assim que a página é aberta
    loadUserPosts();
});