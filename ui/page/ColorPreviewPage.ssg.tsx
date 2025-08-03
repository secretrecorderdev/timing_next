export const dynamic = "force-static"; 

import { textColorMap, bgColorMap } from "../lib/colors";
import { ColorSetPreview } from "../atom/colors/ColorSetPreview";

export default function ColorPreviewPage() {
  const colorKeys = Object.keys({ ...textColorMap, ...bgColorMap });
  const uniqueKeys = [...new Set(colorKeys)];

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Color System</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div>hover: 마우스를 올려야 섹상이 보여짐</div>
          <div>active: 마우스 클릭, 모바일 터치시 색상이 변경됨</div>
        </div>
        <p>
          primary: 브랜드 주요 색상, 주 액션
          <br />
          secandary: 보조 색상, 부 액션
          <br />
          muted: 약한 강조
          <br />
          error: 오류, 경고, 실패
          <br />
          success: 긍정, 완료, 성공
          <br />
          disabled: 사용불가, 비활성화
          <br />
          default: 기본 색
        </p>
      </div>

      <br />
      <div className="space-y-8">
        {uniqueKeys.map((key) => (
          <ColorSetPreview
            key={key}
            label={key}
            text={textColorMap[key]}
            bg={bgColorMap[key]}
          />
        ))}
      </div>
    </div>
  );
}
