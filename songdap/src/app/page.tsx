import { LandingMain } from "@/features/landing";
import { Header, Footer } from "@/shared";

export default function Page() {
    return (
        <>
            <Header />
            <div className="min-h-screen flex items-center justify-center">
                <LandingMain />
            </div>
            <Footer />
        </>
    );
}
