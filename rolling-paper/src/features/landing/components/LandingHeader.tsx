import Image from "next/image"
import Link from "next/link"

export default function LandingHeader() {
    return (
        <header className="landing-header">
            <Link href="/">
                <Image
                    src="/logo_name.png"
                    alt="logoName"
                    width={260}
                    height={100}
                    priority
                />
            </Link>
        </header>
    )
}