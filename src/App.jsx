import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
} from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Sign-up";
import Home from "./pages/Home";
import { NavbarComponent } from "./components/Navbar/Navbar";
import BlogPost from "./pages/Blog-post";
import SingleBlog from "./pages/single-blog";
import Account from "./pages/Account";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/">
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route element={<NavbarComponent />}>
          <Route path="/" element={<Home />} />
          <Route path="/blog-post" element={<BlogPost />} />

          <Route path="/blog/:authId/:blogId" element={<SingleBlog />} />
          <Route path="/user/:authId" element={<Account />} />
        </Route>
      </Route>
    )
  );
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
