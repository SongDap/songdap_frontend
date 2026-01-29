"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Header } from "@/shared";
import WithdrawalForm from "@/features/profile/components/WithdrawalForm";
import { WithdrawCompleteModal } from "@/features/profile/components/WithdrawCompleteModal";
import { withdrawUser } from "@/shared/api/userApi";
import { useOauthStore } from "@/features/oauth/model/useOauthStore";
import { trackEvent } from "@/lib/gtag";

export default function ProfileWithdrawPage() {
  const router = useRouter();
  const [openModal, setOpenModal] = useState(false);
  const logout = useOauthStore((s) => s.logout);

  return (
    <>
      <Header />

      <main className="mx-auto w-full max-w-[1440px] px-4 pt-8 md:px-20">
        <WithdrawalForm
          onSubmit={async (payload) => {
            // 백엔드 스펙: DELETE /api/v1/users (파라미터 없음)
            await withdrawUser();
            
            // 완료 이벤트 추적
            const primaryReason = payload.reasons[0] || "OTHER";
            trackEvent(
              { event: "withdraw", reason: primaryReason },
              { category: "profile", action: "withdraw", label: primaryReason }
            );
            
            // 로컬 상태 정리(쿠키는 백엔드가 삭제하지만, UI 캐시는 따로 정리)
            logout();

            // 탈퇴 성공 시 모달 오픈
            setOpenModal(true);
          }}
        />
      </main>

      {/* ✅ 탈퇴 완료 모달 */}
      <WithdrawCompleteModal
        open={openModal}
        onClose={() => {
          logout();
          setOpenModal(false);
          router.replace("/"); // 홈으로 이동
        }}
      />
    </>
  );
}
