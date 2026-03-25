import { useState } from 'react'
import DiagnosticDemo from './diagnostic-demo'
import BladeMonitorDashboard from './BladeMonitorDashboard/index'
import IndustrialVisionPlatform from './industrial-vision-platform'
import SmartAutoModeling from './smart-auto-modeling/index'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('modeling')

  return (
    <div className="app-container">
      {/* 顶部导航栏 */}
      <nav className="app-nav">
        <div className="nav-brand">
          <span>🏭 工业监测平台</span>
        </div>
        <div className="nav-links">
          <button
            className={`nav-link ${currentPage === 'modeling' ? 'active' : ''}`}
            onClick={() => setCurrentPage('modeling')}
          >
            智能自动建模
          </button>
          <button
            className={`nav-link ${currentPage === 'vision' ? 'active' : ''}`}
            onClick={() => setCurrentPage('vision')}
          >
            工业视觉平台
          </button>
          <button
            className={`nav-link ${currentPage === 'dashboard' ? 'active' : ''}`}
            onClick={() => setCurrentPage('dashboard')}
          >
            叶片监测仪表板
          </button>
          <button
            className={`nav-link ${currentPage === 'diagnostic' ? 'active' : ''}`}
            onClick={() => setCurrentPage('diagnostic')}
          >
            故障诊断系统
          </button>
        </div>
      </nav>

      {/* 主内容区域 */}
      <main className="app-main">
        {currentPage === 'modeling' && <SmartAutoModeling />}
        {currentPage === 'vision' && <IndustrialVisionPlatform />}
        {currentPage === 'dashboard' && <BladeMonitorDashboard />}
        {currentPage === 'diagnostic' && <DiagnosticDemo />}
      </main>
    </div>
  )
}

export default App
