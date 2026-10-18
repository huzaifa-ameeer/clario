import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LoaderCircle, Menu, Moon, Sun, X } from "lucide-react";
import api from "../utils/api";
import { notify } from "../utils/notify";

const navLinks = [
  { label: "Home", href: "#home", id: "home" },
  { label: "How it works", href: "#how-it-works", id: "how-it-works" },
  { label: "Features", href: "#features", id: "features" },
];

const sectionIds = ["home", "how-it-works", "features"];

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const showSectionLinks = location.pathname === "/";
  const [isOpen, setIsOpen] = useState(false);
  const [active, setActive] = useState("home");
  const [logoutError, setLogoutError] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("authUser") || "null");
    } catch {
      return null;
    }
  });
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light",
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const syncUser = () => {
      try {
        setUser(JSON.parse(localStorage.getItem("authUser") || "null"));
      } catch {
        setUser(null);
      }
    };

    window.addEventListener("auth-user-updated", syncUser);
    window.addEventListener("storage", syncUser);
    return () => {
      window.removeEventListener("auth-user-updated", syncUser);
      window.removeEventListener("storage", syncUser);
    };
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const offset = window.scrollY + 120;
      let current = "home";
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= offset) current = id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleTheme = () =>
    setTheme((current) => (current === "dark" ? "light" : "dark"));

  const closeMenu = () => setIsOpen(false);
  const handleLogout = async () => {
    if (loggingOut) return;
    setLogoutError("");
    setLoggingOut(true);
    try {
      await api.post("/auth/logout");
      localStorage.removeItem("authUser");
      setUser(null);
      window.dispatchEvent(new Event("auth-user-updated"));
      setIsOpen(false);
      notify("Logged out successfully");
      navigate("/");
    } catch (error) {
      const message =
        error.response?.data?.message || "Logout failed. Please try again.";
      setLogoutError(message);
      notify(message, "error");
    } finally {
      setLoggingOut(false);
    }
  };

  const linkClass = (id) =>
    `text-sm font-medium transition-colors duration-200 ${
      active === id
        ? "text-gray-900 dark:text-white"
        : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
    }`;

  const themeButtonClass =
    "flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition-colors duration-200 hover:border-gray-900 hover:text-gray-900 dark:border-gray-700 dark:text-gray-300 dark:hover:border-white dark:hover:text-white";

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-white dark:bg-[#030712]">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link to="/" onClick={closeMenu} className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 text-lg font-bold text-white">
            C
          </span>
          <span className="text-xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Clario
          </span>
        </Link>

        <div className="hidden items-center gap-8 sm:flex">
          {showSectionLinks &&
            navLinks.map((link) => (
              <a key={link.label} href={link.href} className={linkClass(link.id)}>
                {link.label}
              </a>
            ))}
          {user ? (
            <div className="flex items-center gap-2">
              <Link
                to="/main"
                className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-blue-700"
              >
                Dive now
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-gray-900 px-5 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-blue-600 dark:text-white dark:hover:bg-red-600"
              >
                {loggingOut && <LoaderCircle size={16} className="animate-spin" />}
                {loggingOut ? "Logging out..." : "Logout"}
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="rounded-full bg-gray-900 px-5 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-blue-600 dark:bg-blue-600 dark:text-white dark:hover:bg-purple-600"
            >
              Get Started
            </Link>
          )}
          {logoutError && (
            <span role="alert" className="text-xs text-red-600">
              {logoutError}
            </span>
          )}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={
              theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
            className={themeButtonClass}
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        <div className="flex items-center gap-2 sm:hidden">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={
              theme === "dark"
                ? "Switch to light mode"
                : "Switch to dark mode"
            }
            className={themeButtonClass}
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button
            type="button"
            onClick={() => setIsOpen((open) => !open)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 transition-colors duration-200 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {isOpen && (
        <div className="bg-white px-6 pb-6 pt-4 sm:hidden dark:bg-[#030712]">
          <div className="flex flex-col gap-4">
            {showSectionLinks &&
              navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={closeMenu}
                  className={linkClass(link.id)}
                >
                  {link.label}
                </a>
              ))}
            {user ? (
              <div className="flex flex-col items-start gap-3">
                <Link
                  to="/main"
                  onClick={closeMenu}
                  className="w-fit rounded-full bg-blue-600 px-5 py-2.5 text-center text-sm font-semibold text-white transition-colors duration-200 hover:bg-blue-700"
                >
                  Dive now
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-full bg-gray-900 px-5 py-2.5 text-center text-sm font-semibold text-white transition-colors duration-200 hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-blue-600 dark:text-white dark:hover:bg-red-600"
                >
                  {loggingOut && <LoaderCircle size={16} className="animate-spin" />}
                  {loggingOut ? "Logging out..." : "Logout"}
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={closeMenu}
                className="rounded-full bg-gray-900 px-5 py-2.5 text-center text-sm font-medium text-white transition-colors duration-200 hover:bg-blue-600 dark:bg-blue-600 dark:text-white dark:hover:bg-purple-600"
              >
                Get Started
              </Link>
            )}
            {logoutError && (
              <span role="alert" className="text-xs text-red-600">
                {logoutError}
              </span>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
