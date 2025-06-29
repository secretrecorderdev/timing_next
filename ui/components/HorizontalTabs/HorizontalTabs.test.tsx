import { render, screen } from '@testing-library/react'
import HorizontalTabs, { TabItem } from './HorizontalTabs'


describe('HorizontalTabs', () => {
  const tabs: TabItem[] = [
    { key: 'tab1', label: '탭 1' },
    { key: 'tab2', label: '탭 2' },
    { key: 'tab3', label: '탭 3' },
  ]
  it('모든 탭 라벨이 렌더링되어야 한다', () => {
    render(<HorizontalTabs tabs={tabs} activeKey="tab1" onChange={() => {}} />)

    expect(screen.getByText('탭 1')).toBeInTheDocument()
    expect(screen.getByText('탭 2')).toBeInTheDocument()
    expect(screen.getByText('탭 3')).toBeInTheDocument()
  })
  
})