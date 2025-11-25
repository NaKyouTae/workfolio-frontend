'use client';

import React from 'react';
import styles from './InfoContent.module.css';
import Link from 'next/link';

const InfoContent: React.FC = () => {
  return (
    <main className={styles.infoPage}>
      <div className={styles.container}>
        {/* Hero Section */}
        <div className={styles.hero}>
          <h1 className={styles.heroTitle}>워크폴리오</h1>
          <p className={styles.heroSubtitle}>
            일과 이력을 한곳에 쌓아두는 기록 플랫폼
          </p>
          <p className={styles.heroDescription}>
            워크폴리오는 당신의 업무 경험과 성장 과정을 체계적으로 기록하고 관리할 수 있는 플랫폼입니다.
            <br />
            매일의 업무 기록부터 이력서 작성까지, 모든 것을 한 곳에서 관리하세요.
          </p>
        </div>

        {/* Features Section */}
        <div className={styles.features}>
          <h2 className={styles.sectionTitle}>주요 기능</h2>
          <div className={styles.featureGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>📝</div>
              <h3 className={styles.featureTitle}>기록 관리</h3>
              <p className={styles.featureDescription}>
                일일 업무 기록을 체계적으로 관리하고, 월별/주별 캘린더로 한눈에 확인하세요.
                개인 기록장과 공유 기록장을 통해 팀과 협업할 수 있습니다.
              </p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>📄</div>
              <h3 className={styles.featureTitle}>이력 관리</h3>
              <p className={styles.featureDescription}>
                경력 사항을 체계적으로 정리하고, 다양한 형식의 이력서를 작성하고 관리할 수 있습니다.
                필요할 때 언제든지 이력서를 내보내거나 공유하세요.
              </p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🔄</div>
              <h3 className={styles.featureTitle}>이직 관리</h3>
              <p className={styles.featureDescription}>
                이직 과정을 단계별로 관리하고, 목표와 도전 과제를 설정하여 체계적으로 준비하세요.
                회고를 통해 경험을 정리하고 성장으로 이어가세요.
              </p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>👥</div>
              <h3 className={styles.featureTitle}>협업 기능</h3>
              <p className={styles.featureDescription}>
                공유 기록장을 통해 팀원들과 업무를 공유하고 협업할 수 있습니다.
                우선순위 설정으로 중요한 기록을 관리하세요.
              </p>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className={styles.benefits}>
          <h2 className={styles.sectionTitle}>워크폴리오를 선택하는 이유</h2>
          <div className={styles.benefitList}>
            <div className={styles.benefitItem}>
              <h3 className={styles.benefitTitle}>체계적인 기록 관리</h3>
              <p>
                일일 업무부터 장기 프로젝트까지, 모든 경험을 체계적으로 기록하고 관리할 수 있습니다.
                시간이 지나도 쉽게 찾아볼 수 있는 검색 기능을 제공합니다.
              </p>
            </div>
            <div className={styles.benefitItem}>
              <h3 className={styles.benefitTitle}>효율적인 이력서 작성</h3>
              <p>
                평소 기록한 업무 경험을 바탕으로 이력서를 빠르고 정확하게 작성할 수 있습니다.
                여러 버전의 이력서를 관리하고 필요에 따라 수정하세요.
              </p>
            </div>
            <div className={styles.benefitItem}>
              <h3 className={styles.benefitTitle}>성장 추적</h3>
              <p>
                과거의 기록을 되돌아보며 자신의 성장 과정을 확인할 수 있습니다.
                회고를 통해 경험을 정리하고 다음 단계로 나아가세요.
              </p>
            </div>
            <div className={styles.benefitItem}>
              <h3 className={styles.benefitTitle}>팀 협업</h3>
              <p>
                공유 기록장을 통해 팀원들과 업무를 공유하고 협업할 수 있습니다.
                우선순위 설정으로 중요한 업무를 관리하세요.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className={styles.cta}>
          <h2 className={styles.ctaTitle}>지금 시작하세요</h2>
          <p className={styles.ctaDescription}>
            워크폴리오와 함께 당신의 업무 경험을 기록하고 성장으로 이어가세요.
          </p>
          <div className={styles.ctaButtons}>
            <Link href="/records" className={styles.ctaButtonPrimary}>
              기록 시작하기
            </Link>
            <Link href="/careers" className={styles.ctaButtonSecondary}>
              이력서 작성하기
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default InfoContent;

