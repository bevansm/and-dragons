import { IntegrationEnum } from '../integrations/IIntegration';

export interface Student {
  student_id: number;
  course_id: number;
  last_seen: string;
  pl_id: string;
  discord_id: string;
  piazza_id: string;
}

export const IntegrationFields: { [key in IntegrationEnum]: keyof Student } = {
  [IntegrationEnum.DISCORD]: 'discord_id',
  [IntegrationEnum.PIAZZA]: 'piazza_id',
  [IntegrationEnum.PL]: 'pl_id',
};

export interface Course {
  course_id: number;
  pl_course_id: number;
  pl_last_checked: string;
}

export interface Score {
  student_id: number;
  integration_id: string;
  points: number;
}

export interface CachedScore extends Score {
  timestamp: string;
}
