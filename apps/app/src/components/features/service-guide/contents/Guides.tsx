'use client';

import React from 'react';

const GUIDE_SECTIONS = [
    {
        title: '업무 기록, 왜 중요한가요?',
        content: `매일 하는 일을 기록하지 않으면, 이직이나 연봉 협상 시 내가 무엇을 했는지 정리하기 어렵습니다.
워크폴리오는 업무를 시간 단위, 일 단위, 프로젝트 단위로 간편하게 기록할 수 있도록 도와줍니다.
꾸준히 쌓은 기록은 곧 나만의 커리어 자산이 됩니다.`,
    },
    {
        title: '기업 유형별 이력서 작성 가이드',
        items: [
            {
                label: '스타트업',
                desc: '빠른 실행력과 다양한 역할 수행 경험을 강조하세요. MVP 출시, 그로스 해킹, 풀스택 개발 등 "직접 해낸" 경험이 핵심입니다.',
            },
            {
                label: '중견기업',
                desc: '프로세스 개선과 조직 내 성과를 중심으로 작성하세요. ERP 고도화, 품질관리, 공급망 최적화 등 체계적인 업무 경험을 어필합니다.',
            },
            {
                label: '공기업',
                desc: '공공 가치와 제도적 성과를 부각하세요. 디지털 전환, 국민 서비스 개선, ESG 경영 등 사회적 기여도가 중요합니다.',
            },
            {
                label: '대기업',
                desc: '대규모 프로젝트 리드 경험과 정량적 성과를 강조하세요. 글로벌 런칭, AI 시스템 구축, M&A 등 임팩트가 큰 성과를 중심으로 작성합니다.',
            },
        ],
    },
    {
        title: '효과적인 기록 작성 팁',
        items: [
            {
                label: '문제 → 행동 → 결과',
                desc: 'STAR 기법을 활용하세요. 어떤 상황(Situation)에서 어떤 과제(Task)를 받고, 어떤 행동(Action)을 하여 어떤 결과(Result)를 냈는지 구조화하면 됩니다.',
            },
            {
                label: '수치로 말하기',
                desc: '"매출 향상"보다 "매출 340만원 → 1,150만원 (238% 증가)"처럼 구체적 수치를 넣으면 설득력이 높아집니다.',
            },
            {
                label: '매일 5분 기록',
                desc: '한 달 뒤에 몰아서 쓰면 기억이 왜곡됩니다. 매일 퇴근 전 5분만 투자해 간단히 기록해두세요.',
            },
        ],
    },
    {
        title: '워크폴리오 주요 기능',
        items: [
            {
                label: '기록장 관리',
                desc: '업무, 프로젝트, 사이드 프로젝트 등 목적별로 기록장을 나누어 관리할 수 있습니다. 공유 기록장으로 팀원과 함께 기록할 수도 있습니다.',
            },
            {
                label: '이력서 자동 생성',
                desc: '쌓아둔 기록을 바탕으로 기업 유형에 맞는 이력서를 자동으로 만들어줍니다. 수동으로 이력서를 처음부터 쓸 필요가 없습니다.',
            },
            {
                label: '대시보드',
                desc: '내 기록 현황을 한눈에 파악할 수 있습니다. 기록장별 기록 수, 마지막 기록 일자 등을 통해 커리어 관리 상태를 확인하세요.',
            },
        ],
    },
];

const Guides: React.FC = () => {
    return (
        <>
            <div className="page-title">
                <div>
                    <h2>활용 가이드</h2>
                </div>
            </div>
            <div className="page-cont">
                {GUIDE_SECTIONS.map((section, idx) => (
                    <div className="cont-box" key={idx}>
                        <div className="cont-tit">
                            <div>
                                <h3>{section.title}</h3>
                            </div>
                        </div>
                        {section.content && (
                            <p className="guide-text">{section.content}</p>
                        )}
                        {section.items && (
                            <ul className="guide-list">
                                {section.items.map((item, i) => (
                                    <li key={i}>
                                        <strong>{item.label}</strong>
                                        <p>{item.desc}</p>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                ))}
            </div>
        </>
    );
};

export default Guides;
