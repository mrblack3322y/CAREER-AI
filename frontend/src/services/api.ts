/**
 * CareerAI Frontend API Client.
 * Connects React UI to FastAPI backend with JWT authorization and error handling.
 */

import {
  FullProfileResponse,
  CareerRecommendation,
  SalaryEstimate,
  SkillGapAnalysis,
  ResumeAnalysis,
  Job,
  JobMatch,
  Question,
  AssessmentSubmissionResult,
  LearningRoadmap,
  MLMetricsReport
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

class ApiService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('career_ai_token');
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('career_ai_token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('career_ai_token');
  }

  getToken(): string | null {
    return this.token;
  }

  private getHeaders(isMultipart = false): HeadersInit {
    const headers: Record<string, string> = {};
    if (!isMultipart) {
      headers['Content-Type'] = 'application/json';
    }
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const isMultipart = options.body instanceof FormData;
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...this.getHeaders(isMultipart),
        ...(options.headers || {})
      }
    });

    if (!response.ok) {
      let errorMsg = `HTTP Error ${response.status}`;
      try {
        const errJson = await response.json();
        if (errJson.detail) {
          errorMsg = typeof errJson.detail === 'string' ? errJson.detail : JSON.stringify(errJson.detail);
        }
      } catch {
        // Fallback
      }
      throw new Error(errorMsg);
    }

    return response.json();
  }

  // --- Auth ---
  async login(email: string, password: string) {
    const data = await this.request<{ access_token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    this.setToken(data.access_token);
    return data;
  }

  async register(email: string, password: string, fullName: string) {
    const data = await this.request<{ access_token: string; user: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, full_name: fullName })
    });
    this.setToken(data.access_token);
    return data;
  }

  // --- Profile ---
  async getProfile(): Promise<FullProfileResponse> {
    return this.request<FullProfileResponse>('/profile');
  }

  async updateProfile(profileData: any): Promise<{ status: string; message: string }> {
    return this.request('/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  }

  // --- Career Intelligence ---
  async predictCareer(input: any): Promise<{
    top_role: string;
    top_match_percentage: number;
    recommendations: CareerRecommendation[];
    salary_estimate: SalaryEstimate;
  }> {
    return this.request('/career/predict', {
      method: 'POST',
      body: JSON.stringify(input)
    });
  }

  async getCareerRecommendations(): Promise<{ recommendations: CareerRecommendation[] }> {
    return this.request('/career/recommendations');
  }

  async predictSalary(input: any): Promise<SalaryEstimate> {
    return this.request('/career/salary-predict', {
      method: 'POST',
      body: JSON.stringify(input)
    });
  }

  async getSkillGap(targetRole: string, skills?: string[]): Promise<SkillGapAnalysis> {
    return this.request('/career/skill-gap', {
      method: 'POST',
      body: JSON.stringify({ target_role: targetRole, skills })
    });
  }

  async getReadinessScore(targetRole?: string): Promise<any> {
    return this.request('/career/readiness-score', {
      method: 'POST',
      body: JSON.stringify({ target_role: targetRole })
    });
  }

  async getLearningRoadmap(targetRole?: string): Promise<LearningRoadmap> {
    const query = targetRole ? `?target_role=${encodeURIComponent(targetRole)}` : '';
    return this.request(`/career/learning-roadmap${query}`);
  }

  // --- Resume Analyzer ---
  async analyzeResume(file?: File, resumeText?: string, targetRole = 'Software Developer'): Promise<{
    filename: string;
    analysis: ResumeAnalysis;
  }> {
    const formData = new FormData();
    if (file) {
      formData.append('file', file);
    }
    if (resumeText) {
      formData.append('resume_text', resumeText);
    }
    formData.append('target_role', targetRole);

    return this.request('/resume/analyze', {
      method: 'POST',
      body: formData
    });
  }

  // --- Jobs ---
  async getJobs(params: Record<string, any> = {}): Promise<{ total: number; returned: number; jobs: Job[] }> {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, String(val));
      }
    });
    return this.request(`/jobs?${query.toString()}`);
  }

  async getJobRecommendations(limit = 12): Promise<{ candidate_skills: string[]; recommendations: JobMatch[] }> {
    return this.request(`/jobs/recommendations?limit=${limit}`);
  }

  // --- Assessment ---
  async getAssessmentQuestions(category?: string, count = 10): Promise<{ count: number; questions: Question[] }> {
    const query = new URLSearchParams();
    if (category) query.append('category', category);
    query.append('count', String(count));
    return this.request(`/assessment/questions?${query.toString()}`);
  }

  async submitAssessment(answers: Record<string, number>): Promise<AssessmentSubmissionResult> {
    return this.request('/assessment/submit', {
      method: 'POST',
      body: JSON.stringify({ answers })
    });
  }

  // --- Skills & Roles ---
  async getSkills(search?: string): Promise<{ count: number; skills: string[] }> {
    const query = search ? `?search=${encodeURIComponent(search)}` : '';
    return this.request(`/skills${query}`);
  }

  async getRoles(): Promise<{ roles: string[]; role_profiles: Record<string, Record<string, number>> }> {
    return this.request('/skills/roles');
  }

  // --- ML Diagnostics ---
  async getMLMetrics(): Promise<MLMetricsReport> {
    return this.request('/ml/metrics');
  }
}

export const api = new ApiService();
