import { BrowserRouter } from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar";
import Sidebar from "./Components/Sidebar/Sidebar";
import Admin from "./Pages/Admin";
import { ToastProvider } from "./Context/ToastContext";
import './index.css';

export const backend_url = process.env.REACT_APP_BACKEND_URL;
export const currency = '₹';

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <div style={{ display:'flex', minHeight:'100vh', background:'var(--bg)' }}>
          <Sidebar />
          <div style={{ flex:1, marginLeft:'var(--sidebar-w)', display:'flex', flexDirection:'column' }}>
            <Navbar />
            <main style={{ marginTop:'var(--navbar-h)', flex:1, overflowY:'auto' }}>
              <Admin />
            </main>
          </div>
        </div>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
