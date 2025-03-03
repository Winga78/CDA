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
    createdAt DATETIME NOT NULL
);

-- Table Collection
CREATE TABLE Collection (
    coll_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    createdAt DATETIME NOT NULL,
    modifiedAt DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE
);

-- Table Project
CREATE TABLE Project (
    project_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    coll_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    createdAt DATETIME NOT NULL,
    modifiedAt DATETIME NOT NULL,
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
    createdAt DATETIME NOT NULL,
    modifiedAt DATETIME NOT NULL,
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
    po_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE,
    FOREIGN KEY (po_id) REFERENCES Post(post_id) ON DELETE CASCADE,
    UNIQUE (user_id, post_id)
);

-- Table Comment
CREATE TABLE Comment (
    com_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    po_id INT NOT NULL,
    contenu TEXT NOT NULL,
    createdAt DATETIME NOT NULL,
    modifiedAt DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE,
    FOREIGN KEY (po_id) REFERENCES Post(post_id) ON DELETE CASCADE
);

-- Table Com_has_voted
CREATE TABLE Com_has_voted (
    us_com_vote_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    com_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE,
    FOREIGN KEY (com_id) REFERENCES Comment(com_id) ON DELETE CASCADE,
    UNIQUE (user_id, com_id)
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
    createdAt DATETIME NOT NULL,
    modifiedAt DATETIME NOT NULL,
    FOREIGN KEY (po_id) REFERENCES Post(post_id) ON DELETE SET NULL,
    FOREIGN KEY (com_id) REFERENCES Comment(com_id) ON DELETE SET NULL
);
