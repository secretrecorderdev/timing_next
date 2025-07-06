import type { Metadata } from 'next'

export const baseMetadata: Metadata = {
  title: '더타이밍',
  description: '더 타이밍 웹 페이지 입니다.',
  applicationName: '더타이밍',
  metadataBase: new URL('https://www.the-timing.com'),
  openGraph: {
    type: 'website',
    url: 'https://www.the-timing.com',
    title: '더타이밍',
    description: '주식은 타이밍!',
    siteName: '더타이밍',
    images: [
      {
        url: '/assets/images/lagacy/main_og_image.png',
        width: 1200,
        height: 630,
        alt: '더타이밍 대표 이미지',
      },
    ],
    locale: 'ko_KR',
  },
  twitter: {
    card: 'summary',
    title: '더타이밍',
    description: '주식은 타이밍!',
    images: ['/assets/images/lagacy/main_og_image.png'],
  },
  icons: {
    icon: '/favicon.ico',
    // apple: 은 원래 apple-touch-icon.png 이 들어가 있었으나 파일이 존재하지 않음. 웹 사이트를 아이폰 앱 홈에 추가할때 사용하는 아이콘, 2025-06-19, jang
    apple: '/assets/images/lagacy/ic_launcher.png',
  },
  other: {
    'naver-site-verification': '71d83bacef7b7ea6fce9eb9bce9c27872c316af5',
  },
  alternates: {
    canonical: 'https://www.myfarmus.com',
  },
  appLinks: {
    android: {
      package: 'com.myfarmus.app',
      app_name: '주식은 타이밍!',
      url: 'https://play.google.com/store/apps/details?id=com.myfarmus.app',
    },
    ios: {
      app_store_id: '6740599324',
      app_name: '주식은 타이밍!',
      url: 'https://apps.apple.com/kr/app/id6740599324',
    },
  },
}
