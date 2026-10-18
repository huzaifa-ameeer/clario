import { useEffect, useState } from "react";

function Main() {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("authUser") || "null");
    } catch {
      return null;
    }
  });

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

  const firstName =
    typeof user?.name === "string" ? user.name.trim().split(/\s+/)[0] : "";

  return (
    <section className="relative min-h-screen overflow-hidden bg-white pt-16 dark:bg-[#030712]">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col items-center justify-center gap-6 px-6 py-16 text-center">
        <h1 className="max-w-3xl text-4xl leading-tight font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl dark:text-white">
          Welcome back{firstName ? `, ${firstName}` : ""} 👋
        </h1>

        <p className="mx-auto max-w-xl text-base leading-relaxed text-gray-600 sm:text-lg dark:text-gray-400">
          You're all set. Drop in a PDF or Word document and let Clario turn it
          into clean, scannable bullet points in seconds.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            type="button"
            className="rounded-full bg-gray-900 px-7 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-blue-600 dark:bg-blue-600 dark:text-white dark:hover:bg-purple-600"
          >
            Upload a document
          </button>
          <a
            href="/"
            className="rounded-full border border-gray-300 px-7 py-3 text-sm font-semibold text-gray-700 transition-colors duration-200 hover:border-gray-900 hover:text-gray-900 dark:border-gray-700 dark:text-gray-300 dark:hover:border-white dark:hover:text-white"
          >
            Back to home
          </a>
        </div>
      </div>
    </section>
  );
}

export default Main;
