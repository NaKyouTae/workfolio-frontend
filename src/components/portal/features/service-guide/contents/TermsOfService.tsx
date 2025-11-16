'use client';

import React from 'react';
import styles from './TermsOfService.module.css';
import Footer from '../../../layouts/Footer';

const TermsOfService: React.FC = () => {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>이용약관</h2>
        </div>

        <div className={styles.content}>
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>제1조 (목적)</h3>
            <p className={styles.text}>
              본 약관은 워크폴리오(이하 "회사")가 제공하는 서비스의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
            </p>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>제2조 (정의)</h3>
            <p className={styles.text}>
              본 약관에서 사용하는 용어의 정의는 다음과 같습니다.
            </p>
            <ul className={styles.list}>
              <li>"서비스"란 회사가 제공하는 이력서 관리, 이직 활동 기록, 커리어 관리 등의 온라인 서비스를 의미합니다.</li>
              <li>"이용자"란 본 약관에 동의하고 회사가 제공하는 서비스를 이용하는 회원 및 비회원을 의미합니다.</li>
              <li>"회원"이란 회사에 개인정보를 제공하여 회원등록을 한 자로서, 회사의 정보를 지속적으로 제공받으며, 회사가 제공하는 서비스를 계속적으로 이용할 수 있는 자를 의미합니다.</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>제3조 (약관의 게시와 개정)</h3>
            <p className={styles.text}>
              회사는 본 약관의 내용을 이용자가 쉽게 알 수 있도록 서비스 초기 화면에 게시합니다. 회사는 필요한 경우 관련 법령을 위배하지 않는 범위에서 본 약관을 개정할 수 있습니다.
            </p>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>제4조 (서비스의 제공 및 변경)</h3>
            <p className={styles.text}>
              회사는 다음과 같은 서비스를 제공합니다.
            </p>
            <ul className={styles.list}>
              <li>이력서 작성 및 관리 서비스</li>
              <li>이직 활동 기록 관리 서비스</li>
              <li>커리어 관리 서비스</li>
              <li>기타 회사가 추가 개발하거나 제휴계약 등을 통해 회원에게 제공하는 일체의 서비스</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>제5조 (서비스의 중단)</h3>
            <p className={styles.text}>
              회사는 컴퓨터 등 정보통신설비의 보수점검, 교체 및 고장, 통신의 두절 등의 사유가 발생한 경우에는 서비스의 제공을 일시적으로 중단할 수 있습니다.
            </p>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>제6조 (회원가입)</h3>
            <p className={styles.text}>
              이용자는 회사가 정한 가입 양식에 따라 회원정보를 기입한 후 본 약관에 동의한다는 의사표시를 함으로서 회원가입을 신청합니다.
            </p>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>제7조 (회원정보의 변경)</h3>
            <p className={styles.text}>
              회원은 개인정보관리화면을 통하여 언제든지 본인의 개인정보를 열람하고 수정할 수 있습니다. 다만, 서비스 관리를 위해 필요한 실명, 아이디 등은 수정이 불가능합니다.
            </p>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>제8조 (개인정보보호)</h3>
            <p className={styles.text}>
              회사는 이용자의 개인정보 수집시 서비스제공을 위하여 필요한 범위에서 최소한의 개인정보를 수집합니다. 회사는 회원가입시 구매계약이행에 필요한 정보를 미리 수집하지 않습니다.
            </p>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>제9조 (회사의 의무)</h3>
            <p className={styles.text}>
              회사는 법령과 본 약관이 금지하거나 공서양속에 반하는 행위를 하지 않으며, 지속적이고 안정적으로 서비스를 제공하기 위하여 최선을 다하여 노력합니다.
            </p>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>제10조 (회원의 의무)</h3>
            <p className={styles.text}>
              회원은 다음 행위를 하여서는 안 됩니다.
            </p>
            <ul className={styles.list}>
              <li>신청 또는 변경시 허위내용의 등록</li>
              <li>타인의 정보 도용</li>
              <li>회사가 게시한 정보의 변경</li>
              <li>회사가 정한 정보 이외의 정보(컴퓨터 프로그램 등)의 송신 또는 게시</li>
              <li>회사와 기타 제3자의 저작권 등 지적재산권에 대한 침해</li>
              <li>회사 및 기타 제3자의 명예를 손상시키거나 업무를 방해하는 행위</li>
            </ul>
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default TermsOfService;

