export interface Tool {
  id: string;
  user_id: string;
  name: string;
  category: string;
  website: string | null;
  description: string | null;
  use_case: string | null;
  relevance_score: number;
  tags: string[];
  source_link: string | null;
  is_favorite: boolean;
  usage_count: number;
  created_at: string;
  updated_at: string;
}

export interface ToolFormData {
  name: string;
  category: string;
  website: string;
  description: string;
  use_case: string;
  relevance_score: number;
  tags: string[];
  source_link: string;
}

export const CATEGORIES = [
  'AI Tools',
  'Design Tools',
  'Dev Tools',
  'Productivity',
  'Marketing',
  'Data & Analytics',
  'Communication',
  'Finance',
  'Education',
  'Other',
] as const;

export type Category = (typeof CATEGORIES)[number];
