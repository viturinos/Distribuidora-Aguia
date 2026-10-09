create database if not exists agua;
use agua;

create table useer (
    id_user int auto_increment primary key,
    nome_completo varchar(250) not null,
    idade int not null,
    email varchar(150) unique not null,
    senha varchar(255) not null, 
    criado_em timestamp default current_timestamp,
    
    constraint chk_email_user check (email like '%@gmail.com')
);

create table funcionarios (
    id_funcionarios int auto_increment primary key,
    nome_completo varchar(250) not null,
    idade int not null,
    funcao enum('administrador') default 'administrador',
    email varchar(150) unique not null,
    senha varchar(255) not null,
    criado_em timestamp default current_timestamp,
    
    constraint chk_email_funcionario check (email like '%@gmail.com')
);

create table produtos (
    id_produtos int auto_increment primary key,
    nome_produto varchar(100) not null,
    descricao text,
    preco decimal(10, 2) not null default 0.00,
    categoria enum('pacoca', 'pipoca', 'doce', 'chocolate', 'goma', 'salgadinho', 'combos'),
    imagem_url varchar(250),
    criado_em timestamp default current_timestamp
);

create table pedidos (
    id_pedido int auto_increment primary key,
    id_user int not null, 
    id_funcionarios int null, 
    status enum('pendente', 'pago', 'em_preparo', 'enviado', 'entregue', 'cancelado') default 'pendente',
    valor_total decimal(10, 2) not null default 0.00,
    criado_em timestamp default current_timestamp,
    
    constraint fk_pedidos_user foreign key (id_user) references useer(id_user),
    constraint fk_pedidos_funcionario foreign key (id_funcionarios) references funcionarios(id_funcionarios)
);

create table itens_pedido (
    id_itens int auto_increment primary key,
    id_pedido int not null,
    id_produto int not null,
    quantidade int not null check (quantidade > 0),
    preco_unitario decimal(10, 2) not null,

    constraint fk_itens_pedido foreign key (id_pedido) references pedidos(id_pedido) on delete cascade,
    constraint fk_itens_produto foreign key (id_produto) references produtos(id_produtos)
);

show tables