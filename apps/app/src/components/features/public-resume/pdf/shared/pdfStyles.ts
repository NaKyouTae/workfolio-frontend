import { StyleSheet } from '@react-pdf/renderer';

export const colors = {
  primary: '#3182f6',
  text: '#121212',
  textSecondary: '#444',
  textMuted: '#666',
  textLight: '#888',
  background: '#f9fafb',
  border: '#eee',
  tagBg: '#e8f3ff',
  white: '#ffffff',
  descriptionBg: '#f5f7fa',
};

export const baseStyles = StyleSheet.create({
  page: {
    fontFamily: 'Pretendard',
    fontSize: 10,
    paddingTop: 32,
    paddingBottom: 40,
    paddingHorizontal: 36,
    color: colors.text,
    backgroundColor: colors.white,
  },
  // Section container
  section: {
    marginBottom: 18,
  },
  // Section header row (title + optional badge)
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
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
  item: {
    padding: '10 14',
    backgroundColor: colors.background,
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: colors.border,
    marginBottom: 8,
  },
  // Item header: title group + meta (period/tag)
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
  // Item details row
  itemDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  itemDetail: {
    fontSize: 8,
    color: colors.textSecondary,
    backgroundColor: '#f0f0f0',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 3,
  },
  // Description text
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
});
