USE dev_cda_project;

INSERT INTO project (user_id, participants, name, description, createdAt, modifiedAt) VALUES
('user1', NULL, 'Projet Alpha', 'Description du projet Alpha', NOW(), NOW()),
('user2', NULL, 'Projet Beta', 'Description du projet Beta', NOW(), NOW()),
('user3', '[{"email": "participant1@example.com"}, {"email": "participant2@example.com"}]', 'Projet Gamma', 'Description du projet Gamma', NOW(), NOW()),
('user4', '[{"email": "participant3@example.com"}, {"email": "participant4@example.com"}, {"email": "participant5@example.com"}]', 'Projet Delta', 'Description du projet Delta', NOW(), NOW()),
('user5', NULL, 'Projet Epsilon', 'Description du projet Epsilon', NOW(), NOW()),
('user6', NULL, 'Projet Zeta', 'Description du projet Zeta', NOW(), NOW()),
('user7', '[{"email": "participant6@example.com"}, {"email": "participant7@example.com"}]', 'Projet Eta', 'Description du projet Eta', NOW(), NOW()),
('user8', '[{"email": "participant8@example.com"}, {"email": "participant9@example.com"}, {"email": "participant10@example.com"}]', 'Projet Theta', 'Description du projet Theta', NOW(), NOW()),
('user9', NULL, 'Projet Iota', 'Description du projet Iota', NOW(), NOW()),
('user10', NULL, 'Projet Kappa', 'Description du projet Kappa', NOW(), NOW());
