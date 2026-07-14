import { useState, type ReactNode } from "react";
import { Bell, BookOpen, HelpCircle, LogOut, Menu, Play, Search } from "lucide-react";
import logo from "../../../assets/logo.jpg";
import type { Page } from "../shared/site-content";
import type { AuthUser } from "../../../types/api";
import "./app-shell.css";

export default function AppShell({
  children,
  sidebarActive,
  onNav,
  onPage,
  onLogout,
  user,
}: {
  children: ReactNode;
  sidebarActive: string;
  onNav: (page: Page) => void;
  onPage: (p: Page) => void;
  onLogout: () => void;
  user: AuthUser | null;
}) {
  const [open, setOpen] = useState(false);
  const navItems = [
    { icon: BookOpen, label: "قصص الأنبياء", page: "stories" as Page },
    { icon: Play, label: "الفيديوهات", page: "story" as Page },
    { icon: HelpCircle, label: "الاختبارات", page: "quiz" as Page },
  ];
  if (user?.role === "Admin") {
    navItems.push({ icon: BookOpen, label: "الأدمن", page: "admin" as Page });
  }

  return (
    <div className="app-shell flex h-screen overflow-hidden" dir="rtl" style={{ fontFamily: "'Cairo', sans-serif" }}>
      {open && <div className="fixed inset-0 bg-black/40 z-20 lg:hidden" onClick={() => setOpen(false)} />}

      <aside
        className={`app-sidebar
          fixed lg:static inset-y-0 right-0 z-30 w-64 flex flex-col
          transition-transform duration-300
          ${open ? "translate-x-0" : "translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <img src={logo} alt="فريق القديس جيروم" className="app-sidebar-logo" />
            <div>
              <div className="text-white font-bold text-lg" style={{ letterSpacing: "0.02em" }}>فريق القديس جيروم</div>
              <div className="app-sidebar-subtitle text-xs">منصة الأنبياء التعليمية</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-1">
            {navItems.map(item => {
              const active = sidebarActive === item.label;
              return (
                <button
                  key={item.label}
                  onClick={() => {
                    onNav(item.page);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 text-right ${
                    active
                      ? "app-nav-active text-white shadow-sm"
                      : "app-nav-idle hover:text-white"
                  }`}
                >
                  <item.icon size={18} className={active ? "app-nav-icon-active" : "app-nav-icon"} />
                  {item.label}
                  {active && <div className="app-nav-dot mr-auto w-1.5 h-1.5 rounded-full" />}
                </button>
              );
            })}
          </div>
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={onLogout}
            className="app-logout w-full flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all"
          >
            <LogOut size={16} />
            تسجيل الخروج
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="app-header px-6 py-4 flex items-center justify-between shrink-0">
          <button className="lg:hidden p-2 rounded-lg hover:bg-muted" onClick={() => setOpen(true)}>
            <Menu size={20} className="text-foreground" />
          </button>
          <div className="flex items-center gap-2">
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">{children}</div>
      </main>
    </div>
  );
}
