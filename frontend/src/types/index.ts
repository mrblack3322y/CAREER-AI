// Type definitions for CareerAI

export interface User {
  id: number;
  email: string;
  full_name: string;
  is_admin: boolean;
}

export interface Profile {
  headline: string;
  degree: string;
  gpa: number;
  years_experience: number;
  location: string;
  preferred_locations: string;
  target_role: string;
  skills: string[];
  certifications_count: number;
  projects_count: number;
  resume_score: number;
  overall_readiness_score: number;
  readiness_breakdown?: {
    technical_skills: number;
    projects: number;
    resume_quality: number;
    assessments: number;
    experience: number;
    certifications_education: number;
  };
  readiness_tier?: string;
  assessment_scores?: {
    python: number;
    sql: number;
    ml: number;
    dsa: number;
    web: number;
    stats: number;
    aptitude: number;
  };
}

export interface EducationItem {
  id?: number;
  institution: string;
  degree: string;
  field_of_study: string;
  start_year: number;
  end_year: number;
  grade: string;
}

export interface ProjectItem {
  id?: number;
  title: string;
  description: string;
  tech_stack: string;
  github_url?: string;
  live_url?: string;
}

export interface CertificationItem {
  id?: number;
  name: string;
  issuing_org: string;
  issue_date: string;
  credential_url?: string;
}

export interface ExperienceItem {
  id?: number;
  company: string;
  role: string;
  location: string;
  start_date: string;
  end_date: string;
  description: string;
}

export interface FullProfileResponse {
  user: User;
  profile: Profile;
  education: EducationItem[];
  projects: ProjectItem[];
  certifications: CertificationItem[];
  experience: ExperienceItem[];
}

export interface CareerRecommendation {
  role: string;
  match_percentage: number;
  matched_skills: string[];
  missing_skills: string[];
  missing_high_priority: string[];
  cosine_similarity: number;
  ml_confidence: number;
  reasons: string[];
}

export interface SalaryEstimate {
  predicted_median_lpa: number;
  min_lpa: number;
  max_lpa: number;
  formatted_range: string;
  currency: string;
  contributing_factors: { factor: string; impact: string }[];
  confidence_interval: string;
}

export interface SkillGapAnalysis {
  target_role: string;
  skill_match_percentage: number;
  existing_skills_count: number;
  missing_skills_count: number;
  existing_skills: { skill: string; importance_weight: number; status: string }[];
  missing_skills: { skill: string; importance_weight: number; priority: string; status: string }[];
  recommended_learning_order: string[];
}

export interface ResumeAnalysis {
  ats_compatibility_score: number;
  score_label: string;
  total_words: number;
  extracted_skills: string[];
  matched_role_skills: string[];
  missing_keywords: string[];
  sections_detected: Record<string, boolean>;
  action_verbs_found: string[];
  has_quantifiable_metrics: boolean;
  strengths: string[];
  weaknesses: string[];
  target_role: string;
  recommendations: string[];
}

export interface Job {
  id: string;
  title: string;
  role: string;
  company: string;
  location: string;
  job_type: string;
  min_experience: number;
  max_experience: number;
  required_education: string;
  salary_min_lpa: number;
  salary_max_lpa: number;
  salary_range: string;
  required_skills: string[];
  description: string;
  posted_days_ago: number;
}

export interface JobMatch {
  job: Job;
  compatibility_score: number;
  matched_skills: string[];
  missing_skills: string[];
  match_reasons: string[];
  score_breakdown: {
    technical_skills_pts: number;
    experience_pts: number;
    education_pts: number;
    certifications_pts: number;
    projects_pts: number;
    location_pts: number;
  };
}

export interface Question {
  id: string;
  category: string;
  question: string;
  options: string[];
  difficulty: string;
}

export interface AssessmentReviewItem {
  id: string;
  question: string;
  category: string;
  selected_option: string;
  correct_option: string;
  is_correct: boolean;
  explanation: string;
}

export interface AssessmentSubmissionResult {
  total_questions: number;
  correct_count: number;
  incorrect_count: number;
  overall_score: number;
  category_performance: Record<string, number>;
  detailed_review: AssessmentReviewItem[];
}

export interface RoadmapWeek {
  week: number;
  title: string;
  skills: string[];
  priority: string;
  estimated_hours: number;
  current_level: string;
  target_level: string;
  recommended_action: string;
}

export interface LearningRoadmap {
  target_role: string;
  total_weeks?: number;
  total_phases?: number;
  capstone_project?: string;
  weeks?: RoadmapWeek[];
  phases?: {
    phase: string;
    title: string;
    skill: string;
    priority: string;
    focus: string;
    estimated_time: string;
  }[];
}

export interface MLMetricsReport {
  data_quality: {
    total_records: number;
    total_features: number;
    total_missing_values: number;
    duplicate_records: number;
    outlier_salaries_count: number;
    role_distribution: Record<string, number>;
    salary_summary: {
      mean: number;
      median: number;
      std: number;
      min: number;
      max: number;
    };
    experience_summary: {
      mean: number;
      max: number;
    };
  };
  classification: {
    models_evaluated: {
      model_name: string;
      accuracy: number;
      precision: number;
      recall: number;
      f1_score: number;
      confusion_matrix: {
        labels: string[];
        matrix: number[][];
      };
      per_class_metrics: Record<string, { precision: number; recall: number; f1_score: number; support: number }>;
    }[];
    best_model_name: string;
    best_f1_score: number;
    top_features: { feature: string; importance: number }[];
    classes: string[];
  };
  regression: {
    models_evaluated: {
      model_name: string;
      mae: number;
      rmse: number;
      r2_score: number;
      sample_count: number;
      mean_actual: number;
      mean_predicted: number;
    }[];
    best_model_name: string;
    best_r2_score: number;
    top_features: { feature: string; importance: number }[];
  };
  system_status: {
    models_loaded: boolean;
    classifier_type: string;
    regressor_type: string;
    total_tracked_skills: number;
  };
}
