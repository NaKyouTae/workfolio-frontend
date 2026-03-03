import { Font } from '@react-pdf/renderer';

const FONT_BASE = '/assets/css/font/Pretendard';

Font.register({
  family: 'Pretendard',
  fonts: [
    { src: `${FONT_BASE}/Pretendard-Regular.woff`, fontWeight: 400 },
    { src: `${FONT_BASE}/Pretendard-Medium.woff`, fontWeight: 500 },
    { src: `${FONT_BASE}/Pretendard-SemiBold.woff`, fontWeight: 600 },
    { src: `${FONT_BASE}/Pretendard-Bold.woff`, fontWeight: 700 },
  ],
});
