-- Inserting users
INSERT INTO user (pseudo, email, password, admin) VALUES
('admin', 'admin@example.com', '$2b$10$dRnN3Vu3Is6W3QnmxgA//OwZ98optj1zruweMups7fFb.6qe8s906', 1),
('user2', 'user2@example.com', 'password2', 0),
('user', 'user@example.com', 'password', 0),
('user3', 'user3@example.com', 'password3', 0);

-- Inserting topics
INSERT INTO topic (name, id_user) VALUES
('Technology', 1),
('Science', 2),
('Movies', 3),
('Travel', 4);

-- Inserting threads
INSERT INTO thread (name, date, id_user, id_topic) VALUES
('Best Programming Languages', '2023-08-09', 1, 1),
('Latest Discoveries', '2023-08-08', 2, 2),
('Favorite Action Movies', '2023-08-07', 3, 3),
('Bucket List Destinations', '2023-08-06', 4, 4);

-- Inserting messages
INSERT INTO message (content, date, id_user, id_thread) VALUES
('I think Python is the best language!', '2023-08-09', 1, 1),
('Have you heard about the new space findings?', '2023-08-08', 2, 2),
('Die Hard is my all-time favorite!', '2023-08-07', 3, 3),
('Machu Picchu is on my travel bucket list.', '2023-08-06', 4, 4);

-- Adding more messages to existing threads
-- Thread 1: Best Programming Languages
INSERT INTO message (content, date, id_user, id_thread) VALUES
('I agree, Python is versatile!', '2023-08-09', 2, 1),
('But Java has great performance.', '2023-08-09', 1, 1),
('JavaScript is essential for web dev.', '2023-08-09', 3, 1),
('Ruby is elegant and easy to read.', '2023-08-09', 4, 1);

-- Thread 2: Latest Discoveries
INSERT INTO message (content, date, id_user, id_thread) VALUES
('The black hole discovery was amazing!', '2023-08-08', 1, 2),
('Im excited about the Mars mission.', '2023-08-08', 3, 2),
('The new medical breakthrough is promising.', '2023-08-08', 4, 2),
('Science never fails to amaze us!', '2023-08-08', 2, 2);

-- Thread 3: Favorite Action Movies
INSERT INTO message (content, date, id_user, id_thread) VALUES
('Die Hard is a classic for sure.', '2023-08-07', 1, 3),
('Mission Impossible series is fantastic!', '2023-08-07', 2, 3),
('John Wick movies have intense action.', '2023-08-07', 3, 3),
('Mad Max: Fury Road is a visual spectacle.', '2023-08-07', 4, 3);

-- Thread 4: Bucket List Destinations
INSERT INTO message (content, date, id_user, id_thread) VALUES
('Santorini, Greece is breathtaking.', '2023-08-06', 2, 4),
('I dream of visiting Kyoto, Japan.', '2023-08-06', 1, 4),
('African safari would be a unique experience.', '2023-08-06', 3, 4),
('New Zealand for its stunning landscapes!', '2023-08-06', 4, 4);
