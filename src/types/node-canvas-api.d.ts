declare module 'node-canvas-api' {
  interface CustomColumn {
    // The ID of the custom gradebook column
    id: number;
    // When true, this column's visibility will be toggled in the Gradebook when a
    // user selects to show or hide notes
    teacher_notes: boolean;
    // header text
    title: string;
    // column order
    position: number;
    // won't be displayed if hidden is true
    hidden: boolean;
    // won't be editable in the gradebook UI
    read_only: boolean;
  }

  // Pull off methods from https://github.com/ubccapico/node-canvas-api/tree/master/src
  export function getSelf(): Promise<any>;
  export function createCustomGradebookColumn(
    courseId: number,
    columnTitle: string,
    columnPosition: number
  ): Promise<CustomColumn>;

  // We can use this to append in discord ids
  export function putStudentNumberInGradeColumn(
    courseId: number,
    gradebookColumnId: number,
    studentId: number,
    body: { 'column_data[content]': string }
  ): Promise<CustomColumn>;
}
