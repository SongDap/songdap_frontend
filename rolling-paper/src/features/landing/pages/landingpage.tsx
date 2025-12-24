import Image from "next/image";
import "../styles/landing.css"

import LandingHeader from "../components/LandingHeader";
import LandingMain from "../components/LandingMain";
import LandingFooter from "../components/LandingFooter";

// 여기는 배경만
export default function LnadingPage(){
    return(
        
        <div className="landing-port">
            <Image
                src = "/mainBackground.png"
                alt = "background"
                priority
                fill
                className="landing-bg"
            />
            <div className="landing-shell">
                <LandingHeader/>
                <LandingMain/>
                <LandingFooter/>
            </div>
        </div>
    )
}