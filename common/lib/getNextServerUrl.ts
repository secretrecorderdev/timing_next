
export const getNextServerUrl = (path: string) => {
  if (typeof window !== "undefined") {
    // 브라우저에서 실행 중이면 origin 붙이기
    return `${window.location.origin}${path}`;
  }
  // 서버 사이드 실행 (예: SSG/SSR)
  return `${process.env.NEXT_PUBLIC_SITE_URL}${path}`;
};