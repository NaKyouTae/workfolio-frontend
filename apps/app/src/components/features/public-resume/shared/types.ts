export interface PreparedContactItem {
  type: 'birthDate' | 'gender' | 'phone' | 'email';
  value: string;
}

export interface PreparedProfile {
  name: string | null;
  position: string | null;
  publicPeriod: string | null;
  profileImageUrl: string | null;
  contacts: PreparedContactItem[];
  description: string | null;
}

export interface PreparedSalaryItem {
  id: string;
  amount: string | null;
  memo: string | null;
  date: string | null;
  negotiationDate: number;
}

export interface PreparedCareerItem {
  id: string;
  name: string | null;
  position: string | null;
  period: string;
  employmentType: string | null;
  department: string | null;
  jobTitle: string | null;
  salary: string | null;
  salaryHistory: PreparedSalaryItem[];
  description: string | null;
}

export interface PreparedCareerSection {
  totalPeriod: string | null;
  items: PreparedCareerItem[];
}

export interface PreparedEducationItem {
  id: string;
  name: string | null;
  major: string | null;
  period: string | null;
  status: string | null;
  description: string | null;
}

export interface PreparedProjectItem {
  id: string;
  title: string | null;
  affiliation: string | null;
  period: string | null;
  role: string | null;
  description: string | null;
}

export interface PreparedActivityItem {
  id: string;
  name: string | null;
  organization: string | null;
  period: string | null;
  type: string | null;
  certificateNumber: string | null;
  description: string | null;
}

export interface PreparedLanguageTest {
  id: string;
  name: string;
  score: string;
  acquiredAt: string | null;
}

export interface PreparedLanguageSkillItem {
  id: string;
  language: string | null;
  level: string | null;
  tests: PreparedLanguageTest[];
}

export type SectionType = 'education' | 'career' | 'project' | 'activity' | 'languageSkill';

export interface PreparedFormData {
  profile: PreparedProfile;
  sections: Array<{ type: SectionType; visible: boolean }>;
  careers: PreparedCareerSection;
  educations: PreparedEducationItem[];
  projects: PreparedProjectItem[];
  activities: PreparedActivityItem[];
  languageSkills: PreparedLanguageSkillItem[];
}
