export const dynamic = "force-static";
import Image from "next/image";

export default async function InfoPage() {
  return (
    // 아래 버튼 링크 넣어야 함. EventPage 참조
    <div className="w-full min-h-screen bg-cover bg-center animate-cloak bg-[#013775]">
      <div className="relative w-[100%] aspect-[4/3] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-16 md:ps-24">
          <div className="relative top-[0%] md:top-[10%] ps-12 pe-12 md:ps-16  text-[6.00vw] md:text-[2.00vw] w-[100%] text-white">
            <div className="w-[70%] md:w-[50%] mb-6">
              <Image
                src="/assets/images/lagacy/main_logo_pc.png"
                alt="main_logo_pc"
                width={985}
                height={117}
              />
            </div>
            지금 <span className="text-[#0EAEFF] font-[700]">앱스토어</span>에서
            <br />
            <b className="font-[700] text-[12vw] md:text-[4vw]">마이파머스</b>를
            <br />
            만날 수 있습니다
            <div className="block md:hidden">
              <p className="relative font-[500] text-white text-[4.2vw] mt-10 mb-4">
                지금 앱에서 더 많은 정보를 확인해 보세요
              </p>
              <div className="w-[100%]">
                <a
                  href="https://play.google.com/store/apps/details?id=com.myfarmus.app"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src="/assets/images/lagacy/google_play_btn.png"
                    alt="main_logo_pc"
                    width={840}
                    height={150}
                  />
                </a>
              </div>
              <div className="w-[100%] mt-4">
                <a
                  href="https://apps.apple.com/kr/app/id6740599324"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src="/assets/images/lagacy/apple_btn.png"
                    alt="main_logo_pc"
                    width={840}
                    height={150}
                  />
                </a>
              </div>
            </div>
            <div className="hidden md:grid grid-cols-3 gap-4 mt-8">
              <div className="flex flex-col items-center">
                <p className="font-[700] text-[1.14vw] mb-2">
                  구글 플레이스토어
                </p>
                <a
                  href="https://play.google.com/store/apps/details?id=com.myfarmus.app"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src="/assets/images/lagacy/google_qr.png"
                    alt="google_qr"
                    width={2970}
                    height={2580}
                  />
                </a>
              </div>
              <div className="flex flex-col items-center">
                <p className="font-[700] text-[1.14vw] mb-2">애플 앱스토어</p>
                <a
                  href="https://apps.apple.com/kr/app/id6740599324"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src="/assets/images/lagacy/apple_qr.png"
                    alt="google_qr"
                    width={2970}
                    height={2580}
                  />
                </a>
              </div>
              <div className="flex flex-col items-center">
                <p className="font-[700] text-[1.14vw] mb-2">영농일지 PC</p>
                <a
                  href="https://www.myfarmus.com/diary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src="/assets/images/lagacy/app_icon.png"
                    alt="google_qr"
                    width={2970}
                    height={2580}
                  />
                </a>
              </div>
            </div>
            {/* 가운데 정렬 합시다. */}
            <div className="flex flex-col items-center md:items-start text-center md:text-start">
              <div className="flex items-center gap-[20px] mt-10 text-[4.0vw] md:text-[1.34vw]">
                <a href="/privacy-policy" target="_blank" className="block">
                  개인정보처리방침
                </a>
                <a href="/terms" target="_blank" className="block">
                  서비스이용약관
                </a>
              </div>
              <a
                href="mailto:myfarmus@lsmtron.com"
                target="_blank"
                className="inline-block font-[500] text-[4.0vw] md:text-[1.34vw]"
              >
                myfarmus@lsmtron.com
              </a>
            </div>
          </div>
          <div className="relative pt-8 right-0 w-[100%] hidden md:block">
            <Image
              src="/assets/images/lagacy/main_hand_pc.png"
              alt="main_hand_pc"
              width={2970}
              height={2580}
            />
          </div>
        </div>
        <div className="relative pt-8 pb-24 right-0 w-[100%] md:hidden">
          <Image
            src="/assets/images/lagacy/main_hand_mobile.png"
            alt="main_hand_pc"
            width={1032}
            height={1038}
          />
        </div>
      </div>
    </div>
  );
}

// main_hand_mobile.png
