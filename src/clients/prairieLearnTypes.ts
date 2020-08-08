export interface PrairieLearnAssessment {
  type: string;
  title: string;
  assessment_id: number;
  assessment_name: string;
  assessment_label: string;
  assessment_number: string;
  assessment_set_id: number;
  assessment_order_by: number;
  assessment_set_name: string;
  assessment_set_color: string;
  assessment_set_number: number;
  assessment_set_heading: string;
  assessment_set_abbreviation: string;
}

export interface PrairieLearnAssessmentSummary {
  points?: number;
  max_points?: number;
  score_perc?: number;
  start_date?: Date;
  assessment_id: number;
  assessment_name: string;
  assessment_label: string;
  duration_seconds?: number;
  assessment_number: string;
  assessment_instance_id?: number;
  assessment_set_abbreviation: string;
}

export interface PrairieLearnGradebook {
  user_id: number;
  user_uid: string;
  user_name: string;
  user_role: string;
  assessments: PrairieLearnAssessmentSummary[];
}

export interface PrairieLearnSubmission {
  date: string;
  mode: string;
  score: number;
  credit: number;
  params: any;
  grading_requested_at?: any;
  instance_question_id: number;
  assessment_instance_id: number;
  instance_question_number?: any;
  instance_question_points: number;
  assessment_instance_number: number;
  best_submission_per_variant: boolean;
  final_submission_per_variant: boolean;
  instance_question_score_perc: number;
  assessment_question_max_points: number;
}
