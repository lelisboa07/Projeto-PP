// Cadastro do usuário
const form = document.querySelector('.form')
form?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const response = await fetch('http://localhost:3000/usuario/cadastro', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  });

  const result = await response.json();

  if (result.success) {
    alert("Cadastro concluído!");
    localStorage.setItem('usuario', JSON.stringify({id: result.results.insertId}))
    window.location.href = 'principal.html'
  } else {
    alert("Cadastro não concluído!");
  }
});

// Editar usuário
const formEdit = document.querySelector('.formEdit')
if (formEdit) {
  const usuario = JSON.parse(localStorage.getItem('usuario'))

  if (usuario) {
    if (usuario.name) {
      document.getElementById('name').value = usuario.name
    }
    if (usuario.email) {
      document.getElementById('email').value = usuario.email
    }
    if (usuario.password) {
      document.getElementById('password').value = usuario.password
    }
  }

  formEdit.addEventListener('submit', async (e) => {
    e.preventDefault()

    if (usuario) {
      if (usuario.id) {
        const name = document.getElementById('name').value
        const email = document.getElementById('email').value
        const password = document.getElementById('password').value

        const response = await fetch(`http://localhost:3000/usuario/${usuario.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password })
        })

        const result = await response.json()

        if (result.success) {
          alert("Usuário editado com sucesso!")
          localStorage.setItem('usuario', JSON.stringify({
            id: usuario.id,
            name: name,
            email: email,
            password: password
          }))
          window.location.href = 'perfil.html'
        } else {
          alert("Erro ao editar usuário!")
        }
      }
    } else {
      alert("Usuário não encontrado!")
    }
  })
}

// Deletar usuário
const btnDeletar = document.getElementById('btn-deletar')
if (btnDeletar) {
  btnDeletar.addEventListener('click', async () => {
    const usuario = JSON.parse(localStorage.getItem('usuario'))

    if (usuario && usuario.id) {
      const confirmacao = confirm("Tem certeza que deseja deletar seu perfil?")
      
      if (confirmacao) {
        const response = await fetch(`http://localhost:3000/usuario/${usuario.id}`, {
          method: 'DELETE'
        })
  
        const result = await response.json()
  
        if (result.success) {
          alert("Usuário deletado com sucesso!")
          localStorage.removeItem('usuario')
          window.location.href = 'index.html'
        } else {
          alert("Erro ao deletar usuário!")
        }
      }
    }
  })
}


// Login do usuário
const formLogin = document.querySelector('.formLogin')
formLogin?.addEventListener('submit', async (e) => {
  e.preventDefault()

  const name = document.getElementById('name').value
  const password = document.getElementById('password').value

  const response = await fetch('http://localhost:3000/usuario/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, password })
  })

  const result = await response.json()

  if (result.success) {
    localStorage.setItem('usuario', JSON.stringify(result.data))
    console.log(result)
    alert("Login concluído!");
    window.location.href = 'principal.html'
  } else {
    alert("Usuário ou senha incorreta!");
  }
})

// Logout
const btnSair = document.getElementById('btn-sair')
if (btnSair) {
  btnSair.addEventListener('click', () => {
    const usuario = JSON.parse(localStorage.getItem('usuario'))

    if (usuario) {
      localStorage.removeItem('usuario')
      alert("Você saiu da conta.")
      window.location.href = 'login.html' // volta para tela de login
    } else {
      alert("Nenhum usuário logado!")
    }
  })
}

// =============================================
// ADIÇÃO ÀS ROTAS DO FÓRUM
// =============================================

// Listar posts de UM usuário específico
app.get('/forum/posts/user/:userId', (req, res) => {
  const { userId } = req.params;

  const query = `
      SELECT 
          p.id, 
          p.content, 
          p.created_at, 
          u.name AS user_name,
          (SELECT COUNT(*) FROM likes l WHERE l.post_id = p.id) AS like_count
      FROM posts p
      JOIN usuario u ON p.user_id = u.id
      WHERE p.user_id = ?
      ORDER BY p.created_at DESC
  `;

  connection.query(query, [userId], (err, results) => {
      if (err) {
          return res.status(500).json({ success: false, err, message: 'Erro ao buscar posts do usuário' });
      }
      res.json({ success: true, posts: results });
  });
});