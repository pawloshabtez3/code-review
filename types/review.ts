export type ReviewResponse = {
  summary: string;
  bugs: string[];
  performance: string[];
  security: string[];
  improvements: string[];
};

export type ReviewRequest = {
  code: string;
  language: string;
};
