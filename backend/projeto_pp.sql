create database projeto_pp;
use projeto_pp;

create table usuario(
    id int auto_increment primary key,
    name varchar(255) not null,
    email varchar(255) not null,
    password varchar(255) not null,
    seguidores int,
    imagemPerfil varchar(255),
    criado_em timestamp default current_timestamp
);

select * from usuario;

create table seguir(
	seguidor int,
    seguindo int,
    foreign key (seguidor) references usuario(id),
    foreign key (seguindo) references usuario(id)
 
);
create table publicacao(
	id int primary key auto_increment,
    conteudo varchar(255) not null,
    dataUpload timestamp default current_timestamp,
    url varchar(255) not null,
    curtidas int,
    usuario_id int,
	foreign key (usuario_id) references usuario(id)
);
create table comentario(
	id int primary key auto_increment,
	texto varchar(255) not null,
    dataEnvio timestamp default current_timestamp,
    publicacao int,
    usuario_id int,
    foreign key (publicacao) references publicacao(id),
    foreign key (usuario_id) references usuario(id)
);
create table chat(
	id int primary key auto_increment,
    usuario_id int,
    criadoEm timestamp default current_timestamp,
    foreign key (usuario_id) references usuario(id)
);
create table mensagem(
	id int primary key auto_increment,
    texto varchar(255),
    enviadoEm timestamp default current_timestamp
);

-- Tabela para os posts do fórum
CREATE TABLE posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES usuario(id) ON DELETE CASCADE
);

-- Tabela para os comentários do fórum
CREATE TABLE comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    user_id INT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES usuario(id) ON DELETE CASCADE
);

-- Tabela para os likes do fórum
CREATE TABLE likes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    user_id INT NOT NULL,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES usuario(id) ON DELETE CASCADE,
    UNIQUE KEY unique_like (post_id, user_id) 
);

-- Tabela para as mensagens privadas do chat
CREATE TABLE private_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sender_id INT NOT NULL,
    recipient_id INT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES usuario(id) ON DELETE CASCADE,
    FOREIGN KEY (recipient_id) REFERENCES usuario(id) ON DELETE CASCADE
);

insert into usuario (name, email, password) values ('julia', 'julia@email.com', '123');

select * from comments;