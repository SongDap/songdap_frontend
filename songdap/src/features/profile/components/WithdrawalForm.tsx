"use client";

import { useMemo, useState } from "react";

type WithdrawalReason =
    | "HARD_TO_USE"
    | "NOT_THE_SERVICE"
    | "FOUND_BETTER"
    | "OTHER";

type WithdrawalFormPayload = {
    reasons: WithdrawalReason[]; // ✅ 복수 선택
    reasonDetail?: string; // ✅ OTHER일 때만
    email: string;
    confirmed: boolean;
};

type WithdrawalFormProps = {
    onSubmit: (payload: WithdrawalFormPayload) => Promise<void> | void;
};

export default function WithdrawalForm({ onSubmit }: WithdrawalFormProps) {
    const [reasons, setReasons] = useState<WithdrawalReason[]>([]);
    const [reasonDetail, setReasonDetail] = useState("");
    const [email, setEmail] = useState("");
    const [confirmed, setConfirmed] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const toggleReason = (value: WithdrawalReason) => {
        setReasons((prev) => {
            const next = prev.includes(value)
                ? prev.filter((r) => r !== value)
                : [...prev, value];

            // ✅ OTHER 해제되면 기타 사유 비우기
            if (value === "OTHER" && prev.includes("OTHER")) {
                setReasonDetail("");
            }

            return next;
        });
    };

    const isValid = useMemo(() => {
        if (!email.trim()) return false;
        if (reasons.length === 0) return false; // ✅ 사유 최소 1개
        if (reasons.includes("OTHER") && !reasonDetail.trim()) return false; // ✅ 기타면 내용 필수
        if (!confirmed) return false;
        return true;
    }, [email, reasons, reasonDetail, confirmed]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isValid || isSubmitting) return;

        setIsSubmitting(true);
        try {
            await onSubmit({
                reasons,
                reasonDetail: reasons.includes("OTHER") ? reasonDetail.trim() : undefined,
                email: email.trim(),
                confirmed,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mx-auto w-full max-w-3xl">
            <h1 className="mb-6 text-lg font-semibold text-gray-900">회원탈퇴</h1>

            <div className="rounded-lg border border-gray-200 bg-white p-6">
                <div className="mb-8">
                    <h2 className="mb-4 text-sm font-semibold text-gray-900">
                        노래로 답해줘를 떠나는 이유를 알려주세요
                    </h2>

                    <div className="space-y-2 text-sm text-gray-800">
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                value="HARD_TO_USE"
                                checked={reasons.includes("HARD_TO_USE")}
                                onChange={() => toggleReason("HARD_TO_USE")}
                            />
                            서비스를 이용하기 어려워요
                        </label>

                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                value="NOT_THE_SERVICE"
                                checked={reasons.includes("NOT_THE_SERVICE")}
                                onChange={() => toggleReason("NOT_THE_SERVICE")}
                            />
                            원하는 이용이 가능한 서비스가 아닌 것 같아요
                        </label>

                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                value="FOUND_BETTER"
                                checked={reasons.includes("FOUND_BETTER")}
                                onChange={() => toggleReason("FOUND_BETTER")}
                            />
                            대체할만한 서비스를 찾았어요
                        </label>

                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                value="OTHER"
                                checked={reasons.includes("OTHER")}
                                onChange={() => toggleReason("OTHER")}
                            />
                            기타
                        </label>

                        {/* ✅ 기타 체크 시에만 textarea 노출 */}
                        {reasons.includes("OTHER") && (
                            <textarea
                                value={reasonDetail}
                                onChange={(e) => setReasonDetail(e.target.value)}
                                placeholder="기타 사유를 입력해주세요"
                                className="mt-3 h-20 w-full resize-none rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#006FFF]"
                            />
                        )}
                    </div>
                </div>

                <div className="mb-6">
                    <label className="mb-2 block text-sm font-semibold text-gray-900">
                        이메일 확인
                    </label>
                    <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        placeholder="본인이 가입하신 이메일을 적어주세요"
                        className="h-11 w-full rounded-md border border-gray-300 px-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#006FFF]"
                    />
                </div>

                <div className="mb-6 rounded-md bg-gray-50 p-4 text-xs leading-relaxed text-gray-600">
                    <p>• 현재 사용 중인 계정은 회원 탈퇴일로부터 7일간 유지됩니다.</p>
                    <p>• 회원 탈퇴 시 작성한 모든 데이터는 삭제되며 복구가 불가능합니다.</p>
                    <p>• 탈퇴 후 동일한 이메일로 재가입할 수 있으며, 복구 정책은 서비스에 따라 달라질 수 있습니다.</p>
                    <p>• 계정 복구는 탈퇴 신청 후 7일 내에만 가능합니다.</p>
                </div>

                <label className="flex items-center gap-2 text-sm text-gray-800">
                    <input
                        type="checkbox"
                        checked={confirmed}
                        onChange={(e) => setConfirmed(e.target.checked)}
                    />
                    주의사항을 모두 확인하였습니다.
                </label>

                <div className="mt-6 flex justify-end">
                    <button
                        type="submit"
                        disabled={!isValid || isSubmitting}
                        className={`h-10 rounded-md px-6 text-sm font-semibold ${isValid && !isSubmitting
                                ? "bg-gray-900 text-white"
                                : "cursor-not-allowed bg-gray-200 text-gray-500"
                            }`}
                    >
                        {isSubmitting ? "처리 중..." : "회원 탈퇴"}
                    </button>
                </div>
            </div>
        </form>
    );
}
