import Image from "next/image";
import LandingHeader from "@/features/landing/LandingHeader";
import LandingMain from "@/features/landing/LandingMain";
import LandingFooter from "@/features/landing/LandingFooter";

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