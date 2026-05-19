import { useState, useEffect } from 'react'
import { Menu, Icon, Drawer, Breadcrumb } from 'antd'
import DiagnosticDemo from './diagnostic-demo'
import BladeMonitorDashboard from './BladeMonitorDashboard/index'
import IndustrialVisionPlatform from './industrial-vision-platform/index'
import SmartAutoModeling from './smart-auto-modeling/index'
import StatsDashboard from './dashboard/index'
import { defaultTheme, darkTheme, applyTheme } from './theme'
import './App.less'

const { Item: MenuItem } = Menu
const { Item: BreadcrumbItem } = Breadcrumb

const NAV_MENUS = [
  { key: 'modeling', icon: 'robot', title: '智能自动建模' },
  { key: 'vision', icon: 'eye', title: '工业视觉平台' },
  { key: 'dashboard', icon: 'dashboard', title: '叶片监测仪表板' },
  { key: 'diagnostic', icon: 'tool', title: '故障诊断系统' },
  { key: 'overview', icon: 'bar-chart', title: '统计概览' },
]

const App = () => {
  const [currentPage, setCurrentPage] = useState('modeling')
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark')
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    const currentTheme = localStorage.getItem('theme') || 'dark'
    setTheme(currentTheme)
    applyTheme(currentTheme === 'dark' ? darkTheme : defaultTheme)
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'default' : 'dark'
    localStorage.setItem('theme', newTheme)
    setTheme(newTheme)
    applyTheme(newTheme === 'dark' ? darkTheme : defaultTheme)
    window.dispatchEvent(new Event('storage'))
  }

  const onMenuClick = ({ key }) => {
    setCurrentPage(key)
    setDrawerOpen(false)
  }

  const currentMenu = NAV_MENUS.find(m => m.key === currentPage)

  return (
    <div className="app-container">
      <header className="app-topbar">
        <Icon
          type="menu"
          className="app-topbar-hamburger"
          onClick={() => setDrawerOpen(true)}
        />
        <span className="app-topbar-title">工业监测平台</span>
        <div className="app-topbar-right">
          <button className="app-theme-toggle" onClick={toggleTheme}>
            {theme === 'dark' ? '☀️ 浅色' : '🌙 深色'}
          </button>
        </div>
      </header>

      <Drawer
        placement="left"
        closable={false}
        visible={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        width={220}
        bodyStyle={{ padding: 0, background: 'var(--component-background)', display: 'flex', flexDirection: 'column' }}
        style={{ top: 48 }}
        maskStyle={{ top: 48 }}
        zIndex={999}
      >
        <div className="app-drawer-header">
          <span className="app-drawer-header-title">导航菜单</span>
          <Icon
            type="close"
            className="app-drawer-close"
            onClick={() => setDrawerOpen(false)}
          />
        </div>
        <Menu
          mode="inline"
          selectedKeys={[currentPage]}
          onClick={onMenuClick}
          style={{ background: 'var(--component-background)', border: 'none', flex: 1 }}
        >
          {NAV_MENUS.map(m => (
            <MenuItem key={m.key}>
              <Icon type={m.icon} />
              <span>{m.title}</span>
            </MenuItem>
          ))}
        </Menu>
      </Drawer>

      <div className="app-breadcrumb">
        <Breadcrumb separator=">">
          <BreadcrumbItem>工业监测平台</BreadcrumbItem>
          {currentMenu && (
            <BreadcrumbItem>
              <Icon type={currentMenu.icon} style={{ marginRight: 4 }} />
              {currentMenu.title}
            </BreadcrumbItem>
          )}
        </Breadcrumb>
      </div>

      <main className="app-main">
        {currentPage === 'overview' ? (
          <StatsDashboard />
        ) : (
          <div className="app-page">
            {currentPage === 'modeling' && <SmartAutoModeling />}
            {currentPage === 'vision' && <IndustrialVisionPlatform />}
            {currentPage === 'dashboard' && <BladeMonitorDashboard />}
            {currentPage === 'diagnostic' && <DiagnosticDemo />}
          </div>
        )}
      </main>
    </div>
  )
}

export default App