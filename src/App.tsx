import 'bulma/css/bulma.min.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/login.tsx";
import NotFound from "./pages/notFound.tsx";
import News from "./pages/News.tsx";
import Profile from "./pages/profile.tsx";
import Register from "./pages/register.tsx";
import {ToastContainer} from "react-toastify";
import Thread from "./pages/Thread.tsx";
import WIP_Popup from "./components/WIP_Popup.tsx";
function App() {


  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/news" element={<News />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/register" element={<Register/>}></Route>
            <Route path="*" element={<NotFound />} />
            <Route path="/thread/:id" element={<Thread/>}/>

        </Routes>
        <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
        />
    </BrowserRouter>
  )
}

export default App
