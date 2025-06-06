import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { io } from 'socket.io-client'
import App from './App.tsx'

// api: http://http://192.168.1.129:8080  http://127.0.0.1:8080
export const socket = io("http://192.168.1.129:8080", {
  transports:["websocket"],
  // port:8081,
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)
