import React from 'react';
import styles from './PlansIntegration.module.css';

interface PlanFeature {
  text: string;
  included: boolean;
}

interface Plan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: PlanFeature[];
  isPopular?: boolean;
  buttonText: string;
  buttonVariant: 'primary' | 'secondary' | 'outline';
}

const plans: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    price: '₩0',
    period: '영구 무료',
    description: '개인 사용자를 위한 기본 플랜',
    features: [
      { text: '이력서 3개 생성', included: true },
      { text: '이직 활동 기록 1개', included: true },
      { text: 'PDF 내보내기', included: true },
      { text: 'URL 공유', included: true },
      { text: '기본 템플릿 사용', included: true },
      { text: '프리미엄 템플릿', included: false },
      { text: '우선 지원', included: false },
      { text: '데이터 분석', included: false },
    ],
    buttonText: '무료로 시작하기',
    buttonVariant: 'outline',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '₩9,900',
    period: '월',
    description: '전문가를 위한 프리미엄 플랜',
    features: [
      { text: '이력서 무제한 생성', included: true },
      { text: '이직 활동 기록 무제한', included: true },
      { text: 'PDF 내보내기', included: true },
      { text: 'URL 공유', included: true },
      { text: '모든 템플릿 사용', included: true },
      { text: '프리미엄 템플릿', included: true },
      { text: '우선 지원', included: true },
      { text: '데이터 분석', included: true },
    ],
    isPopular: true,
    buttonText: 'Pro로 업그레이드',
    buttonVariant: 'primary',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: '문의',
    period: '',
    description: '기업을 위한 맞춤형 솔루션',
    features: [
      { text: '모든 Pro 기능 포함', included: true },
      { text: '팀 협업 기능', included: true },
      { text: '전담 계정 관리자', included: true },
      { text: 'API 접근 권한', included: true },
      { text: '맞춤형 템플릿 제작', included: true },
      { text: '고급 보안 기능', included: true },
      { text: 'SLA 보장', included: true },
      { text: '교육 및 온보딩 지원', included: true },
    ],
    buttonText: '영업팀 문의',
    buttonVariant: 'secondary',
  },
];

const PlansIntegration: React.FC = () => {
  const handlePlanSelect = (planId: string) => {
    console.log(`Selected plan: ${planId}`);
    // TODO: 플랜 선택 로직 구현
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>요금제</h1>
        <p className={styles.subtitle}>
          당신에게 맞는 플랜을 선택하세요
        </p>
      </div>

      <div className={styles.plansGrid}>
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`${styles.planCard} ${plan.isPopular ? styles.popular : ''}`}
          >
            {plan.isPopular && (
              <div className={styles.popularBadge}>가장 인기있는 플랜</div>
            )}

            <div className={styles.planHeader}>
              <h2 className={styles.planName}>{plan.name}</h2>
              <div className={styles.priceContainer}>
                <span className={styles.price}>{plan.price}</span>
                {plan.period && <span className={styles.period}>/{plan.period}</span>}
              </div>
              <p className={styles.description}>{plan.description}</p>
            </div>

            <div className={styles.featuresContainer}>
              <ul className={styles.featuresList}>
                {plan.features.map((feature, index) => (
                  <li
                    key={index}
                    className={`${styles.feature} ${!feature.included ? styles.notIncluded : ''}`}
                  >
                    <span className={styles.checkIcon}>
                      {feature.included ? '✓' : '×'}
                    </span>
                    <span className={styles.featureText}>{feature.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => handlePlanSelect(plan.id)}
              className={`${styles.button} ${styles[plan.buttonVariant]}`}
            >
              {plan.buttonText}
            </button>
          </div>
        ))}
      </div>

      <div className={styles.faq}>
        <h2 className={styles.faqTitle}>자주 묻는 질문</h2>
        <div className={styles.faqGrid}>
          <div className={styles.faqItem}>
            <h3>플랜은 언제든 변경할 수 있나요?</h3>
            <p>네, 언제든지 플랜을 업그레이드하거나 다운그레이드할 수 있습니다.</p>
          </div>
          <div className={styles.faqItem}>
            <h3>결제 방법은 무엇인가요?</h3>
            <p>신용카드, 체크카드, 계좌이체 등 다양한 결제 방법을 지원합니다.</p>
          </div>
          <div className={styles.faqItem}>
            <h3>환불 정책은 어떻게 되나요?</h3>
            <p>구매 후 7일 이내에는 전액 환불이 가능합니다.</p>
          </div>
          <div className={styles.faqItem}>
            <h3>Enterprise 플랜은 어떻게 문의하나요?</h3>
            <p>support@workfolio.pro로 이메일을 보내주시면 영업팀에서 연락드립니다.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlansIntegration;

