import { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { Menu, Icon, Drawer, Breadcrumb } from 'antd'
import DiagnosticDemo from './diagnostic-demo'
import BladeMonitorDashboard from './BladeMonitorDashboard/index'
import IndustrialVisionPlatform from './industrial-vision-platform/index'
import SmartAutoModeling from './smart-auto-modeling/index'
import StatsDashboard from './dashboard/index'
import HelpCenter from './helpCenter/index'
import { defaultTheme, darkTheme, applyTheme } from './theme'
import './App.less'

const { Item: MenuItem } = Menu
const { Item: BreadcrumbItem } = Breadcrumb

const NAV_MENUS = [
  { key: 'modeling',    path: '/modeling',    icon: 'robot',           title: '智能自动建模'   },
  { key: 'vision',      path: '/vision',      icon: 'eye',             title: '工业视觉平台'   },
  { key: 'dashboard',   path: '/dashboard',   icon: 'dashboard',       title: '叶片监测仪表板' },
  { key: 'diagnostic',  path: '/diagnostic',  icon: 'tool',            title: '故障诊断系统'   },
  { key: 'overview',    path: '/overview',    icon: 'bar-chart',       title: '统计概览'       },
  { key: 'helpCenter',  path: '/help',        icon: 'question-circle', title: '在线帮助中心'   },
]

const App = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const currentMenu = NAV_MENUS.find(m => location.pathname.startsWith(m.path))

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
    const menu = NAV_MENUS.find(m => m.key === key)
    if (menu) navigate(menu.path)
    setDrawerOpen(false)
  }

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
        wrapClassName="app-drawer"
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
          selectedKeys={currentMenu ? [currentMenu.key] : []}
          onClick={onMenuClick}
          className="app-nav-menu"
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
              <Icon type={currentMenu.icon} className="app-breadcrumb-icon" />
              {currentMenu.title}
            </BreadcrumbItem>
          )}
        </Breadcrumb>
      </div>

      <main className="app-main">
        <Routes>
          <Route path="/"           element={<Navigate to="/modeling" replace />} />
          <Route path="/modeling"   element={<div className="app-page"><SmartAutoModeling /></div>} />
          <Route path="/vision"     element={<div className="app-page"><IndustrialVisionPlatform /></div>} />
          <Route path="/dashboard"  element={<div className="app-page"><BladeMonitorDashboard /></div>} />
          <Route path="/diagnostic" element={<div className="app-page"><DiagnosticDemo /></div>} />
          <Route path="/overview"   element={<StatsDashboard />} />
          <Route path="/help"       element={<HelpCenter />} />
          <Route path="*"           element={<Navigate to="/modeling" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
