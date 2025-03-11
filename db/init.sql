-- Table Collection
CREATE TABLE Collection (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    createdAt DATETIME NOT NULL,
    modifiedAt DATETIME NOT NULL
);

-- Table Project
CREATE TABLE Project (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    coll_id INT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    createdAt DATETIME NOT NULL,
    modifiedAt DATETIME NOT NULL,
    FOREIGN KEY (coll_id) REFERENCES Collection(id) ON DELETE CASCADE
);

-- Table Post
CREATE TABLE Post (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    project_id INT NOT NULL,
    titre VARCHAR(255) NOT NULL,
    description TEXT,
    createdAt DATETIME NOT NULL,
    modifiedAt DATETIME NOT NULL,
    FOREIGN KEY (project_id) REFERENCES Project(id) ON DELETE CASCADE
);

-- Table Project_has_participated
CREATE TABLE Project_has_participated (
    us_part_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    project_id INT NOT NULL,
    FOREIGN KEY (project_id) REFERENCES Project(id) ON DELETE CASCADE
);

-- Table Post_has_voted
CREATE TABLE Post_has_voted (
    us_post_vote_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    post_id INT NOT NULL,
    FOREIGN KEY (post_id) REFERENCES Post(id) ON DELETE CASCADE,
    UNIQUE (user_id, post_id)
);

-- Table Comment
CREATE TABLE Comment (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    post_id INT NOT NULL,
    contenu TEXT NOT NULL,
    createdAt DATETIME NOT NULL,
    modifiedAt DATETIME NOT NULL,
    FOREIGN KEY (post_id) REFERENCES Post(id) ON DELETE CASCADE
);

-- Table Com_has_voted
CREATE TABLE Com_has_voted (
    us_com_vote_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    com_id INT NOT NULL,
    FOREIGN KEY (com_id) REFERENCES Comment(id) ON DELETE CASCADE,
    UNIQUE (user_id, com_id)
);

-- Table Media
CREATE TABLE Media (
    m_id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    comment_id INT NULL,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    path VARCHAR(255) NOT NULL,
    size INT NOT NULL,
    createdAt DATETIME NOT NULL,
    modifiedAt DATETIME NOT NULL,
    FOREIGN KEY (post_id) REFERENCES Post(id) ON DELETE CASCADE,
    FOREIGN KEY (comment_id) REFERENCES Comment(id) ON DELETE CASCADE
);
