export type Activity = {
  id: string;
  course_id: string;
  module_id: string;
  title: string;
  description: string | null;
  estimated_minutes: number | null;
  is_published: boolean;
};

export type ActivityBlock = {
  id: string;
  activity_id: string;
  order_index: number;
  block_type: string;
  content_json: unknown;
  is_required: boolean;
  is_published: boolean;
};

export type BlockSubmission = {
  user_id: string;
  block_id: string;
  status: "draft" | "submitted";
  submission_json: unknown;
  saved_at: string;
  submitted_at: string | null;
};
