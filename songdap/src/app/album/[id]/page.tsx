import AlbumDetailPageClient from "./_client";

export async function generateStaticParams() {
  return [];
}

export const dynamicParams = true;

export default function AlbumDetailPage() {
  return <AlbumDetailPageClient />;
}
