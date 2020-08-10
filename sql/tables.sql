CREATE TABLE IF NOT EXISTS courses (
	course_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	pl_course_id INT
);
CREATE TABLE IF NOT EXISTS students (
	student_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	course_id INT NOT NULL,
	last_seen TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	pl_id VARCHAR(255),
	discord_id VARCHAR(255),
	piazza_id VARCHAR(255),
	FOREIGN KEY (course_id) REFERENCES courses(course_id)
);
CREATE TABLE IF NOT EXISTS integrations (
	integration_id VARCHAR(255) NOT NULL PRIMARY KEY
);
CREATE TABLE IF NOT EXISTS points_cache (
	student_id INT NOT NULL,
	integration_id VARCHAR(255) NOT NULL,
	timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	points INT DEFAULT 0,
	CONSTRAINT pk_point_cache PRIMARY KEY (student_id, integration_id, timestamp),
	FOREIGN KEY (student_id) REFERENCES students(student_id),
	FOREIGN KEY (integration_id) REFERENCES integrations(integration_id)
);
CREATE TABLE IF NOT EXISTS points (
	student_id INT NOT NULL,
	integration_id VARCHAR(255) NOT NULL,
	points INT DEFAULT 0,
	CONSTRAINT pk_point PRIMARY KEY (student_id, integration_id),
	FOREIGN KEY (student_id) REFERENCES students(student_id),
	FOREIGN KEY (integration_id) REFERENCES integrations(integration_id)
);