import Image from "next/image"

export default function LandingMain(){
    return(
        <main className = "landing-main">
            <Image
                src = "/lp_mainpage.png"
                alt = "lpmainpage"
                width = {360}
                height = {360}
                priority
            />
        </main>
    )
}