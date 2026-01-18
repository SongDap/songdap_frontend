import { Header, Footer } from "@/shared";
import Link from "next/link";
import { ROUTES } from "@/shared/lib";

export default function AlbumListPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen">
        <div className="max-w-[1440px] mx-auto px-4 md:px-20 pt-8">
          <section className="flex items-end gap-4">
            <div>
              <h1 className="text-[50px] font-bold">내 앨범</h1>
              <p className="text-[15px] mt-2">친구들의 노래가 담길 앨범을 만들어보세요.</p>
            </div>
            <Link href={ROUTES.ALBUM.CREATE}>
              <button className="px-4 py-2 bg-[#006FFF] text-white rounded-lg text-base font-medium hover:bg-[#0056CC] transition-colors mb-1">
                + 새 앨범 만들기
              </button>
            </Link>
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
}
