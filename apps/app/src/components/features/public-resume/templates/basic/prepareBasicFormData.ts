import type { ResumeDetail, Salary } from '@workfolio/shared/generated/common';
import type { PreparedFormData } from '../../shared/types';
import {
  getGenderLabel,
  formatBirthDate,
  formatPhoneNumber,
  formatPublicPeriod,
  getEmploymentTypeLabel,
  formatCareerPeriod,
  calculateTotalCareerPeriod,
  getEducationStatusLabel,
  getActivityTypeLabel,
  getLanguageLabel,
  getLanguageLevelLabel,
  formatTimestamp,
  formatSalary,
} from '../../shared/formatters';

export function prepareBasicFormData(resumeDetail: ResumeDetail): PreparedFormData {
  // Filter visible items
  const visibleCareers = resumeDetail.careers?.filter((c) => c.isVisible === true) || [];
  const visibleEducations = resumeDetail.educations?.filter((e) => e.isVisible === true) || [];
  const visibleProjects = resumeDetail.projects?.filter((p) => p.isVisible === true) || [];
  const visibleActivities = resumeDetail.activities?.filter((a) => a.isVisible === true) || [];
  const visibleLanguageSkills =
    resumeDetail.languageSkills?.filter((l) => l.isVisible === true) || [];

  // Profile
  const contacts = [];
  if (resumeDetail.birthDate) {
    contacts.push({ type: 'birthDate' as const, value: formatBirthDate(resumeDetail.birthDate) });
  }
  const genderLabel = resumeDetail.gender ? getGenderLabel(resumeDetail.gender) : '';
  if (genderLabel) {
    contacts.push({ type: 'gender' as const, value: genderLabel });
  }
  if (resumeDetail.phone) {
    contacts.push({ type: 'phone' as const, value: formatPhoneNumber(resumeDetail.phone) });
  }
  if (resumeDetail.email) {
    contacts.push({ type: 'email' as const, value: resumeDetail.email });
  }

  const profile = {
    name: resumeDetail.name || null,
    position: resumeDetail.position || null,
    publicPeriod:
      resumeDetail.isPublic
        ? formatPublicPeriod(resumeDetail.publicStartDate, resumeDetail.publicEndDate)
        : null,
    profileImageUrl: resumeDetail.profileImageUrl || null,
    contacts,
    description: resumeDetail.description || null,
  };

  // Careers
  const totalPeriod = calculateTotalCareerPeriod(visibleCareers);
  const careerItems = visibleCareers.map((career) => {
    const visibleSalaries = (career.salaries || []).filter((s: Salary) => s.isVisible === true);
    return {
      id: career.id || '',
      name: career.name || null,
      position: career.position || null,
      period: formatCareerPeriod(career.startedAt, career.endedAt, career.isWorking),
      employmentType: career.employmentType
        ? getEmploymentTypeLabel(career.employmentType)
        : null,
      department: career.department || null,
      jobTitle: career.jobTitle || null,
      salary:
        career.salary != null && career.salary > 0 ? formatSalary(career.salary) : null,
      salaryHistory: visibleSalaries
        .sort((a, b) => (b.negotiationDate || 0) - (a.negotiationDate || 0))
        .map((s) => ({
          id: s.id || '',
          amount: s.amount != null && s.amount > 0 ? formatSalary(s.amount) : null,
          memo: s.memo || null,
          date: s.negotiationDate
            ? formatTimestamp(s.negotiationDate, 'YYYY. MM. DD.')
            : null,
          negotiationDate: s.negotiationDate || 0,
        })),
      description: career.description || null,
    };
  });

  // Educations
  const educations = visibleEducations.map((edu) => {
    let period: string | null = null;
    if (edu.startedAt || edu.endedAt) {
      const start = edu.startedAt ? formatTimestamp(edu.startedAt, 'YYYY. MM.') : '';
      const end = edu.endedAt ? ` - ${formatTimestamp(edu.endedAt, 'YYYY. MM.')}` : '';
      period = `${start}${end}`;
    }
    return {
      id: edu.id || '',
      name: edu.name || null,
      major: edu.major || null,
      period,
      status: edu.status ? getEducationStatusLabel(edu.status) : null,
      description: edu.description || null,
    };
  });

  // Projects
  const projects = visibleProjects.map((proj) => {
    let period: string | null = null;
    if (proj.startedAt || proj.endedAt) {
      const start = proj.startedAt ? formatTimestamp(proj.startedAt, 'YYYY. MM.') : '';
      const end = proj.endedAt ? ` - ${formatTimestamp(proj.endedAt, 'YYYY. MM.')}` : '';
      period = `${start}${end}`;
    }
    return {
      id: proj.id || '',
      title: proj.title || null,
      affiliation: proj.affiliation || null,
      period,
      role: proj.role || null,
      description: proj.description || null,
    };
  });

  // Activities
  const activities = visibleActivities.map((act) => {
    let period: string | null = null;
    if (act.startedAt || act.endedAt) {
      const start = act.startedAt ? formatTimestamp(act.startedAt, 'YYYY. MM.') : '';
      const end = act.endedAt ? ` - ${formatTimestamp(act.endedAt, 'YYYY. MM.')}` : '';
      period = `${start}${end}`;
    }
    return {
      id: act.id || '',
      name: act.name || null,
      organization: act.organization || null,
      period,
      type: act.type ? getActivityTypeLabel(act.type) : null,
      certificateNumber: act.certificateNumber || null,
      description: act.description || null,
    };
  });

  // Language Skills
  const languageSkills = visibleLanguageSkills.map((skill) => {
    const visibleTests = (skill.languageTests || []).filter((t) => t.isVisible === true);
    return {
      id: skill.id || '',
      language: skill.language ? getLanguageLabel(skill.language) : null,
      level: skill.level ? getLanguageLevelLabel(skill.level) : null,
      tests: visibleTests.map((test) => ({
        id: test.id || '',
        name: test.name || '',
        score: test.score || '',
        acquiredAt: test.acquiredAt
          ? formatTimestamp(test.acquiredAt, 'YYYY. MM.')
          : null,
      })),
    };
  });

  // Section ordering for basic template
  const sections = [
    { type: 'education' as const, visible: visibleEducations.length > 0 },
    { type: 'career' as const, visible: visibleCareers.length > 0 },
    { type: 'project' as const, visible: visibleProjects.length > 0 },
    { type: 'activity' as const, visible: visibleActivities.length > 0 },
    { type: 'languageSkill' as const, visible: visibleLanguageSkills.length > 0 },
  ];

  return {
    profile,
    sections,
    careers: { totalPeriod: totalPeriod || null, items: careerItems },
    educations,
    projects,
    activities,
    languageSkills,
  };
}
