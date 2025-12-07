"use client";

import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y, Autoplay, Mousewheel } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import Link from "next/link";
import Image from "next/image";

import Footer from "@/components/portal/layouts/Footer";

// Swiper CSS
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "swiper/css/autoplay";
import "swiper/css/mousewheel";

const InfoContent: React.FC = () => {
    const scrollSectionRef = useRef<HTMLDivElement | null>(null);
    const swiperRef = useRef<SwiperType | null>(null);

    return (
        <main>
            <section>
                <div className="contents">
                    <div className="info-wrap">
                        <div className="intro1">
                            <div className="probl">
                                <Image
                                    src="/assets/img/info/info-img01.svg"
                                    alt="man"
                                    width={1}
                                    height={1}
                                />
                                <Image
                                    src="/assets/img/info/info-img02.svg"
                                    alt="woman"
                                    width={1}
                                    height={1}
                                />
                                <ul>
                                    <li>참여했던 프로젝트 내용이 잘 기억나지 않아요.</li>
                                    <li>이직 준비, 제대로 하고 있는 건지 잘 모르겠어요.</li>
                                    <li>업무랑 개인 일정 관리가 자꾸 꼬여요.</li>
                                    <li>흩어진 이력을 한곳에서 편하게 관리하고 싶어요.</li>
                                </ul>
                            </div>
                            <div className="dots">
                                <span></span>
                            </div>
                            <div className="resolve">
                                <Image
                                    src="/assets/img/logo/img-logo01.svg"
                                    alt="workfolio"
                                    width={174}
                                    height={50}
                                />
                                <p>
                                    놓치는 이력이 있을까 두려운 당신에게
                                    <br />
                                    일과 이력을 한곳에 쌓아두는 나만의 기록장{" "}
                                    <span>워크폴리오</span>
                                </p>
                            </div>
                        </div>
                        <div className="intro2">
                            <Image
                                src="/assets/img/info/info-img03.svg"
                                alt="articles"
                                width={1}
                                height={1}
                            />
                            <div>
                                <span>점점 더 닫히는 취업문, 앞으로의 이직 준비가 막막하다면</span>
                                <p>
                                    커리어에도 <span>계획이 필요할 때</span>입니다.
                                </p>
                            </div>
                            <ul>
                                <li>
                                    <p>지원자 A</p>
                                    <ul>
                                        <li>
                                            기간, 성과, 역할 등 정확한 기록이 없어
                                            <br />
                                            오류가 많고 완성도가 낮은 이력서 작성
                                        </li>
                                        <li>
                                            프로젝트 세부 내용을 기억하지 못해
                                            <br />
                                            추상적이고 모호한 답변만 반복
                                        </li>
                                        <li>
                                            부족한 경험 축적과 분석으로
                                            <br />
                                            불분명한 커리어 방향 설정
                                        </li>
                                    </ul>
                                    <div>불 합 격</div>
                                </li>
                                <li>
                                    <Image
                                        src="/assets/img/info/info-img04.svg"
                                        alt="versus"
                                        width={1}
                                        height={1}
                                    />
                                </li>
                                <li>
                                    <p>지원자 B</p>
                                    <ul>
                                        <li>
                                            기간, 성과, 역할을 정확히 기재하여
                                            <br />
                                            품질이 균일하고 완성도가 높은 이력서 작성
                                        </li>
                                        <li>
                                            기록된 성과를 기반으로
                                            <br />
                                            객관적이고 구체적으로 설명하는 답변 제시
                                        </li>
                                        <li>
                                            일관된 성장 맥락과 직무 적합성이 드러나
                                            <br />
                                            명확한 커리어 흐름 전달
                                        </li>
                                    </ul>
                                    <div>합 격</div>
                                </li>
                            </ul>
                        </div>
                        <div
                            ref={scrollSectionRef as React.RefObject<HTMLDivElement | null>}
                            className="func"
                        >
                            <Swiper
                                modules={[
                                    Navigation,
                                    Pagination,
                                    Scrollbar,
                                    A11y,
                                    Autoplay,
                                    Mousewheel,
                                ]}
                                spaceBetween={0}
                                slidesPerView={1}
                                direction="horizontal"
                                navigation
                                pagination={{ clickable: true }}
                                // mousewheel={true}
                                allowTouchMove={true}
                                resistance={true}
                                resistanceRatio={0}
                                touchEventsTarget="container"
                                autoplay={{
                                    delay: 3000,
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
                                className="func-swiper"
                            >
                                <SwiperSlide>
                                    <div className="num">POINT 1</div>
                                    <div className="desc">
                                        <div>
                                            매일 정리하는 <span>기록 관리</span>
                                        </div>
                                        <p>
                                            매일의 업무를 간단하게 기록하고 캘린더 형태로 한눈에
                                            확인해 보세요.
                                            <br />
                                            기록이 쌓일수록 업무 흐름이 명확하게 보여 더 효율적으로
                                            관리할 수 있어요.
                                        </p>
                                    </div>
                                    <Image
                                        src="/assets/img/info/info-img05.svg"
                                        alt="record"
                                        width={1}
                                        height={1}
                                    />
                                </SwiperSlide>
                                <SwiperSlide>
                                    <div className="num">POINT 2</div>
                                    <div className="desc">
                                        <div>
                                            탄탄하게 쌓아가는 <span>이력 관리</span>
                                        </div>
                                        <p>
                                            경험을 차곡차곡 기록해 필요한 순간에 바로 꺼내 쓸 수
                                            있는 이력서를 만들어 보세요.
                                            <br />
                                            원하는 경력만 골라 담아 나에게 딱 맞는 이력서를 손쉽게
                                            만들 수 있어요.
                                        </p>
                                    </div>
                                    <Image
                                        src="/assets/img/info/info-img06.svg"
                                        alt="record"
                                        width={1}
                                        height={1}
                                    />
                                </SwiperSlide>
                                <SwiperSlide>
                                    <div className="num">POINT 3</div>
                                    <div className="desc">
                                        <div>
                                            단계별로 준비하는 <span>이직 관리</span>
                                        </div>
                                        <p>
                                            이직 과정 전체를 단계별로 챙기고 목표를 설정해
                                            체계적으로 준비해 보세요.
                                            <br />
                                            회고 기능을 활용하면 그동안의 경험을 통해 나만의 성장
                                            흐름도 만들 수 있어요.
                                        </p>
                                    </div>
                                    <Image
                                        src="/assets/img/info/info-img07.svg"
                                        alt="record"
                                        width={1}
                                        height={1}
                                    />
                                </SwiperSlide>
                                <SwiperSlide>
                                    <div className="num">POINT 4</div>
                                    <div className="desc">
                                        <div>
                                            함께 관리하는 <span>공유 관리</span>
                                        </div>
                                        <p>
                                            공유 기록장을 통해 다른 사람들과 일정을 간편하게 공유해
                                            보세요.
                                            <br />
                                            업무는 물론 개인 일정까지 한곳에서 확인할 수 있어 전체
                                            일정 관리가 쉬워져요.
                                        </p>
                                    </div>
                                    <Image
                                        src="/assets/img/info/info-img08.svg"
                                        alt="record"
                                        width={1}
                                        height={1}
                                    />
                                </SwiperSlide>
                            </Swiper>
                        </div>
                        <div className="action">
                            <div>
                                <span>시작하는 순간부터 달라지는 커리어 관리</span>
                                <p>
                                    당신의 내일을 <span>워크폴리오가 응원</span>합니다.
                                </p>
                            </div>
                            <Link href="/records">무료로 내 기록 쌓아보기</Link>
                        </div>
                    </div>
                </div>
                <Footer />
            </section>
        </main>
    );
};

export default InfoContent;
