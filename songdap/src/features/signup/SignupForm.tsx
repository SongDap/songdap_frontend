"use client"; // 이 컴포넌트와 그 자식들은 브라우저(클라이언트)에서 실행되어야 한다
import { kMaxLength } from "buffer";
import { useMemo, useState } from "react";
import Button from "../../shared/ui/Button";

export default function SignupForm() {
    const [nickname, setNickname] = useState("");
    const [email, setEmail] = useState("");
    const [agreed, setAgreed] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showModal, setShowmodal] = useState(false);

    const MAX_NICK = 16;

    const nicknameLen = nickname.length;

    const canSubmit =
        nickname.trim().length > 0 &&
        nickname.trim().length <= MAX_NICK &&
        agreed && !isSubmitting;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!nickname.trim()) {
            alert("닉네임을 입력해주세요");
            return;
        }

        if (nickname.trim().length > MAX_NICK) {
            alert(`닉네임은 최대 ${MAX_NICK}까지 가능합니다.`);
            return;
        }

        if (!agreed) {
            alert("이용약관 및 개인정보에 동의해주세요");
            return;
        }

        try {
            setIsSubmitting(true);

            // await signup -> 나중에 api올 곳 이 주석에 바로 쓰면 됨

            setShowmodal(true);
            console.log("=== 계정 생성, 회원가입 성공 ===");
        } catch (error) {
            console.error("===회원가입 실패===");
            alert("회원가입에 실패했어요ㅠㅠ 다시 시도해주세요");
        } finally {
            setIsSubmitting(false);
        }
    }
    return (
        <main className="w-full px-4 pt-4 sm:pt-6 flex flex-col items-center">
            <article>
                <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[600px] flex-col">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6" aria-labelledby="signup-title">
                        <header className="text-left" style={{ fontFamily: 'YangJin' }}>
                            <h1
                                id="signup-title"
                                className="leading-[1.05] font-extrabold tracking-tight text-[#111]"
                                style={{ fontSize: 'clamp(2rem, 6vw, 2.75rem)' }}
                            >
                                사용할 <span className="text-[#4A86E8]">닉네임</span>을
                                <br />
                                입력해주세요
                            </h1>
                        </header>
                        {/* 닉네임 section */}
                        <section>
                            {/* input + label 묶음 전체를 가운데로 */}
                            <div className="flex justify-center">
                                {/* 이 박스가 704px 기준선 */}
                                <div style={{ width: 'clamp(300px, 80vw, 704px)' }}>

                                    {/* 라벨 + 카운터 (input과 같은 폭) */}
                                    <div className="mb-2 flex items-end justify-between">
                                        <label htmlFor="nickname" className="font-medium text-[#222]" style={{ fontSize: 'clamp(0.8rem, 2vw, 0.875rem)' }}>
                                            닉네임(필수)
                                        </label>
                                        <span className="text-[#6b7280]" style={{ fontSize: 'clamp(0.7rem, 1.5vw, 0.75rem)' }}>
                                            {nickname.length}/{MAX_NICK}
                                        </span>
                                    </div>

                                    {/* input */}
                                    <input
                                        id="nickname"
                                        name="nickname"
                                        value={nickname}
                                        onChange={(e) => setNickname(e.target.value)}
                                        maxLength={MAX_NICK}
                                        className="w-full rounded-[6px] border border-[#b9b1a8] bg-white px-5 outline-none focus:ring-2 focus:ring-[#4A86E8]/30"
                                        style={{
                                            height: 'clamp(44px, 6vh, 56px)',
                                            fontSize: 'clamp(16px, 3.5vw, 20px)'
                                        }}
                                    />
                                </div>
                            </div>
                        </section>

                        {/* 이메일 section */}
                        <section>
                            {/* input + label 묶음 전체를 가운데로 */}
                            <div className="flex justify-center">
                                {/* 이 박스가 704px 기준선 */}
                                <div style={{ width: 'clamp(300px, 80vw, 704px)' }}>

                                    {/* 라벨 + 카운터 (input과 같은 폭) */}
                                    <div className="mb-2 flex items-end justify-between">
                                        <label htmlFor="email" className="font-medium text-[#222]" style={{ fontSize: 'clamp(0.8rem, 2vw, 0.875rem)' }}>
                                            이메일(선택)
                                        </label>
                                    </div>

                                    {/* input */}
                                    <input
                                        id="email"
                                        name="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full rounded-[6px] border border-[#b9b1a8] bg-white px-5 outline-none focus:ring-2 focus:ring-[#4A86E8]/30"
                                        style={{
                                            height: 'clamp(44px, 6vh, 56px)',
                                            fontSize: 'clamp(16px, 3.5vw, 20px)'
                                        }}
                                    />
                                </div>
                            </div>
                        </section>

                        <div className="flex items-center gap-2">
                            <input
                                id="agreed"
                                type="checkbox"
                                checked={agreed}
                                onChange={(e) => setAgreed(e.target.checked)}
                                className="h-4 w-4 rounded-[2px] border border-gray-400"
                            />
                            <label htmlFor="agreed" className="text-gray-800" style={{ fontSize: 'clamp(0.7rem, 1.5vw, 0.75rem)' }}>
                                이용약관 및 개인정보수집이용 동의{" "}
                                <span className="text-red-500">(필수)</span>
                            </label>
                        </div>
                        <div className="mt-12 w-full flex justify-center">
                            <button
                                type="submit"
                                disabled={!canSubmit}
                                className="
                                w-full max-w-[704px]
                                h-[64px] sm:h-[80px] md:h-[96px]
                                rounded-[10px]
                                border-[3px] border-black
                                bg-[#d9d9d9]
                                text-black
                                text-[18px] sm:text-[22px] md:text-[28px]
                                font-[var(--font-cafe24-proslim)]
                                flex items-center justify-center
                                transition
                                disabled:opacity-40
                                disabled:cursor-not-allowed
                                "
                            >
                                계정 만들기
                            </button>
                        </div>

                    </form>

                </div>
            </article>
            {showModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4"
                    role="dialog"
                    aria-modal="true"
                >
                    <div className="w-full max-w-[520px] rounded-[16px] border-2 border-black bg-white p-6">
                        {/* 상단: 제목 + 닫기 */}
                        <div className="flex items-start justify-between">
                            <p className="text-[20px] font-bold text-black">
                                새로운 앨범을 발매하시겠습니까?
                            </p>

                            <button
                                type="button"
                                onClick={() => setShowmodal(false)}
                                className="text-[24px] leading-none text-black"
                                aria-label="닫기"
                            >
                                ×
                            </button>
                        </div>

                        {/* 하단 버튼들 */}
                        <div className="mt-6 flex justify-center gap-6">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowmodal(false);
                                    // TODO: "네" 선택 후 동작 (예: 라우팅)
                                }}
                                className="h-[52px] w-[120px] rounded-[6px] border-2 border-black bg-[#d9d9d9] font-bold"
                            >
                                네
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setShowmodal(false);
                                    // TODO: "다음에 발매" 선택 후 동작
                                }}
                                className="h-[52px] w-[180px] rounded-[6px] border-2 border-black bg-[#d9d9d9] font-bold"
                            >
                                다음에 발매
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </main>
    );
}


