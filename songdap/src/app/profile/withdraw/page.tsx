"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Header } from "@/shared";
import WithdrawalForm from "@/features/profile/components/WithdrawalForm";
import { WithdrawCompleteModal } from "@/features/profile/components/WithdrawCompleteModal";
import { withdrawUser } from "@/shared/api/userApi";
import { useOauthStore } from "@/features/oauth/model/useOauthStore";

export default function ProfileWithdrawPage() {
  const router = useRouter();
  const [openModal, setOpenModal] = useState(false);
  const { user, logout } = useOauthStore();

  const logout = useOauthStore((s) => s.logout);


  return (
    <>
      <Header />

      <main className="mx-auto w-full max-w-[1440px] px-4 pt-8 md:px-20">
        <WithdrawalForm
          onSubmit={async (payload) => {
            await withdrawUser({
              nickname: user?.nickname || "",
              email: payload.email,
              profileImage: user?.profileImage,
              reasons: payload.reasons,
              reasonDetail: payload.reasonDetail,
            });

          onSubmit={async (payload) => {
            // 백엔드 스펙: DELETE /api/v1/users (파라미터 없음)
            // UI에서 받은 사유/이메일은 현재 서버에 전송하지 않음
            await withdrawUser();
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
