export interface Student {
  student_id: number;
  course_id: number;
  last_seen: string;
  pl_id: string;
  discord_id: string;
  piazza_id: string;
}

export interface Course {
  course_id: number;
  pl_course_id: number;
}

export enum Integration {
  PL = 'PL',
  DISCORD = 'DISCORD',
  PIAZZA = 'PIAZZA',
}

export interface Score {
  student_id: number;
  integration_id: string;
  points: number;
}

export interface CachedScore extends Score {
  timestamp: string;
}

export interface IDataClient {
  /**
   * This will close the connection with the db.
   *
   * Do not call unless you know what you're doing.
   * We're using a single connection for a majority of this.
   */
  destroy: () => void;

  /**
   * Adds a course & returns the course id. Provide all fields for the course object except for id.
   */
  addCourse: (course: Omit<Course, 'course_id'>) => Promise<number>;

  /**
   * Adds a student & returns their id. Provide all fields from the student object except for id.
   */
  addStudent: (student: Omit<Student, 'student_id'>) => Promise<number>;

  /**
   * Deletes a student.
   */
  deleteStudent: (studentId: number) => Promise<Student>;

  /**
   * Given a set of attributes for a student, returns
   * the all student that match the given query.
   *
   * Note that two "students" with the same ID can have different
   * course codes. Please provide the course code if you care about
   * specificity.
   */
  getStudents: (student: Partial<Student>) => Promise<Student[]>;

  /**
   * Returns all students in the given course.
   */
  getStudentsByCourse: (courseId: number) => Promise<Student[]>;

  /**
   * Returns all cached scores associated with the given student.
   */
  getCachedScoresByStudent: (
    studentId: number,
    integration?: Integration
  ) => Promise<CachedScore[]>;

  /**
   * Returns all score associated with the given student.
   */
  getScoresByStudent: (
    studentId: number,
    integration?: Integration
  ) => Promise<Score[]>;

  /**
   * Returns all cached scores associated with the given course ID and integration.
   */
  getCachedScoresByCourse: (
    courseId: number,
    integration?: Integration
  ) => Promise<CachedScore[]>;

  /**
   * Returns all scores associated with a given course & integration.
   */
  getScoresByCourse: (
    courseId: number,
    integration?: Integration
  ) => Promise<Score[]>;

  /**
   * Updates the given student's score for the given integration
   * by x points, and returns the updated score value.
   * @param studentId The student's ID
   * @param integration The destination integration
   * @param points The number of points to increase/decrease the student's score by
   */
  updateScore: (
    studentId: number,
    integration: Integration,
    points: number
  ) => Promise<number>;
}

export default IDataClient;
