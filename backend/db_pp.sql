CREATE DATABASE db_pp;
USE db_pp;

CREATE TABLE usuario(
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

insert into usuario (name, email, password) values ('julia', 'julia@email.com', '123');

select * from usuario;
