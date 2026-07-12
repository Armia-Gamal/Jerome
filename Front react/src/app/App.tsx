import { useEffect, useState } from "react";
import type { Page } from "./components/shared/site-content";
import AdminDashboard from "./components/admin/admin";
import AppShell from "./components/app-shell/app-shell";
import AuthPage from "./components/auth/auth";
import Dashboard from "./components/dashboard/dashboard";
import LandingPage from "./components/landing/landing";
import QuizPageView from "./components/quiz/quiz";
import StoriesPageView from "./components/stories/stories";
import StoryPageView from "./components/story/story";
import { clearAuthStorage, getStoredUser, getToken, isAdmin } from "../utils/storage";
import { toast } from "sonner";

const pathToPage: Record<string, Page> = {
  "/": "landing",
  "/landing": "landing",
  "/login": "login",
  "/register": "register",
  "/dashboard": "dashboard",
  "/stories": "stories",
  "/story": "story",
  "/quiz": "quiz",
  "/quiz-result": "quiz-result",
  "/admin": "admin",
};

function getPageFromPathname(pathname: string): Page {
  return pathToPage[pathname] ?? "landing";
}

function getPathForPage(page: Page): string {
  const entry = Object.entries(pathToPage).find(([, value]) => value === page);
  return entry?.[0] ?? "/";
}

export default function App() {
  const [page, setPage] = useState<Page>(() => getPageFromPathname(window.location.pathname));
  const [sidebarLabel, setSidebarLabel] = useState("قصص الأنبياء");
  const [selectedProphetId, setSelectedProphetId] = useState<number | null>(null);

  useEffect(() => {
    const handlePopState = () => {
      const nextPage = getPageFromPathname(window.location.pathname);
      setPage(nextPage);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigate = (nextPage: Page) => {
    const protectedPages: Page[] = ["dashboard", "stories", "story", "quiz", "quiz-result", "profile", "admin"];
    if (protectedPages.includes(nextPage) && !getToken()) {
      nextPage = "login";
    }

    if (nextPage === "admin" && !isAdmin()) {
      toast.error("ملكش صلاحية تدخل لوحة الأدمن");
      nextPage = "stories";
    }

    setPage(nextPage);
    window.history.pushState({}, "", getPathForPage(nextPage));
  };

  const logout = () => {
    clearAuthStorage();
    navigate("login");
  };

  const handleNav = (nextPage: Page) => {
    const labels: Partial<Record<Page, string>> = {
      stories: "قصص الأنبياء",
      story: "الفيديوهات",
      quiz: "الاختبارات",
    };
    setSidebarLabel(labels[nextPage] ?? sidebarLabel);
    navigate(nextPage);
  };

  const dashboardPages: Page[] = ["dashboard", "stories", "story", "quiz", "quiz-result"];
  const isDashboard = dashboardPages.includes(page);
  const user = getStoredUser();

  useEffect(() => {
    const protectedPages: Page[] = ["dashboard", "stories", "story", "quiz", "quiz-result", "profile", "admin"];
    if (protectedPages.includes(page) && !getToken()) {
      navigate("login");
    } else if (page === "admin" && !isAdmin(user)) {
      toast.error("ملكش صلاحية تدخل لوحة الأدمن");
      navigate("stories");
    }
  }, [page]);

  if (page === "landing") return <LandingPage onPage={navigate} />;
  if (page === "login") return <AuthPage mode="login" onPage={navigate} />;
  if (page === "register") return <AuthPage mode="register" onPage={navigate} />;
  if (page === "admin") return <AdminDashboard onPage={navigate} />;

  if (isDashboard) {
    return (
      <AppShell sidebarActive={sidebarLabel} onNav={handleNav} onPage={navigate} onLogout={logout} user={user}>
        {page === "dashboard" && <Dashboard onPage={handleNav} onSelectProphet={setSelectedProphetId} />}
        {page === "stories" && <StoriesPageView onPage={handleNav} onSelectProphet={setSelectedProphetId} />}
        {page === "story" && <StoryPageView onPage={handleNav} prophetId={selectedProphetId} />}
        {(page === "quiz" || page === "quiz-result") && <QuizPageView onPage={handleNav} prophetId={selectedProphetId} />}
      </AppShell>
    );
  }

  return null;
}
