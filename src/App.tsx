import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/User/Main/HomePage";
import LoginPage from "./pages/User/Auth/LoginPage";
import SignUpPage from "./pages/User/Auth/SignUpPage";
import MainLayout from "./layouts/MainLayout";
import ProfilePage from "./pages/User/Main/ProfilePage";
import ProtectUser from "./routes/ProtectUser";
import NotFound from "./pages/NotFound";
import SettingsPage from "./pages/User/Main/SettingsPage";
import ProtectAdmin from "./routes/ProtectAdmin";
import AdminLoginPage from "./pages/Admin/AdminLoginPage";
import AdminMainPage from "./pages/Admin/AdminMainPage";
import AdminLayout from "./layouts/AdminLayout";
import AdminSettings from "./pages/Admin/AdminSettings";
import AdminCategories from "./pages/Admin/AdminCategories";
import AdminLogPage from "./pages/Admin/AdminLogPage";
import AdminCreatePage from "./pages/Admin/AdminCreatePage";
import CreatePostPage from "./pages/User/Main/CreatePostPage";
import UserPostsPage from "./pages/User/Main/UserPostsPage";
import EditPost from "./pages/User/Main/EditPostPage";
import AuthorViewPostPage from "./pages/User/Main/AuthorViewPostPage";
import ReadPostPage from "./pages/User/Main/ReadPostPage";
import UserPublicProfileViewPage from "./pages/User/Main/UserPublicProfileViewPage";
import AdminUsersPage from "./pages/Admin/AdminUsersPage";
import AdminPostsPages from "./pages/Admin/AdminPostsPages";
import AdminReportsPage from "./pages/Admin/AdminReportsPage";
import ExplorePage from "./pages/User/Main/ExplorePage";

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route element={<ProtectUser />}>
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/user/profile" element={<ProfilePage />} />
          <Route path="/user/settings" element={<SettingsPage />} />
          <Route path="/user/posts" element={<UserPostsPage />} />
          <Route
            path="/view/user/:username"
            element={<UserPublicProfileViewPage />}
          />
          <Route path="/posts/new" element={<CreatePostPage />} />
          <Route path="/author/read/:slug" element={<AuthorViewPostPage />} />
          <Route path="/read/:slug" element={<ReadPostPage />} />
          <Route path="/user/post/edit/:id" element={<EditPost />} />
        </Route>
      </Route>
      <Route element={<ProtectAdmin />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminMainPage />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          <Route path="/admin/categories" element={<AdminCategories />} />
          <Route path="/admin/logs" element={<AdminLogPage />} />
          <Route path="/admin/list" element={<AdminCreatePage />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
          <Route path="/admin/posts" element={<AdminPostsPages />} />
          <Route path="/admin/reports" element={<AdminReportsPage />} />
        </Route>
      </Route>
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/signup" element={<SignUpPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
