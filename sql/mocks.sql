INSERT INTO courses (pl_course_id)
VALUES (1);
INSERT INTO students (course_id, discord_id)
VALUES (1, '160950267448131584');
INSERT INTO integrations (integration_id)
VALUES ('DISCORD'),
    ('PL'),
    ('PIAZZA');
INSERT INTO points (student_id, integration_id)
VALUES (1, 'DISCORD');