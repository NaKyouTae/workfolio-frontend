'use client';

import React from 'react';
import styles from './PrivacyPolicy.module.css';
import Footer from '../../../layouts/Footer';

const PrivacyPolicy: React.FC = () => {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>개인정보처리방침</h2>
        </div>

        <div className={styles.content}>
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>제1조 (개인정보의 처리목적)</h3>
            <p className={styles.text}>
              워크폴리오(이하 "회사")는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 개인정보 보호법 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
            </p>
            <ul className={styles.list}>
              <li>회원 가입의사 확인, 회원제 서비스 제공에 따른 본인 식별·인증, 회원자격 유지·관리, 서비스 부정이용 방지 목적</li>
              <li>재화 또는 서비스 제공, 콘텐츠 제공, 맞춤서비스 제공, 본인인증을 목적</li>
              <li>서비스 개선 및 신규 서비스 개발, 마케팅 및 광고 활용을 목적</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>제2조 (개인정보의 처리 및 보유기간)</h3>
            <p className={styles.text}>
              회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.
            </p>
            <ul className={styles.list}>
              <li>회원 가입 및 관리: 회원 탈퇴시까지 (단, 관계 법령 위반에 따른 수사·조사 등이 진행중인 경우에는 해당 수사·조사 종료시까지)</li>
              <li>재화 또는 서비스 제공: 재화·서비스 공급완료 및 요금결제·정산 완료시까지</li>
              <li>전자상거래에서의 계약·청약철회, 대금결제, 재화 등 공급기록: 5년</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>제3조 (처리하는 개인정보의 항목)</h3>
            <p className={styles.text}>
              회사는 다음의 개인정보 항목을 처리하고 있습니다.
            </p>
            <ul className={styles.list}>
              <li>필수항목: 이메일, 닉네임, 생년월일, 성별</li>
              <li>선택항목: 연락처, 직업</li>
              <li>자동 수집 항목: IP주소, 쿠키, MAC주소, 서비스 이용 기록, 방문 기록, 불량 이용 기록 등</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>제4조 (개인정보의 제3자 제공)</h3>
            <p className={styles.text}>
              회사는 정보주체의 개인정보를 제1조(개인정보의 처리목적)에서 명시한 범위 내에서만 처리하며, 정보주체의 동의, 법률의 특별한 규정 등 개인정보 보호법 제17조 및 제18조에 해당하는 경우에만 개인정보를 제3자에게 제공합니다.
            </p>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>제5조 (개인정보처리의 위탁)</h3>
            <p className={styles.text}>
              회사는 원활한 개인정보 업무처리를 위하여 다음과 같이 개인정보 처리업무를 위탁하고 있습니다.
            </p>
            <ul className={styles.list}>
              <li>위탁받는 자(수탁자): 클라우드 서비스 제공업체</li>
              <li>위탁하는 업무의 내용: 서비스 제공을 위한 인프라 관리</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>제6조 (정보주체의 권리·의무 및 행사방법)</h3>
            <p className={styles.text}>
              정보주체는 회사에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다.
            </p>
            <ul className={styles.list}>
              <li>개인정보 처리정지 요구권</li>
              <li>개인정보 열람요구권</li>
              <li>개인정보 정정·삭제요구권</li>
              <li>개인정보 처리정지 요구권</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>제7조 (개인정보의 파기)</h3>
            <p className={styles.text}>
              회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체없이 해당 개인정보를 파기합니다.
            </p>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>제8조 (개인정보 보호책임자)</h3>
            <p className={styles.text}>
              회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
            </p>
            <ul className={styles.list}>
              <li>개인정보 보호책임자: 워크폴리오 운영팀</li>
              <li>연락처: support@workfolio.pro</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>제9조 (개인정보의 안전성 확보조치)</h3>
            <p className={styles.text}>
              회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다.
            </p>
            <ul className={styles.list}>
              <li>관리적 조치: 내부관리계획 수립·시행, 정기적 직원 교육 등</li>
              <li>기술적 조치: 개인정보처리시스템 등의 접근권한 관리, 접근통제시스템 설치, 고유식별정보 등의 암호화, 보안프로그램 설치</li>
              <li>물리적 조치: 전산실, 자료보관실 등의 접근통제</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>제10조 (개인정보 보호법에 따른 권익침해 구제방법)</h3>
            <p className={styles.text}>
              정보주체는 아래의 기관에 개인정보 침해에 대한 신고나 상담을 할 수 있습니다.
            </p>
            <ul className={styles.list}>
              <li>개인정보 침해신고센터: (국번없이) 118 (privacy.go.kr)</li>
              <li>개인정보 분쟁조정위원회: (국번없이) 1833-6972 (www.kopico.go.kr)</li>
              <li>대검찰청 사이버범죄수사단: 02-3480-3573 (www.spo.go.kr)</li>
              <li>경찰청 사이버테러대응센터: (국번없이) 182 (cyberbureau.police.go.kr)</li>
            </ul>
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PrivacyPolicy;

