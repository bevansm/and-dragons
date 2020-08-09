import IDataClient, {
  Student,
  Integration,
  CachedScore,
  Score,
} from './IDataClient';

class DataClient implements IDataClient {
  public async getStudents(student: Partial<Student>): Promise<Student[]> {
    throw new Error('Not implemented');
  }

  public async getStudentsByCourse(courseId: number): Promise<Student[]> {
    throw new Error('Not implemented');
  }

  public async getCachedScoresByStudent(
    studentId: number,
    integration?: Integration
  ): Promise<CachedScore[]> {
    throw new Error('Not implemented');
  }

  public async getScoresByStudent(
    studentId: number,
    integration?: Integration
  ): Promise<Score[]> {
    throw new Error('Not implemented');
  }

  public async getCachedScoresByCourse(
    courseId: number,
    integration?: Integration
  ): Promise<CachedScore[]> {
    throw new Error('Not implemented');
  }

  public async getScoresByCourse(
    courseId: number,
    integration?: Integration
  ): Promise<Score[]> {
    throw new Error('Not implemented');
  }

  public async updateScore(
    studentId: number,
    integration: Integration,
    points: number
  ): Promise<Score> {
    throw new Error('Not implemented');
  }
}

export default DataClient;
