const express = require('express');
const cors = require('cors');
const connection = require('./db_config');
const app = express();

app.use(cors());
app.use(express.json());

const port = 3000;

app.get('/', (req, res) => {
    return res.send('Hello, World!')
})


// Cadastro do usuário
app.post('/usuario/cadastro', (req, res) => {
    const { name, email, password } = req.body;
    
    const query = 'INSERT INTO usuario (name, email, password) VALUES (?, ?, ?)'
    connection.query(query, [name, email, password], (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, err, message: 'Erro no servidor'})
        }
        res.status(201).json({success: true, results, message: 'Sucesso no cadastro!'})
    })
})


// Verificar usuário
app.get('/usuario', (req, res) => {

    const query = 'SELECT * FROM usuario'
    connection.query(query, (err, results) => {
        if(err) {
            return res.status(500).json({ success: false, err, message: 'Erro ao buscar usuário'})
        } 
        res.json({success: true, usuario: results})
    })
})


// Editar usuário
app.put('/usuario/:id', (req, res) => {
    const { id } = req.params
    const { name, email, password } = req.body

    const query = 'UPDATE usuario SET name = ?, email = ?, password = ? WHERE id = ?'
    connection.query(query, [name, email, password, id], (err) => {
        if (err) {
            return res.status(500).json({ success: false, err, message: 'Erro ao editar usuário'})
        }
        res.json({ success: true, message: 'Usuário editado com sucesso!' })
    })
})


// Deletar usuário
app.delete('/usuario/:id', (req, res) => {
    const { id } = req.params
    const query = 'DELETE FROM usuario WHERE id = ?'
    connection.query(query, [id], (err) => {
        if (err) {
            return res.status(500).json({ success: false, err, message: 'Erro ao deletar usuário' })
        }
        res.json({ success: true, message: 'Usuário deletado com sucesso' })
    })
})



// Login do usuário
app.post('/usuario/login', (req, res) => {
    const {name, password} = req.body

    const query = 'SELECT * FROM usuario WHERE name = ? AND password = ?'
    connection.query(query, [name, password], (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Erro no servidor!'})
    }

    if (results.length > 0) {
        res.json({ success: true, message: 'Sucesso no login!', data: results[0]})
    } else {
        res.json({ succes: false, message: 'Usuário ou senha incorretos!'})
    } 
    })
})

app.listen(port, () => console.log(`Server rodando na porta ${port}`))