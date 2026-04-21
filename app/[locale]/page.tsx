// 기존 업체에서 플라스크를 통해서 SSR 을 하던 www.myfarmus.com 루트 페이지
// 플라스크에서 서버 렌더링 하던걸 NextJs 에 맞춰서 적용.
export const dynamic = 'force-static';
import { redirect } from 'next/navigation';

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect(`/${locale}/timing`);
}
