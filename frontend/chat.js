// chat.js
document.addEventListener('DOMContentLoaded', () => {

    const API_URL = 'http://localhost:3000'; 
    const SOCKET_URL = 'http://localhost:3000';

    let loggedInUser = null;
    try {
        loggedInUser = JSON.parse(localStorage.getItem('usuario'));
    } catch (e) {
        console.error('Nenhum usuário logado encontrado ou erro ao parsear:', e);
    }

    if (!loggedInUser || !loggedInUser.id) {
        alert('Você precisa estar logado para entrar no chat.');
        window.location.href = 'login.html'; // Mude para sua página de login
        return;
    }

    const socket = io(SOCKET_URL);

    // Referências do DOM
    const userListEl = document.getElementById('user-list');
    const chatAreaEl = document.getElementById('chat-area');
    const chatHeaderEl = document.getElementById('chat-with-header');
    const messagesEl = document.getElementById('messages');
    const chatFormEl = document.getElementById('chat-form');
    const chatInputEl = document.getElementById('chat-input');

    // Estado do Cliente
    let allMessages = new Map();
    let currentChatPartner = { id: null, username: null };
    let onlineUsersMap = new Map();

    // 2.1. Conecta e se registra no servidor
    socket.on('connect', () => {
        console.log('Conectado ao servidor, registrando...');
        socket.emit('register', { 
            userId: loggedInUser.id, 
            username: loggedInUser.name 
        });
    });

    // 2.2. Recebe a lista de usuários online
    socket.on('update user list', (usersArray) => {
        userListEl.innerHTML = '';
        onlineUsersMap.clear();
        console.log(usersArray);
        usersArray.forEach(user => {
            if (user.userId == loggedInUser.id) {
                return;
            }
            onlineUsersMap.set(user.userId, user);

            const userItem = document.createElement('div');
            userItem.className = 'user-list-item';
            userItem.textContent = user.username;
            userItem.dataset.userId = user.userId;
            
            userItem.addEventListener('click', () => {
                startChatWith(user.userId, user.username);
            });
            userListEl.appendChild(userItem);
        });
    });

    // 3.1. Recebe uma mensagem privada
    socket.on('private message', (data) => {
        const { senderId, senderUsername, message, recipientId } = data;
        console.log(data);
        const isMyOwnMessage = !!recipientId; 
        const partnerId = isMyOwnMessage ? recipientId : senderId;
        
        const messageText = isMyOwnMessage ? `Você: ${message}` : `${senderUsername}: ${message}`;
        const messageData = { 
            text: messageText, 
            type: isMyOwnMessage ? 'sent' : 'received' 
        };

        if (!allMessages.has(partnerId)) {
            allMessages.set(partnerId, []);
        }
        allMessages.get(partnerId).push(messageData);

        if (partnerId === currentChatPartner.id) {
            addMessageToUI(messageData);
        } else {
            const userItem = userListEl.querySelector(`.user-list-item[data-user-id="${partnerId}"]`);
            if (userItem) {
                userItem.classList.add('new-message-notification');
            }
        }
    });

    // 3.2. Envia uma mensagem
    chatFormEl.addEventListener('submit', (e) => {
        e.preventDefault();
        const message = chatInputEl.value.trim();
        if (message && currentChatPartner.id) {
            socket.emit('private message', {
                recipientId: currentChatPartner.id,
                message: message
            });
            chatInputEl.value = '';
        }
    });

    /**
     * Inicia um chat com um usuário e busca o histórico.
     */
    async function startChatWith(userId, username) {
        currentChatPartner = { id: userId, username: username };
        chatHeaderEl.textContent = `Conversando com ${username}`;
        chatFormEl.style.display = 'flex';
        messagesEl.innerHTML = '';

        const userItem = userListEl.querySelector(`.user-list-item[data-user-id="${userId}"]`);
        if (userItem) {
            userItem.classList.remove('new-message-notification');
        }

        allMessages.delete(userId); 
        await fetchHistory(userId); 

        const history = allMessages.get(userId) || [];
        history.forEach(addMessageToUI);
    }

    /**
     * Busca o histórico de chat com um usuário específico na API.
     */
    async function fetchHistory(partnerId) {
        try {
            const response = await fetch(`${API_URL}/chat/history/${loggedInUser.id}/${partnerId}`);
            const data = await response.json();
            if (!data.success) throw new Error(data.message);

            const historyMessages = [];
            data.history.forEach(msg => {
                const isMyOwnMessage = (msg.sender_id == loggedInUser.id);
                const messageText = isMyOwnMessage ? `Você: ${msg.message}` : `${msg.senderUsername}: ${msg.message}`;
                const messageData = {
                    text: messageText,
                    type: isMyOwnMessage ? 'sent' : 'received'
                };
                historyMessages.push(messageData);
            });
            allMessages.set(partnerId, historyMessages);
        } catch (err) {
            console.error('Erro ao buscar histórico:', err);
            messagesEl.innerHTML = '<li class="notification">Erro ao carregar histórico.</li>';
        }
    }

    /**
     * Adiciona uma única mensagem à tela do chat.
     */
    function addMessageToUI(messageData) {
        const item = document.createElement('li');
        item.className = messageData.type; // 'sent' ou 'received'
        item.textContent = messageData.text;
        messagesEl.appendChild(item);
        messagesEl.scrollTop = messagesEl.scrollHeight;
    }
});