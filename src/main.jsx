import { StrictMode } from 'react'
import ReactDOM from 'react-dom'
import 'antd/dist/antd.css'
import '../theme/index.less'
import '../theme/antchange.less'
import './index.css'
import App from './App.jsx'

ReactDOM.render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.getElementById('root')
)
