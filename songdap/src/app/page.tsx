import Image from "next/image";
import { LandingHeader, LandingMain, LandingFooter } from "@/features/landing";

export default function Page() {
    return (
    <div className="relative h-dvh overflow-hidden">

            <div className="relative min-h-screen">
                <Image
                    src="/mainBackground.png"
                    alt="Main background"
                    fill
                    priority
                    className="object-cover object-center"
                />

                <div className="relative z-10 flex min-h-screen flex-col">
                    <LandingHeader />
                    <LandingMain />
                    <LandingFooter/>
                </div>
            </div>
        </div>
    );
}