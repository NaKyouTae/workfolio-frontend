"use client";

import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import styles from "./InfoContent.module.css";
import Link from "next/link";
import Image from "next/image";

// Swiper CSS
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "swiper/css/autoplay";

const InfoContent: React.FC = () => {
    const scrollSectionRef = useRef<HTMLElement>(null);
    const swiperRef = useRef<SwiperType | null>(null);

    return (
        <main className={styles.infoPage}>
            {/* Top Section - Hero with Speech Bubbles */}
            <section className={styles.topSection}>
                <div className={styles.speechBubblesContainer}>
                    <div className={styles.speechBubbles}>
                        <div className={styles.speechBubble} style={{ backgroundColor: "#FFF4DC" }}>
                            <p>참여했던 프로젝트 내용이 잘 기억나지 않아요.</p>
                        </div>
                    </div>
                    <div className={styles.speechBubbles}>
                        <Image src="/assets/img/man.png" alt="man" width={60} height={76} />
                        <div className={styles.speechBubble} style={{ backgroundColor: "#FFFAF0" }}>
                            <p>이직 준비, 제대로 하고 있는 건지 잘 모르겠어요.</p>
                        </div>
                    </div>
                    <div className={styles.speechBubbles}>
                        <div className={styles.speechBubble} style={{ backgroundColor: "#FFF4DC" }}>
                            <p>업무랑 개인 일정 관리가 자꾸 꼬여요.</p>
                        </div>
                    </div>
                    <div className={styles.speechBubbles}>
                        <div className={styles.speechBubble} style={{ backgroundColor: "#FFFAF0" }}>
                            <p>흩어진 이력을 한곳에서 편하게 관리하고 싶어요.</p>
                        </div>
                        <Image src="/assets/img/woman.png" alt="woman" width={60} height={76} />
                    </div>
                </div>
                <div className={styles.logoSection}>
                    <Image
                        src="/assets/img/logo/img-logo01.svg"
                        alt="workfolio"
                        width={200}
                        height={60}
                        className={styles.logo}
                    />
                    <p className={styles.tagline}>놓치는 이력이 있을까 두려운 당신에게</p>
                    <p className={styles.tagline}>
                        일과 이력을 한곳에 쌓아두는 나만의 기록장{" "}
                        <span className={styles.highlightText}>워크폴리오</span>
                    </p>
                </div>
            </section>

            {/* Middle Section - Black Background with White Block */}
            <section className={styles.middleSection}>
                <div>
                    <Image src="/assets/img/articles.png" alt="articles" width={630} height={238} />
                    <div className={styles.middleHeader}>
                        <p className={styles.taglineWhite}>
                            점점 더 닫히는 취업문, 앞으로의 이직 준비가 막막하다면
                        </p>
                        <h2 className={styles.middleTitleWhite}>
                            커리어에도{" "}
                            <span className={styles.highlightYellow}>계획이 필요할 때</span>
                            입니다.
                        </h2>
                    </div>
                    <div className={styles.comparisonContainer}>
                        <div className={styles.applicantColumn}>
                            <h3 className={styles.applicantTitle}>지원자 A</h3>
                            <div className={styles.applicantPoint}>
                                기간, 성과, 역할 등 정확한 기록이 없어 오류가 많고
                                <br />
                                완성도가 낮은 이력서 작성
                            </div>
                            <div className={styles.applicantPoint}>
                                프로젝트 세부 내용을 기억하지 못해 추상적이고
                                <br />
                                모호한 답변만 반복
                            </div>
                            <div className={styles.applicantPoint}>
                                부족한 경험 축적과 분석으로 불분명한
                                <br />
                                커리어 방향 설정
                            </div>
                            <div className={styles.applicantResult}>불합격</div>
                        </div>
                        <div className={styles.vsBadge}>
                            <Image src="/assets/img/versus.png" alt="vs" width={56} height={56} />
                        </div>
                        <div className={styles.applicantColumn}>
                            <h3 className={styles.applicantTitle}>지원자 B</h3>
                            <div className={styles.applicantPoint}>
                                기간, 성과, 역할을 정확히 기재하여 품질이 균일하고
                                <br />
                                완성도가 높은 이력서 작성
                            </div>
                            <div className={styles.applicantPoint}>
                                기록된 성과를 기반으로 객관적이고 구체적으로
                                <br />
                                설명하는 답변 제시
                            </div>
                            <div className={styles.applicantPoint}>
                                일관된 성장 맥락과 직무 적합성이 드러나 명확한
                                <br />
                                커리어 흐름 전달
                            </div>
                            <div className={styles.applicantResult}>합격</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Bottom Section - Features with Points */}
            <section ref={scrollSectionRef} className={styles.scrollSection}>
                <div className={styles.pointsScrollContainer}>
                    <Swiper
                        modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
                        spaceBetween={0}
                        slidesPerView={1}
                        direction="horizontal"
                        navigation
                        pagination={{ clickable: true }}
                        allowTouchMove={true}
                        resistance={true}
                        resistanceRatio={0}
                        touchEventsTarget="container"
                        autoplay={{
                            delay: 5000,
                            disableOnInteraction: false,
                            pauseOnMouseEnter: true,
                            waitForTransition: false,
                        }}
                        loop={true}
                        speed={1000}
                        onSwiper={(swiper) => {
                            swiperRef.current = swiper;
                        }}
                        onTouchStart={() => {
                            // 스와이프 시작 시 autoplay 재시작 (delay 없이)
                            if (swiperRef.current) {
                                swiperRef.current.autoplay?.stop();
                                swiperRef.current.autoplay?.start();
                            }
                        }}
                        onSlideChange={() => {
                            // 슬라이드 변경 시 autoplay 재시작 (delay 없이)
                            if (swiperRef.current) {
                                swiperRef.current.autoplay?.stop();
                                swiperRef.current.autoplay?.start();
                            }
                        }}
                        className={styles.swiperContainer}
                    >
                        <SwiperSlide>
                            <div className={styles.pointCard}>
                                <div className={styles.pointBadge}>POINT 1</div>
                                <h3 className={styles.pointTitle}>매일 정리하는 기록 관리</h3>
                                <p className={styles.pointDescription}>
                                    매일의 업무를 간단하게 기록하고 캘린더 형태로 한눈에 확인해
                                    보세요.
                                    <br />
                                    기록이 쌓일수록 업무 흐름이 명확하게 보여 더 효율적으로 관리할
                                    수 있어요.
                                </p>
                                <Image
                                    src="/assets/img/records.png"
                                    alt="record"
                                    width={630}
                                    height={292}
                                />
                            </div>
                        </SwiperSlide>

                        <SwiperSlide>
                            <div className={styles.pointCard}>
                                <div className={styles.pointBadge}>POINT 2</div>
                                <h3 className={styles.pointTitle}>탄탄하게 쌓아가는 이력 관리</h3>
                                <p className={styles.pointDescription}>
                                    경험을 차곡차곡 기록해 필요한 순간에 바로 꺼내 쓸 수 있는
                                    이력서를 만들어 보세요.
                                    <br />
                                    원하는 경력만 골라 담아 나에게 딱 맞는 이력서를 손쉽게 만들 수
                                    있어요.
                                </p>
                                <Image
                                    src="/assets/img/careers.png"
                                    alt="career"
                                    width={630}
                                    height={292}
                                />
                            </div>
                        </SwiperSlide>

                        <SwiperSlide>
                            <div className={styles.pointCard}>
                                <div className={styles.pointBadge}>POINT 3</div>
                                <h3 className={styles.pointTitle}>단계별로 준비하는 이직 관리</h3>
                                <p className={styles.pointDescription}>
                                    이직 과정 전체를 단계별로 챙기고 목표를 설정해 체계적으로 준비해
                                    보세요.
                                    <br />
                                    회고 기능을 활용하면 그동안의 경험을 통해 나만의 성장 흐름도
                                    만들 수 있어요.
                                </p>
                                <Image
                                    src="/assets/img/turnovers.png"
                                    alt="turnover"
                                    width={630}
                                    height={292}
                                />
                            </div>
                        </SwiperSlide>

                        <SwiperSlide>
                            <div className={styles.pointCard}>
                                <div className={styles.pointBadge}>POINT 4</div>
                                <h3 className={styles.pointTitle}>함께 관리하는 공유 기능</h3>
                                <p className={styles.pointDescription}>
                                    공유 기록장을 통해 다른 사람들과 일정을 간편하게 공유해 보세요.
                                    <br />
                                    업무는 물론 개인 일정까지 한곳에서 확인할 수 있어 전체 일정
                                    관리가 쉬워져요.
                                </p>
                                <Image
                                    src="/assets/img/shared-record-groups.png"
                                    alt="shared record groups"
                                    width={630}
                                    height={292}
                                />
                            </div>
                        </SwiperSlide>
                    </Swiper>
                </div>
            </section>

            {/* Final Message Section */}
            <section className={styles.finalSection}>
                <div className={styles.finalMessage}>
                    <p>시작하는 순간부터 달라지는 커리어 관리</p>
                    <p className={styles.finalText}>
                        당신의 내일을{" "}
                        <span className={styles.highlightYellow}>위크폴리오가 응원</span>
                        합니다.
                    </p>
                    <Link href="/records" className={styles.finalButton}>
                        무료로 내 기록 쌓아보기
                    </Link>
                </div>
            </section>
        </main>
    );
};

export default InfoContent;
