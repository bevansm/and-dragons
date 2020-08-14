ALTER USER 'root'@'localhost' IDENTIFIED
WITH mysql_native_password BY 'secret';
ALTER USER 'dragons'@'%' IDENTIFIED
WITH mysql_native_password BY 'dragons';
flush privileges;
CREATE TABLE
IF NOT EXISTS courses
(
	course_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	pl_course_id INT
);
CREATE TABLE
IF NOT EXISTS students
(
	student_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	course_id INT NOT NULL,
	last_seen TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	pl_id VARCHAR
(255),
	discord_id VARCHAR
(255),
	piazza_id VARCHAR
(255),
	FOREIGN KEY
(course_id) REFERENCES courses
(course_id) ON
DELETE CASCADE
);
CREATE TABLE
IF NOT EXISTS integrations
(
	integration_id VARCHAR
(255) NOT NULL PRIMARY KEY
);
CREATE TABLE
IF NOT EXISTS points_cache
(
	student_id INT NOT NULL,
	integration_id VARCHAR
(255) NOT NULL,
	timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	points INT DEFAULT 0,
	CONSTRAINT pk_point_cache PRIMARY KEY
(student_id, integration_id, timestamp),
	FOREIGN KEY
(student_id) REFERENCES students
(student_id) ON
DELETE CASCADE,
	FOREIGN KEY (integration_id)
REFERENCES integrations
(integration_id) ON
DELETE CASCADE
);
CREATE TABLE
IF NOT EXISTS points
(
	student_id INT NOT NULL,
	integration_id VARCHAR
(255) NOT NULL,
	points INT DEFAULT 0,
	CONSTRAINT pk_point PRIMARY KEY
(student_id, integration_id),
	FOREIGN KEY
(student_id) REFERENCES students
(student_id) ON
DELETE CASCADE,
	FOREIGN KEY (integration_id)
REFERENCES integrations
(integration_id) ON
DELETE CASCADE
);
CREATE TABLE
IF NOT EXISTS daily
(
	student_id INT NOT NULL PRIMARY KEY,
	last_daily TIMESTAMP DEFAULT NULL,
	num_dailies INT NOT NULL DEFAULT 0,
	FOREIGN KEY
	(student_id) REFERENCES students
	(student_id) ON
	DELETE CASCADE
);
