export const dynamic = "force-static";

import Image from "next/image";

export default function EventPage() {
  return (
    <div className="w-full flex justify-center">
      {/* PC 전용 */}
      <div className="hidden md:block relative max-w-[1280px]">
        <Image
          src="/assets/images/event/sign_up_event_pc.png"
          alt="이벤트 PC 배너"
          width={1440}
          height={4000} // 정확한 비율 지정 필요
          priority
          className="w-full h-auto"
        />
        <div className="absolute top-4 right-56 z-10">
          <a
            href="https://www.myfarmus.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/assets/images/event/text_logo_transparency.png"
              alt="홈 링크 버튼"
              width={182}
              height={18}
            />
          </a>
        </div>
      </div>

      {/* 모바일 전용 */}
      <div className="block md:hidden w-full">
        {/* 아래는 원래 relative 없이 이미지만 넣었으나 버튼 레이아웃과 하얀색 경계선이 생김 
        현재 반응형이기 때문에 이미지가 정확한 pixel 단위로 떨어지지 않아서 하얀색 선이 생김
        따라서 image 아래에 absolute div 를 추가함으로써 강제로 1pixel 을 넣음, 2025-06-25, jang*/}
        <div className="relative">
          <Image
            src="/assets/images/event/sign_up_event_mo_top.png"
            alt="이벤트 모바일 배너"
            width={390}
            height={1000}
            className="w-full h-auto block align-top"
          />
          {/* 덮어쓰기용 1~2px 줄 */}
          <div className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-[#2058C8] pointer-events-none z-10" />
        </div>
        <div className="flex flex-col items-center justify-end gap-16 pt-12 pb-8 px-[20%] bg-[url('/assets/images/event/sign_up_event_mo_upper_button_bg.png')] bg-no-repeat bg-center bg-cover">
          <a
            href="https://www.myfarmus.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/assets/images/event/text_logo_transparency.png"
              alt="홈 링크 텍스트 버튼"
              width={446}
              height={51}
            />
          </a>
        </div>
        {/* <Image
          src="/assets/images/event/sign_up_event_mo_upper_button_bg.png"
          alt="이벤트 모바일 배너"
          width={390}
          height={3000}
          className="w-full h-auto"
        /> */}
        <Image
          src="/assets/images/event/sign_up_event_mo_top_under_button.png"
          alt="이벤트 모바일 배너"
          width={390}
          height={3000}
          className="w-full h-auto"
        />
        <div className="flex flex-col items-center justify-end gap-16 pt-18 pb-32 bg-[url('/assets/images/event/sign_up_event_mo_button_bg.png')] bg-no-repeat bg-center bg-cover">
          <div className="w-full px-16">
            <a
              href="https://play.google.com/store/apps/details?id=com.myfarmus.app"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full"
            >
              <Image
                src="/assets/images/event/sign_up_event_android.png"
                alt="이벤트 참여하기 버튼"
                width={240}
                height={167}
                className="w-full h-auto"
              />
            </a>
          </div>

          <div className="w-full px-16">
            <a
              href="https://apps.apple.com/kr/app/id6740599324"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full"
            >
              <Image
                src="/assets/images/event/sign_up_event_apple.png"
                alt="이벤트 참여하기 버튼"
                width={240}
                height={167}
                className="w-full h-auto"
              />
            </a>
          </div>
        </div>
        <Image
          src="/assets/images/event/sign_up_event_mo_bottom_new.png"
          alt="이벤트 모바일 배너"
          width={390}
          height={3000}
          className="w-full h-auto"
        />
      </div>
    </div>
  );
}
