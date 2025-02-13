-- Table User
CREATE TABLE User (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    firstname VARCHAR(100) NOT NULL,
    lastname VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    birthday DATE NOT NULL,
    avatar VARCHAR(255),
    role ENUM('admin', 'user') NOT NULL DEFAULT 'user',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table Collection
CREATE TABLE Collection (
    coll_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modifiedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE
);

-- Table Project
CREATE TABLE Project (
    project_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    coll_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modifiedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE,
    FOREIGN KEY (coll_id) REFERENCES Collection(coll_id) ON DELETE CASCADE
);

-- Table Post
CREATE TABLE Post (
    post_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    project_id INT NOT NULL,
    titre VARCHAR(255) NOT NULL,
    description TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modifiedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE,
    FOREIGN KEY (project_id) REFERENCES Project(project_id) ON DELETE CASCADE
);

-- Table Project_has_participated
CREATE TABLE Project_has_participated (
    us_part_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    project_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE,
    FOREIGN KEY (project_id) REFERENCES Project(project_id) ON DELETE CASCADE
);

-- Table Post_has_voted
CREATE TABLE Post_has_voted (
    us_post_vote_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    post_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES Post(post_id) ON DELETE CASCADE
);

-- Table Comment
CREATE TABLE Comment (
    com_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    po_id INT NOT NULL,
    contenu TEXT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modifiedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE,
    FOREIGN KEY (po_id) REFERENCES Post(post_id) ON DELETE CASCADE
);

-- Table Com_has_voted
CREATE TABLE Com_has_voted (
    us_com_vote_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    com_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE,
    FOREIGN KEY (com_id) REFERENCES Comment(com_id) ON DELETE CASCADE
);

-- Table Media
CREATE TABLE Media (
    m_id INT AUTO_INCREMENT PRIMARY KEY,
    po_id INT,
    com_id INT,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    path VARCHAR(255) NOT NULL,
    size INT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modifiedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (po_id) REFERENCES Post(post_id) ON DELETE SET NULL,
    FOREIGN KEY (com_id) REFERENCES Comment(com_id) ON DELETE SET NULL
);


-- Inserting sample data
INSERT INTO User (firstname, lastname, email, password, birthday, role) VALUES
('Admin1', 'User', 'admin1@example.com', 'hashedpassword', '1990-01-01','admin'),
('Admin2', 'User', 'admin2@example.com', 'hashedpassword', '1985-05-15','admin'),
('John', 'Doe', 'john@example.com', 'hashedpassword', '1992-07-20','user'),
('Jane', 'Smith', 'jane@example.com', 'hashedpassword', '1995-09-10','user'),
('Alice', 'Brown', 'alice@example.com', 'hashedpassword', '1988-03-25','user');

INSERT INTO Collection (user_id, name) VALUES
(1, 'Collection A'),
(2, 'Collection B'),
(3, 'Collection C'),
(4, 'Collection D'),
(5, 'Collection E');

INSERT INTO Project (user_id, coll_id, name, description) VALUES
(1, 1, 'Project X', 'Description X'),
(2, 2, 'Project Y', 'Description Y'),
(1, 3, 'Project Z', 'Description Z'),
(2, 4, 'Project W', 'Description W'),
(1, 5, 'Project V', 'Description V');