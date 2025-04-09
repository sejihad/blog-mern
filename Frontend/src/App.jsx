import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Blog from "./Pages/Blog";
import Home from "./Pages/Home";

import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import Adminlayout from "./Layout/Adminlayout";
import UserLayout from "./Layout/UserLayout";
import AddPost from "./Pages/Admin/AddPost";
import Admin from "./Pages/Admin/Admin";
import AllPost from "./Pages/Admin/AllPost";
import UpdatePost from "./Pages/Admin/UpdatePost";
import User from "./Pages/Admin/User";
import Login from "./Pages/Login";
import NotFound from "./Pages/NotFound";
import Profile from "./Pages/Profile";
import Register from "./Pages/Register";
import { peristor, store } from "./redux/store";
export default function App() {
  return (
    <>
      <BrowserRouter>
        <Toaster />
        <Provider store={store}>
          <PersistGate loading={null} persistor={peristor}>
            <Routes>
              <Route path="/" element={<UserLayout />}>
                <Route index element={<Home />} />
                <Route path="blog/:postId" element={<Blog />}></Route>
                <Route path="/profile/:userId" element={<Profile />}></Route>
              </Route>
              <Route path="/dashboard" element={<Adminlayout />}>
                <Route index element={<Admin />} />
                <Route path="addpost" element={<AddPost />} />
                <Route path="users" element={<User />} />
                <Route path="allposts" element={<AllPost />} />
                <Route path="updatepost/:id" element={<UpdatePost />} />
              </Route>
              <Route path="/login" element={<Login />}></Route>
              <Route path="/register" element={<Register />}></Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </PersistGate>
        </Provider>
      </BrowserRouter>
    </>
  );
}
