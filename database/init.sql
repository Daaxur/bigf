ALTER USER 'root' IDENTIFIED WITH mysql_native_password BY 'root';
DROP DATABASE IF EXISTS bigf;

CREATE DATABASE bigf;

USE bigf;

CREATE TABLE user(
        id Int Auto_increment NOT NULL,
        pseudo Varchar (70) NOT NULL,
        email Varchar (255) NOT NULL,
        password Varchar (70) NOT NULL,
        admin TinyINT NOT NULL,
        CONSTRAINT user_PK PRIMARY KEY (id)
) ENGINE = InnoDB;

CREATE TABLE topic(
    id Int Auto_increment NOT NULL,
    name Varchar (255) NOT NULL,
    id_user Int NOT NULL,
    CONSTRAINT topic_PK PRIMARY KEY (id),
    CONSTRAINT topic_user_FK FOREIGN KEY (id_user) REFERENCES user(id) ON DELETE CASCADE
) ENGINE = InnoDB;

CREATE TABLE thread(
    id Int Auto_increment NOT NULL,
    name Varchar (255) NOT NULL,
    date Date NOT NULL,
    id_user Int NOT NULL,
    id_topic Int NOT NULL,
    CONSTRAINT thread_PK PRIMARY KEY (id),
    CONSTRAINT thread_user_FK FOREIGN KEY (id_user) REFERENCES user(id) ON DELETE CASCADE,
    CONSTRAINT thread_topic0_FK FOREIGN KEY (id_topic) REFERENCES topic(id) ON DELETE CASCADE
) ENGINE = InnoDB;

CREATE TABLE message(
    id Int Auto_increment NOT NULL,
    content Varchar (255) NOT NULL,
    date Date NOT NULL,
    id_user Int NOT NULL,
    id_thread Int NOT NULL,
    CONSTRAINT message_PK PRIMARY KEY (id),
    CONSTRAINT message_user_FK FOREIGN KEY (id_user) REFERENCES user(id) ON DELETE CASCADE,
    CONSTRAINT message_thread0_FK FOREIGN KEY (id_thread) REFERENCES thread(id) ON DELETE CASCADE
) ENGINE = InnoDB;
