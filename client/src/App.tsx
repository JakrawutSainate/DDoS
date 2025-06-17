import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import Home from "./pages/Home"
import User from "./pages/User"
import About from "./pages/About"
import NotFound from "./pages/NotFound"
import Live from "./pages/Live"

export default function App() {
  return (
    <Router>
      <Toaster position="top-right" reverseOrder={false} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/user" element={<User />} />
          <Route path="/about" element={<About/>} />
          <Route path="/live" element={<Live />} />
         <Route path="*" element={<NotFound />} />
        </Routes>
    </Router>
  )
}