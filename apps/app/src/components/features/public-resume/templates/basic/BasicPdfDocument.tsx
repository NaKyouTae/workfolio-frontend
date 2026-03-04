import React from 'react';
import { Document, Page, View, Text, Image, Svg, Path, StyleSheet } from '@react-pdf/renderer';
import type { ResumeDetail } from '@workfolio/shared/generated/common';
import '../../pdf/fonts/registerFonts';
import { prepareBasicFormData } from './prepareBasicFormData';
import type {
  PreparedFormData,
  PreparedCareerSection,
  PreparedCareerItem,
  PreparedEducationItem,
  PreparedProjectItem,
  PreparedActivityItem,
  PreparedLanguageSkillItem,
} from '../../shared/types';

// ── Colors (matching URL basic template) ──
const colors = {
  primary: '#3182f6',
  text: '#121212',
  textSecondary: '#444',
  textMuted: '#666',
  textLight: '#888',
  background: '#f9fafb',
  border: '#eee',
  tagBg: '#e8f3ff',
  white: '#ffffff',
  detailBg: '#f5f5f5',
};

// ── Styles (matching URL BasicTemplate + PublicView structure) ──
const s = StyleSheet.create({
  page: {
    fontFamily: 'Pretendard',
    fontSize: 10,
    paddingTop: 0,
    paddingBottom: 40,
    paddingHorizontal: 0,
    color: colors.text,
    backgroundColor: colors.white,
  },
  // Main content area
  main: {
    paddingHorizontal: 32,
    paddingTop: 32,
  },
  // Profile section
  profileSection: {
    marginBottom: 32,
    paddingBottom: 32,
    borderBottomWidth: 2,
    borderBottomColor: '#f0f0f0',
  },
  profileImage: {
    width: 70,
    height: 90,
    objectFit: 'cover',
    borderRadius: 3,
    marginBottom: 8,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 700,
    color: colors.text,
    marginBottom: 4,
  },
  profilePosition: {
    fontSize: 12,
    fontWeight: 500,
    color: colors.primary,
    marginBottom: 2,
  },
  profilePublicPeriod: {
    fontSize: 8,
    color: colors.textLight,
    marginTop: 4,
  },
  // Contact list
  contactList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 12,
  },
  contactItem: {
    fontSize: 9,
    color: colors.textMuted,
  },
  // Description
  description: {
    fontSize: 9,
    lineHeight: 1.7,
    color: colors.textSecondary,
    backgroundColor: colors.background,
    padding: '12 16',
    borderRadius: 8,
    marginTop: 14,
  },
  // Section container
  section: {
    marginBottom: 24,
  },
  // Section header
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 700,
    color: colors.text,
    borderBottomWidth: 1.5,
    borderBottomColor: colors.text,
    paddingBottom: 4,
  },
  sectionBadge: {
    fontSize: 8,
    fontWeight: 600,
    color: colors.primary,
    backgroundColor: colors.tagBg,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  // Item card
  itemList: {
    gap: 10,
  },
  item: {
    padding: '12 16',
    backgroundColor: colors.background,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: colors.border,
  },
  // Item header
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  itemTitleGroup: {
    flex: 1,
    gap: 2,
  },
  itemTitle: {
    fontSize: 11,
    fontWeight: 600,
    color: colors.text,
  },
  itemSubtitle: {
    fontSize: 9,
    color: colors.textMuted,
  },
  itemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 0,
  },
  itemPeriod: {
    fontSize: 8,
    color: colors.textLight,
    fontWeight: 500,
  },
  itemTag: {
    fontSize: 7,
    fontWeight: 600,
    color: colors.white,
    backgroundColor: colors.primary,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 3,
  },
  // Item details
  itemDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  itemDetail: {
    fontSize: 8,
    color: colors.textMuted,
    backgroundColor: colors.detailBg,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 3,
  },
  // Item description
  itemDescription: {
    fontSize: 9,
    color: colors.textSecondary,
    lineHeight: 1.6,
    marginTop: 6,
  },
  // Sub-list (salary history, language tests)
  subList: {
    marginTop: 6,
    gap: 4,
  },
  subItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
    paddingHorizontal: 10,
    backgroundColor: '#f0f2f5',
    borderRadius: 4,
  },
  subItemName: {
    fontSize: 9,
    fontWeight: 500,
    color: '#333',
  },
  subItemValue: {
    fontSize: 9,
    fontWeight: 600,
    color: colors.primary,
  },
  subItemDate: {
    fontSize: 8,
    color: colors.textLight,
    marginLeft: 'auto',
  },
  // Footer logo
  footerLogoContainer: {
    position: 'absolute',
    bottom: 14,
    right: 32,
    opacity: 0.5,
  },
});

// ── Workfolio Logo (SVG) for PDF ──
const WorkfolioLogoPdf: React.FC<{ width?: number; height?: number }> = ({
  width = 60,
  height = 11,
}) => (
  <Svg width={width} height={height} viewBox="0 0 300 56">
    <Path d="M268.966 51.32C259.546 51.32 252.166 44.36 252.166 35.12C252.166 25.94 259.786 19.04 269.026 19.04C278.266 19.04 285.826 25.94 285.826 35.12C285.826 44.36 278.386 51.32 268.966 51.32ZM268.966 43.16C273.466 43.16 277.006 39.74 277.006 35.12C277.006 30.56 273.526 27.14 269.026 27.14C264.526 27.14 260.986 30.56 260.986 35.12C260.986 39.74 264.526 43.16 268.966 43.16Z" fill="#121212" />
    <Path d="M237.791 50.3599V19.9399H246.791V50.3599H237.791Z" fill="#121212" />
    <Path d="M221.912 50.3596V8.11963H230.732V50.3596H221.912Z" fill="#121212" />
    <Path d="M199.649 51.32C190.229 51.32 182.849 44.36 182.849 35.12C182.849 25.94 190.469 19.04 199.709 19.04C208.949 19.04 216.509 25.94 216.509 35.12C216.509 44.36 209.069 51.32 199.649 51.32ZM199.649 43.16C204.149 43.16 207.689 39.74 207.689 35.12C207.689 30.56 204.209 27.14 199.709 27.14C195.209 27.14 191.669 30.56 191.669 35.12C191.669 39.74 195.209 43.16 199.649 43.16Z" fill="#121212" />
    <Path d="M177.145 7.15967C178.465 7.15967 179.785 7.27967 181.585 7.63967V13.9997H180.985C179.905 13.6397 179.125 13.6397 178.225 13.6397C174.625 13.6397 173.425 15.6197 173.425 18.9797V19.9397H180.985V27.3197H173.425V50.3597H164.425V27.3197H160.465V19.9397H164.425V19.6997C164.425 11.7797 168.145 7.15967 177.145 7.15967Z" fill="#121212" />
    <Path d="M151 38.7796L157.36 50.3596H147.88L141.76 38.1796C143.92 37.4596 147.34 35.7796 147.34 31.7596C147.34 28.9396 145.42 27.0796 142.42 27.0796C139.3 27.0796 137.26 28.4596 135.4 30.6796V50.3596H126.58V8.11963H135.4V23.2396H135.82C137.74 21.1396 141.34 18.9796 145.54 18.9796C152.26 18.9796 156.22 23.4796 156.22 29.2396C156.22 33.0796 154.3 36.3796 151 38.7796Z" fill="#121212" />
    <Path d="M104.139 50.36V19.94H111.039L111.939 23.42H112.419C114.159 20.96 117.219 19.1 121.059 19.04H122.079V27.56H120.999C116.859 27.56 112.839 29.78 112.839 35.84V50.36H104.139Z" fill="#121212" />
    <Path d="M81.8759 51.32C72.4559 51.32 65.0759 44.36 65.0759 35.12C65.0759 25.94 72.6959 19.04 81.9359 19.04C91.1759 19.04 98.7359 25.94 98.7359 35.12C98.7359 44.36 91.2959 51.32 81.8759 51.32ZM81.8759 43.16C86.3759 43.16 89.9159 39.74 89.9159 35.12C89.9159 30.56 86.4359 27.14 81.9359 27.14C77.4359 27.14 73.8959 30.56 73.8959 35.12C73.8959 39.74 77.4359 43.16 81.8759 43.16Z" fill="#121212" />
    <Path d="M27.14 50.3599L14 19.9399H22.88L29.72 36.4999H30.2L36.92 19.9399H41.6L48.32 36.4999H48.8L55.64 19.9399H64.52L51.38 50.3599H46.82L39.5 32.9599H39.02L31.7 50.3599H27.14Z" fill="#121212" />
    <Path d="M237.191 10.16C237.191 12.98 239.471 15.26 242.291 15.26C245.171 15.26 247.511 12.92 247.511 10.16C247.511 7.28 245.111 5 242.291 5C239.651 5 237.191 7.16 237.191 10.16Z" fill="#FFBB26" />
  </Svg>
);

// ── Section renderers ──

const EducationSection: React.FC<{ items: PreparedEducationItem[] }> = ({ items }) => (
  <View style={s.section}>
    <View style={s.sectionHeader}>
      <Text style={s.sectionTitle}>학력</Text>
    </View>
    <View style={s.itemList}>
      {items.map((edu) => (
        <View key={edu.id} style={s.item} wrap={false}>
          <View style={s.itemHeader}>
            <View style={s.itemTitleGroup}>
              {edu.name && <Text style={s.itemTitle}>{edu.name}</Text>}
              {edu.major && <Text style={s.itemSubtitle}>{edu.major}</Text>}
            </View>
            <View style={s.itemMeta}>
              {edu.period && <Text style={s.itemPeriod}>{edu.period}</Text>}
              {edu.status && <Text style={s.itemTag}>{edu.status}</Text>}
            </View>
          </View>
          {edu.description && <Text style={s.itemDescription}>{edu.description}</Text>}
        </View>
      ))}
    </View>
  </View>
);

const CareerSection: React.FC<{ data: PreparedCareerSection }> = ({ data }) => (
  <View style={s.section}>
    <View style={s.sectionHeader}>
      <Text style={s.sectionTitle}>경력</Text>
      {data.totalPeriod && <Text style={s.sectionBadge}>{data.totalPeriod}</Text>}
    </View>
    <View style={s.itemList}>
      {data.items.map((career) => (
        <CareerItem key={career.id} career={career} />
      ))}
    </View>
  </View>
);

const CareerItem: React.FC<{ career: PreparedCareerItem }> = ({ career }) => (
  <View style={s.item} wrap={false}>
    <View style={s.itemHeader}>
      <View style={s.itemTitleGroup}>
        {career.name && <Text style={s.itemTitle}>{career.name}</Text>}
        {career.position && <Text style={s.itemSubtitle}>{career.position}</Text>}
      </View>
      <View style={s.itemMeta}>
        <Text style={s.itemPeriod}>{career.period}</Text>
        {career.employmentType && <Text style={s.itemTag}>{career.employmentType}</Text>}
      </View>
    </View>
    {(career.department || career.jobTitle) && (
      <View style={s.itemDetails}>
        {career.department && <Text style={s.itemDetail}>{career.department}</Text>}
        {career.jobTitle && <Text style={s.itemDetail}>{career.jobTitle}</Text>}
      </View>
    )}
    {career.salary && <Text style={s.itemDescription}>{career.salary}</Text>}
    {career.salaryHistory.length > 0 && (
      <View style={s.subList}>
        {career.salaryHistory.map((sal) => (
          <View key={sal.id} style={s.subItem}>
            <Text style={s.subItemName}>
              {sal.amount}
              {sal.memo ? ` ${sal.memo}` : ''}
            </Text>
            {sal.date && <Text style={s.subItemDate}>{sal.date}</Text>}
          </View>
        ))}
      </View>
    )}
    {career.description && <Text style={s.itemDescription}>{career.description}</Text>}
  </View>
);

const ProjectSection: React.FC<{ items: PreparedProjectItem[] }> = ({ items }) => (
  <View style={s.section}>
    <View style={s.sectionHeader}>
      <Text style={s.sectionTitle}>프로젝트</Text>
    </View>
    <View style={s.itemList}>
      {items.map((proj) => (
        <View key={proj.id} style={s.item} wrap={false}>
          <View style={s.itemHeader}>
            <View style={s.itemTitleGroup}>
              {proj.title && <Text style={s.itemTitle}>{proj.title}</Text>}
              {proj.affiliation && <Text style={s.itemSubtitle}>{proj.affiliation}</Text>}
            </View>
            <View style={s.itemMeta}>
              {proj.period && <Text style={s.itemPeriod}>{proj.period}</Text>}
            </View>
          </View>
          {proj.role && (
            <View style={s.itemDetails}>
              <Text style={s.itemDetail}>{proj.role}</Text>
            </View>
          )}
          {proj.description && <Text style={s.itemDescription}>{proj.description}</Text>}
        </View>
      ))}
    </View>
  </View>
);

const ActivitySection: React.FC<{ items: PreparedActivityItem[] }> = ({ items }) => (
  <View style={s.section}>
    <View style={s.sectionHeader}>
      <Text style={s.sectionTitle}>활동</Text>
    </View>
    <View style={s.itemList}>
      {items.map((act) => (
        <View key={act.id} style={s.item} wrap={false}>
          <View style={s.itemHeader}>
            <View style={s.itemTitleGroup}>
              {act.name && <Text style={s.itemTitle}>{act.name}</Text>}
              {act.organization && <Text style={s.itemSubtitle}>{act.organization}</Text>}
            </View>
            <View style={s.itemMeta}>
              {act.period && <Text style={s.itemPeriod}>{act.period}</Text>}
              {act.type && <Text style={s.itemTag}>{act.type}</Text>}
            </View>
          </View>
          {act.certificateNumber && (
            <View style={s.itemDetails}>
              <Text style={s.itemDetail}>자격번호: {act.certificateNumber}</Text>
            </View>
          )}
          {act.description && <Text style={s.itemDescription}>{act.description}</Text>}
        </View>
      ))}
    </View>
  </View>
);

const LanguageSkillSection: React.FC<{ items: PreparedLanguageSkillItem[] }> = ({ items }) => (
  <View style={s.section}>
    <View style={s.sectionHeader}>
      <Text style={s.sectionTitle}>어학</Text>
    </View>
    <View style={s.itemList}>
      {items.map((skill) => (
        <View key={skill.id} style={s.item} wrap={false}>
          <View style={s.itemHeader}>
            <View style={s.itemTitleGroup}>
              {skill.language && <Text style={s.itemTitle}>{skill.language}</Text>}
              {skill.level && <Text style={s.itemSubtitle}>{skill.level}</Text>}
            </View>
          </View>
          {skill.tests.length > 0 && (
            <View style={s.subList}>
              {skill.tests.map((test) => (
                <View key={test.id} style={s.subItem}>
                  <Text style={s.subItemName}>{test.name}</Text>
                  <Text style={s.subItemValue}>{test.score}</Text>
                  {test.acquiredAt && <Text style={s.subItemDate}>{test.acquiredAt}</Text>}
                </View>
              ))}
            </View>
          )}
        </View>
      ))}
    </View>
  </View>
);

// ── Main PDF Document ──

interface BasicPdfDocumentProps {
  resumeDetail: ResumeDetail;
}

const BasicPdfDocument: React.FC<BasicPdfDocumentProps> = ({ resumeDetail }) => {
  const data: PreparedFormData = prepareBasicFormData(resumeDetail);

  const renderSection = (type: string) => {
    switch (type) {
      case 'education':
        return <EducationSection key="edu" items={data.educations} />;
      case 'career':
        return <CareerSection key="career" data={data.careers} />;
      case 'project':
        return <ProjectSection key="project" items={data.projects} />;
      case 'activity':
        return <ActivitySection key="activity" items={data.activities} />;
      case 'languageSkill':
        return <LanguageSkillSection key="lang" items={data.languageSkills} />;
      default:
        return null;
    }
  };

  return (
    <Document>
      <Page size="A4" style={s.page} wrap>
        {/* Main content */}
        <View style={s.main}>
          {/* Profile section */}
          <View style={s.profileSection}>
            {data.profile.profileImageUrl && (
              // eslint-disable-next-line jsx-a11y/alt-text
              <Image src={data.profile.profileImageUrl} style={s.profileImage} />
            )}
            {data.profile.name && <Text style={s.profileName}>{data.profile.name}</Text>}
            {data.profile.position && (
              <Text style={s.profilePosition}>{data.profile.position}</Text>
            )}
            {data.profile.contacts.length > 0 && (
              <View style={s.contactList}>
                {data.profile.contacts.map((contact) => (
                  <Text key={contact.type} style={s.contactItem}>
                    {contact.value}
                  </Text>
                ))}
              </View>
            )}
            {data.profile.description && (
              <Text style={s.description}>{data.profile.description}</Text>
            )}
          </View>

          {/* Conditional sections in defined order */}
          {data.sections
            .filter((sec) => sec.visible)
            .map((sec) => renderSection(sec.type))}
        </View>

        {/* Footer logo - fixed on every page */}
        <View style={s.footerLogoContainer} fixed>
          <WorkfolioLogoPdf width={60} height={11} />
        </View>
      </Page>
    </Document>
  );
};

export default BasicPdfDocument;
