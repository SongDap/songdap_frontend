"use client";

import { useRouter } from "next/navigation";
import { Header } from "@/shared";
import { updateMe } from "@/shared/api";
import ProfileEditForm from "@/features/profile/components/ProfileEditForm";

export default function ProfileEditPage() {
  const router = useRouter();

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-[1440px] px-4 pt-8 md:px-20">
        <h1 className="mb-10 text-center text-[28px] font-semibold text-gray-900">
          개인정보 변경
        </h1>
        <ProfileEditForm
          onSubmit={async (payload) => {
            await updateMe(payload as any);
            router.replace("/");
          }}
        />
      </main>
    </>
  );
}

