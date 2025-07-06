import { render, screen } from '@testing-library/react'
import HorizontalTabs, { TabItem } from './HorizontalTabs'
import { textColorMap } from '@/ui/lib/colors';


describe("HorizontalTabs", () => {
  const tabs: TabItem[] = [
    { key: "tab1", label: "탭 1" },
    { key: "tab2", label: "탭 2" },
    { key: "tab3", label: "탭 3" },
  ];

  it('activeKey가 바뀌면 활성화된 탭이 변경되어야 한다', () => {
    const { rerender } = render(
      <HorizontalTabs tabs={tabs} activeKey="tab1" onChange={() => {}} />
    );

    const tab1 = screen.getByText('탭 1');
    const tab2 = screen.getByText('탭 2');

    expect(tab1).toHaveClass(textColorMap['primary'].default);

    rerender(
      <HorizontalTabs tabs={tabs} activeKey="tab2" onChange={() => {}} />
    );

    expect(tab2).toHaveClass(textColorMap['primary'].default);
    expect(tab1).not.toHaveClass(textColorMap['primary'].default);
  });
  it("모든 탭 라벨이 렌더링되어야 한다", () => {
    render(<HorizontalTabs tabs={tabs} activeKey="tab1" onChange={() => {}} />);

    expect(screen.getByText("탭 1")).toBeInTheDocument();
    expect(screen.getByText("탭 2")).toBeInTheDocument();
    expect(screen.getByText("탭 3")).toBeInTheDocument();
  });

  it("모든 탭을 클릭했을 때 각각 onChange가 올바르게 호출되어야 한다", () => {
    const handleChange = jest.fn(); // jest의 mock 함수
    render(
      <HorizontalTabs tabs={tabs} activeKey="tab1" onChange={handleChange} />
    );

    tabs.forEach((tab) => {
      const button = screen.getByText(tab.label);
      button.click();

      // 각 탭 클릭 시 그에 해당하는 key로 호출됐는지 확인
      expect(handleChange).toHaveBeenCalledWith(tab.key);
    });
  });

  it("초기 activeKey에 해당하는 탭에 활성화 스타일이 적용되어야 한다", () => {
    render(<HorizontalTabs tabs={tabs} activeKey="tab2" onChange={() => {}} />);

    const expectedClass = textColorMap['primary'].default;

    const activeTab = screen.getByText("탭 2");
    expect(activeTab).toHaveClass(expectedClass);
    expect(activeTab).toHaveClass("border-b-2");
  });

  it('tabs가 비어있을 때 아무것도 렌더링되지 않아야 한다', () => {
    render(<HorizontalTabs tabs={[]} activeKey="" onChange={() => {}} />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});