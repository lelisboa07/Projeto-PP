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

insert into usuario (name, email, password) values ('julia', 'julia@email.com', '123');

select * from usuario;