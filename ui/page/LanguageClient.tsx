'use client';

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from "../atom/button/Button";
import { Text } from '../atom/text/Text';

export default function LanguageClient() {
  const { locale, setLocale } = useLanguage();
  const { t } = useTranslation();
  const [selectedLocale, setSelectedLocale] = useState(locale);

  useEffect(() => {
    setSelectedLocale(locale); // 외부 변경에도 반응
  }, [locale]);

  const handleClick = (lang: 'ko' | 'en') => {
    setLocale(lang);
    setSelectedLocale(lang); // 선택된 언어 상태 갱신
  };

  const baseBtn =
    'px-4 py-2 rounded-lg transition font-medium border shadow-sm';

  return (
    <main className="ps-10">
      <br />

      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        번역되는 글자 : {t("greeting")}
      </h1>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Text variant="heading" size="lg" color="success">
            로그인에 성공했습니다.
          </Text>
          <Text variant="heading" size="lg" color="error">
            아이디 및 비밀번호를 확인 해 주세요.
          </Text>
          <Text variant="heading" size="lg">
            이것은 주 제목 입니다.
          </Text>
          <Text variant="body" size="md">
            이것은 부 제목 입니다.
          </Text>
          <br />
          <Button size="lg">버튼 라지</Button>
          <br />
          <br />
          <Button size="md">버튼 중간</Button>
          <br />
          <br />
          <Button size="md" outline>
            버튼 중간
          </Button>
          <br />
          <br />
          <Button size="sm">버튼 스몰</Button>
          <br />
          <br />
        </div>
        {/* <div>
          <Button size="md">확인</Button> <Button size="md" variant='muted' className= "mr-1">취소</Button>
          <Button size="md" variant='error'>삭제</Button> <Button size="md" variant='secondary'>임시저장</Button>
        </div> */}
        <div>
          <Button size="md">확인</Button> <Button size="md" variant='muted' className= "mr-1">취소</Button>
          <Button size="md" variant='error'>삭제</Button> <Button size="md" className= "mr-1" variant='secondary'>임시저장</Button>
          <Button size="md" variant='success'>제출</Button>
        </div>
      </div>

      <nav className="p-4 flex items-center gap-4 bg-gray-100 rounded-xl">
        <button
          onClick={() => handleClick("ko")}
          className={`${baseBtn} ${
            selectedLocale === "ko"
              ? "bg-blue-500 text-white border-blue-600"
              : "bg-white text-gray-800 border-gray-300 hover:bg-gray-200"
          }`}
        >
          한국어
        </button>
        <button
          onClick={() => handleClick("en")}
          className={`${baseBtn} ${
            selectedLocale === "en"
              ? "bg-blue-500 text-white border-blue-600"
              : "bg-white text-gray-800 border-gray-300 hover:bg-gray-200"
          }`}
        >
          English
        </button>

        <p className="ml-4 text-gray-700 text-sm">
          현재 언어: <span className="font-semibold">{locale}</span>
        </p>
      </nav>
    </main>
  );
}