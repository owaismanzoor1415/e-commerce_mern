import { BrowserRouter } from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar";
import Sidebar from "./Components/Sidebar/Sidebar";
import Admin from "./Pages/Admin";
import { ToastProvider } from "./Context/ToastContext";

export const backend_url = process.env.REACT_APP_BACKEND_URL;
export const currency = '₹';

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <div className="flex min-h-screen bg-gray-50">
          {/* Sidebar - Fixed Left */}
          <Sidebar />

          {/* Main Content Area */}
          <div className="flex-1 ml-64">
            {/* Navbar - Fixed Top */}
            <Navbar />

            {/* Page Content - Below Navbar */}
            <div className="mt-16">
              <Admin />
            </div>
          </div>
        </div>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;

