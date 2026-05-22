import { StrictMode } from 'react'
import ReactDOM from 'react-dom'
import { HashRouter } from 'react-router-dom'
import 'antd/dist/antd.css'
import '../theme/index.less'
import '../theme/antchange.less'
import './index.css'
import App from './App.jsx'

ReactDOM.render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
  document.getElementById('root')
)
