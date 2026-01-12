import Image from "next/image";
import { LandingMain, LandingFooter } from "@/features/landing";

export default function Page() {
    return (
        <div className="min-h-screen flex justify-center relative overflow-hidden">
            {/* 배경 이미지 */}
            <Image
                src="/images/mainBackground.png"
                alt="backgroundimage"
                fill
                className="object-cover z-0"
                priority // 배경이니까 가장 먼저 로딩
            />
            <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[600px] flex-col">

                {/* 메인 콘텐츠 */}
                <main className="
                w-full max-w-[600px]
                flex flex-col
                items-center
                justify-start
                pt-10 pb-10
                ">
                    <LandingMain />
                </main>
                <footer className="w-full">
                    <LandingFooter />
                </footer>
            </div>
        </div>
    );
}