import dynamic from "next/dynamic";

const AlbumDetailPageClient = dynamic(
  () => import("./_client"),
  { ssr: false }
);

export async function generateStaticParams() {
  return [];
}

export const dynamicParams = true;

export default function AlbumDetailPage() {
  return <AlbumDetailPageClient />;
}
