declare module 'piazza-api' {
  interface Class {}

  interface Question {}

  interface PostOptions {
    bypass_email: boolean;
    folders: string[];
    anonymous: string;
  }

  type PostFunction = (
    classId: string,
    postTitle: string,
    postContent: string,
    options: PostOptions
  ) => void;

  // TODO: finish all of this.
  interface User {
    id: string;
    name: string;
    email: string;
    roles: { [key: string]: string };
    classIds: string[];
    classes: Class[];
    lastSeenClass: Class;
    getClassById: (id: string) => Class;
    getClassesByRole: (role: string) => Class[];
    isTakingClass: (className: string) => boolean;
    postNote: PostFunction;
    postQuestion: PostFunction;
    answerQuestion: (
      question: Question,
      answer: string,
      options: { anonymous: boolean }
    ) => void;
  }

  export function login(username: string, password: string): Promise<User>;
}
