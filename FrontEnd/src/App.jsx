import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Landing from './pages/Landing'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import DataUpload from './pages/DataUpload'
import ApiExplorer from './pages/ApiExplorer'

function App() {
  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />
        <main className="w-full min-h-[calc(100vh-8rem)]">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/dashboard" element={<DataUpload />} />
            <Route path="/dashboard/upload" element={<DataUpload />} />
            <Route path="/dashboard/api" element={<ApiExplorer />} />
          </Routes>
        </main>
      <Footer />
    </div>
  )
}

export default App