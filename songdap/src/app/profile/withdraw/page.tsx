"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Header } from "@/shared";
import WithdrawalForm from "@/features/profile/components/WithdrawalForm";
import { WithdrawCompleteModal } from "@/features/profile/components/WithdrawCompleteModal";

export default function ProfileWithdrawPage() {
  const router = useRouter();
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <Header />

      <main className="mx-auto w-full max-w-[1440px] px-4 pt-8 md:px-20">
        <WithdrawalForm
          onSubmit={async () => {
            // TODO: 회원탈퇴 API 연결
            // await withdrawUser();

            // 탈퇴 성공 시 모달 오픈
            setOpenModal(true);
          }}
        />
      </main>

      {/* ✅ 탈퇴 완료 모달 */}
      <WithdrawCompleteModal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          router.replace("/"); // 홈으로 이동
        }}
      />
    </>
  );
}
