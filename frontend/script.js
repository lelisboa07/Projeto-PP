// const buttonLogin = document.querySelector('.button-form');
// const buttonLogout = document.querySelector('.button-logout');

// if (buttonLogin) {
//     buttonLogin.addEventListener('click', (e) => {
//         e.preventDefault();

//         window.location.href = 'principal.html';
// })};

// if (buttonLogout) {
//     buttonLogout.addEventListener('click', (e) => {
//         e.preventDefault();

//         window.location.href = 'login.html';
// })};


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