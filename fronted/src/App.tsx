import { BrowserRouter , Routes, Route  , Navigate , useNavigate} from "react-router-dom";
import Layout from "./components/ui/Layout";
import Login from "@/pages/Login"
import Signup from "@/pages/Signup"
import CreateMediaPage from "./pages/CreateMedia"
import EditMedia from "./pages/EditMedia"
import MediaList from "./pages/MediaList"

export default function App() {
  const navigate = useNavigate()

  return (
  
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />

        <Route element={<Layout />}>
        <Route path="/signup" element={<Signup />} />
        <Route path="/create-media" element={<CreateMediaPage />} />
        <Route path="/media/edit/:id" element={<EditMedia/>} />
        <Route path="/media" element={<MediaList />} />
        </Route>
      </Routes>

  )
}


