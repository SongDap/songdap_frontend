import Image from "next/image";
import { LandingHeader, LandingMain, LandingFooter } from "@/features/landing";

export default function Page() {
    return (
        // 화면 크기 고정 스크롤을 차단
        <div className="relative h-dvh overflow-hidden">

            {/* 배경 기준 좌표 */}
            <div className="relative min-h-screen">
                <Image
                    src="/images/mainBackground.png"
                    alt="Main background"
                    fill
                    priority
                    className="object-cover object-center"
                />

                {/* 실제 배경 위 div */}
                <div className="relative z-10 flex min-h-screen flex-col">
                    <LandingHeader />
                    <LandingMain />
                    <LandingFooter />
                </div>
            </div>
        </div>
    );
}