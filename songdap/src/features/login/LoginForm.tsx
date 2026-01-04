'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/shared/ui/Button';

export default function LoginForm() {
    const router = useRouter();

    // 입력값 상태관리
    const [nickname, setNickname] = useState('');
    const [email, setEmail] = useState('');
    const [agreed, setAgreed] = useState(false);

    // 모달 상태관리
    const [showModal, setShowModal] = useState(false);

    // 1. 유효성 검사
    const handleValidate = () => {
        if (!nickname) {
            alert('프로듀서님의 이름을 등록해주세요~')
            return;
        }
        if (!agreed) {
            alert('이용약관에 동의해주세요~ㅠㅠ')
            return;
        }
        setShowModal(true);
    }

    // 2. 최종 가입 요청
    const handleFinalSignup = async () => {
        try {
            console.log('서버로 회원가입 요청 : ', { nickname, email });
            // TODO: 실제 API 호출
            alert('회원가입이 완료됐어요~! 환영해요!');
            router.push('/');
        } catch (error) {
            console.error("회원가입 실패", error);
            alert('회원가입 실패... 다시 시도해주세요');
        }
    };

    return (
        <div className="min-h-dvh w-full flex items-center justify-center bg-black/5 overflow-hidden">
            {/* 전체 캔버스 */}
            <section className="relative w-full h-dvh overflow-hidden">
                {/* 배경 이미지 */}
                <img
                    src="/images/mainBackground.png"
                    alt="Background"
                    className="absolute inset-0 w-full h-full object-cover"
                />

                {/* 내부 영역: 최대 너비 설정 및 중앙 정렬 */}
                <div className="absolute left-1/2 top-0 -translate-x-1/2 w-full max-w-[800px] h-full px-5">

                    {/* 3분할 레이아웃 (Header - Main - Footer) */}
                    <div className="relative z-10 flex h-full flex-col">

                        {/* Header: 높이와 글자 크기를 화면에 따라 조절 */}
                        <header className="shrink-0 h-[25vh] min-h-[180px] flex flex-col items-center justify-center transition-all">
                            <h1 className="[font-family:var(--font-dung-geun-mo)] text-left leading-none font-normal">
                                {/* [수정됨] 반응형 폰트 사이즈 & 컬러 적용 */}
                                {/* 모바일: 40px / 태블릿: 60px / PC: 90px */}
                                <span className="block text-[40px] md:text-[60px] lg:text-[90px] text-black tracking-tight">
                                    사용할 <span className="text-[#5088C5]">닉네임</span>을
                                </span>
                                <span className="block text-[40px] md:text-[60px] lg:text-[90px] text-black tracking-tight mt-2">
                                    입력해주세요
                                </span>
                            </h1>
                        </header>

                        {/* Main (가운데 영역) */}
                        <main className="h-[60%] px-2 md:px-6">
                            <div className="h-full flex items-center justify-center">

                                {/* [핵심 수정] gap-24: 닉네임과 이메일 사이를 확실하게(96px) 벌림 */}
                                <div className="flex flex-col gap-24 w-full max-w-[704px]">

                                    {/* 닉네임 입력 (space-y-3: 라벨과 입력창 사이는 좁게 유지) */}
                                    <div className="space-y-3 w-full">
                                        <div className="flex items-end justify-between">
                                            <label className="[font-family:var(--font-dung-geun-mo)] text-[16px] md:text-[24px] font-normal text-black">
                                                닉네임(필수)
                                            </label>
                                            <span className="[font-family:var(--font-dung-geun-mo)] text-[14px] md:text-[18px] text-black/50">
                                                {nickname.length}/16
                                            </span>
                                        </div>
                                        <input
                                            value={nickname}
                                            onChange={(e) => setNickname(e.target.value.slice(0, 16))}
                                            // 높이 80px
                                            className="w-full h-[40px] rounded-lg border-[3px] border-black/80 bg-white/90 px-6 text-center text-[24px] md:text-[32px] focus:outline-none focus:border-[#5088C5] transition-all"
                                        />
                                    </div>

                                    {/* 이메일 입력 (mt-20 같은 거 다 지움 -> 부모 gap-24가 알아서 밀어줌) */}
                                    <div className="space-y-3 w-full">
                                        <label className="[font-family:var(--font-dung-geun-mo)] text-[16px] md:text-[24px] font-normal text-black">
                                            이메일(선택)
                                        </label>
                                        <input
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            // 높이 80px
                                            className="w-full h-[40px] rounded-lg border-[3px] border-black/80 bg-white/90 px-6 text-center text-[24px] md:text-[32px] focus:outline-none focus:border-[#5088C5] transition-all"
                                        />
                                    </div>

                                    {/* 약관 동의 */}
                                    <label className="flex items-center gap-4 pt-2 cursor-pointer select-none">
                                        <input
                                            type="checkbox"
                                            checked={agreed}
                                            onChange={(e) => setAgreed(e.target.checked)}
                                            className="w-6 h-6 md:w-8 md:h-8 accent-black shrink-0 border-2 border-black"
                                        />
                                        <span className="[font-family:var(--font-dung-geun-mo)] text-[16px] md:text-[24px] font-normal pt-1">
                                            이용약관 및 개인정보수집이용 동의{" "}
                                            <span className="text-red-500">(필수)</span>
                                        </span>
                                    </label>
                                </div>
                            </div>
                        </main>


                        {/* Footer (버튼 영역) */}
                        <footer className="shrink-0 h-[20vh] min-h-[140px] flex items-center justify-center pb-8">
                            <div className="w-full max-w-[560px]">
                                <Button
                                    onClick={handleValidate}
                                    outerColor="#D1D5DB"
                                    className="h-14 text-[20px] md:h-[78px] md:text-[32px]"
                                    style={{
                                        fontFamily: 'var(--font-dung-geun-mo)',
                                        fontWeight: 'normal'
                                    }}
                                >
                                    계정 만들기
                                </Button>
                            </div>
                        </footer>
                    </div>
                </div>

                {/* --- 모달 --- */}
                {showModal && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4">
                        <div className="bg-white border-[3px] border-black rounded-xl p-8 w-full max-w-[400px] shadow-2xl relative animate-fadeIn text-center">
                            <button
                                onClick={() => setShowModal(false)}
                                className="absolute top-3 right-4 text-2xl font-bold text-black hover:scale-110 transition-transform"
                            >
                                ✕
                            </button>

                            <h3 className="[font-family:var(--font-dung-geun-mo)] text-[22px] md:text-[26px] text-black mt-6 mb-10 leading-snug">
                                새로운 앨범을<br />발매하시겠습니까?
                            </h3>

                            <div className="flex gap-4 w-full">
                                <div className="flex-1">
                                    <Button
                                        onClick={handleFinalSignup}
                                        outerColor="#E5E7EB"
                                        className="h-12 text-[16px] md:h-[52px] md:text-[18px]"
                                    >
                                        네
                                    </Button>
                                </div>
                                <div className="flex-1">
                                    <Button
                                        onClick={() => router.push('/')}
                                        outerColor="#E5E7EB"
                                        className="h-12 text-[16px] md:h-[52px] md:text-[18px]"
                                    >
                                        다음에 발매
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
}