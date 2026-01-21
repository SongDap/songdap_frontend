import { SignupForm } from "@/features/signup/components/SignupForm";

export default function Page() {
  return (
    <div className="flex justify-center min-h-screen bg-white py-10">
      <main className="w-full max-w-[728px] px-5">
        <SignupForm />
      </main>
    </div>
  );
}