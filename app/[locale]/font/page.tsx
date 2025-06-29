export default function Font() {
  const weights = [
    { weight: 100, label: 'Thin (100)' },
    { weight: 200, label: 'ExtraLight (200)' },
    { weight: 300, label: 'Light (300)' },
    { weight: 400, label: 'Regular (400)' },
    { weight: 500, label: 'Medium (500)' },
    { weight: 600, label: 'SemiBold (600)' },
    { weight: 700, label: 'Bold (700)' },
    { weight: 800, label: 'ExtraBold (800)' },
    { weight: 900, label: 'Black (900)' },
  ];
  return (
    <div className="">
      <div className="p-8 space-y-6">
      {/* Pretendard 적용 */}
      <div style={{ fontFamily: 'sans-serif', fontSize: '1.25rem' }}>
        이 텍스트는 <strong>sans-serif</strong> 폰트를 사용합니다.
      </div>
      <div style={{ fontFamily: 'Pretendard', fontSize: '1.25rem' }}>
        이 텍스트는 <strong>Pretendard</strong> 폰트를 사용합니다.
      </div>
      <div>
        이 텍스트는 <strong>Default</strong> 폰트를 사용합니다.
      </div>
      {weights.map(({ weight, label }) => (
        <div
          key={weight}
          style={{
            fontFamily: 'Pretendard',
            fontWeight: weight,
            fontSize: '1.25rem',
          }}
        >
          이 텍스트는 Pretendard <strong>{label}</strong> 입니다.
        </div>
      ))}
      {/* Arial 적용 */}
     
    </div>
    </div>
  );
}
