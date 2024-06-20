CREATE DATABASE viajes_cdcd;

USE viajes;

-- Tabla: provincia
CREATE TABLE Provincia (
    id_provincia int NOT NULL AUTO_INCREMENT,
    nombre_provincia varchar(50) NOT NULL,
    CONSTRAINT Provincia_pk PRIMARY KEY (id_provincia)
);

-- Tabla: Destinos
CREATE TABLE Destinos (
    id_destino int NOT NULL AUTO_INCREMENT,
    name_destino varchar(50) NOT NULL,
    descripcion varchar(100) NOT NULL,
    id_provincia int NOT NULL,
    CONSTRAINT Destinos_pk PRIMARY KEY (id_destino),
    CONSTRAINT Destinos_Provincia_fk FOREIGN KEY (id_provincia) REFERENCES Provincia (id_provincia) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Tabla: Categorias
CREATE TABLE Categorias (
    id_categoria int NOT NULL AUTO_INCREMENT,
    nombre_categoria varchar(50) NOT NULL,
    CONSTRAINT Categorias_pk PRIMARY KEY (id_categoria)
);

-- Tabla intermedia para la relación muchos a muchos entre Destinos y Categorias
CREATE TABLE Destinos_Categorias (
    id_destino int NOT NULL,
    id_categoria int NOT NULL,
    CONSTRAINT Destinos_Categorias_pk PRIMARY KEY (id_destino, id_categoria),
    CONSTRAINT Destinos_Categorias_Destino_fk FOREIGN KEY (id_destino) REFERENCES Destinos (id_destino) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT Destinos_Categorias_Categoria_fk FOREIGN KEY (id_categoria) REFERENCES Categorias (id_categoria) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Tabla: Rol
CREATE TABLE Rol (
    id_rol int NOT NULL AUTO_INCREMENT,
    nombre_rol varchar(20) NOT NULL,
    CONSTRAINT Rol_pk PRIMARY KEY (id_rol)
);

-- Tabla: Usuario
CREATE TABLE Usuario (
    id_usuario int NOT NULL AUTO_INCREMENT,
    nombre varchar(50) NOT NULL,
    apellido varchar(50) NOT NULL,
    fecha_nacimiento date NOT NULL,
    domicilio_ciudad varchar(50) NOT NULL,
    domicilio_departamento varchar(50) NOT NULL,
    telefono varchar(20) NOT NULL,
    correo_electronico varchar(100) NOT NULL,
    id_rol int NOT NULL,
    CONSTRAINT Usuario_pk PRIMARY KEY (id_usuario),
    CONSTRAINT Usuario_Rol_fk FOREIGN KEY (id_rol) REFERENCES Rol (id_rol) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Tabla: Login
CREATE TABLE Login (
    id_login int NOT NULL AUTO_INCREMENT,
    usuario varchar(20) NOT NULL,
    contrasenia varchar(50) NOT NULL,
    id_usuario int NOT NULL,
    CONSTRAINT Login_pk PRIMARY KEY (id_login),
    CONSTRAINT Login_Usuario_fk FOREIGN KEY (id_usuario) REFERENCES Usuario (id_usuario) ON DELETE CASCADE ON UPDATE CASCADE
);
