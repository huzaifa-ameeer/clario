import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { LoaderCircle } from "lucide-react";
import api from "../utils/api";
import { notify } from "../utils/notify";

const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED_EXTENSIONS = [".pdf", ".docx"];

function Main() {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("authUser") || "null");
    } catch {
      return null;
    }
  });
  const [phase, setPhase] = useState("idle");
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [fileName, setFileName] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

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
    if (phase !== "analyzing") return;
    const id = setInterval(() => {
      setProgress((p) => {
        if (p >= 92) return p;
        const step = p < 60 ? 3 : 1;
        return Math.min(92, p + step);
      });
    }, 300);
    return () => clearInterval(id);
  }, [phase]);

  const firstName =
    typeof user?.name === "string" ? user.name.trim().split(/\s+/)[0] : "";

  const validateFile = (file) => {
    const lower = file.name.toLowerCase();
    const okExt = ALLOWED_EXTENSIONS.some((ext) => lower.endsWith(ext));
    const okMime =
      file.type === "application/pdf" ||
      file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    if (!okExt && !okMime) {
      notify("Only PDF and DOCX files are allowed", "error");
      return false;
    }
    if (file.size > MAX_SIZE) {
      notify("File too large, max size is 5MB", "error");
      return false;
    }
    return true;
  };

  const analyzeFile = async (file) => {
    if (!file || !validateFile(file)) return;

    setPhase("analyzing");
    setProgress(0);
    setResult(null);
    setFileName(file.name);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await api.post("/documents/analyze", formData, {
        onUploadProgress: (e) => {
          if (e.total) {
            const pct = Math.round((e.loaded / e.total) * 40);
            setProgress((p) => Math.max(p, pct));
          }
        },
      });
      setProgress(100);
      setResult(res.data.document.notes);
      setFileName(res.data.document.originalName);
      setPhase("done");
      notify("Document analyzed successfully");
    } catch (err) {
      const message = err.response?.data?.message || "Failed to analyze file";
      notify(message, "error");
      setPhase("idle");
      setProgress(0);
    }
  };

  const handleInputChange = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (file) analyzeFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) analyzeFile(file);
  };

  const handleReset = () => {
    setPhase("idle");
    setProgress(0);
    setResult(null);
    setFileName("");
  };

  const statusText =
    progress < 40
      ? "Uploading your document…"
      : progress < 90
        ? "Clario AI is reading every page…"
        : "Almost ready…";

  return (
    <section className="relative min-h-screen overflow-hidden bg-white pt-16 dark:bg-[#030712]">
      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-3xl flex-col items-center gap-6 px-6 py-14 text-center">
        <span className="inline-flex items-center rounded-full border border-gray-900 bg-transparent px-4 py-1.5 text-xs font-medium text-gray-900 dark:border-white dark:text-white">
          Loved by readers, powered by AI
        </span>

        <h1 className="max-w-2xl text-4xl leading-tight font-extrabold tracking-tight text-gray-900 sm:text-5xl dark:text-white">
          Welcome back{firstName ? `, ${firstName}` : ""}
        </h1>

        <p className="mx-auto max-w-xl text-base leading-relaxed text-gray-600 sm:text-lg dark:text-gray-400">
          Drop in any PDF or Word document and Clario turns it into a clean,
          scannable summary — sharp bullets, key takeaways, nothing you don't
          need.
        </p>

        <Link
          to="/history"
          className="mt-1 inline-flex items-center gap-2 rounded-full border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700 transition-colors duration-200 hover:border-gray-900 hover:text-gray-900 dark:border-gray-700 dark:text-gray-300 dark:hover:border-white dark:hover:text-white"
        >
          View history
        </Link>

        {phase === "idle" && (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`animate-fade-up mt-4 flex w-full max-w-xl cursor-pointer flex-col items-center gap-4 rounded-3xl border-2 border-dashed px-8 py-12 transition-colors duration-200 ${
              isDragging
                ? "border-violet-500 bg-violet-50 dark:border-violet-400 dark:bg-violet-500/10"
                : "border-gray-300 hover:border-gray-900 dark:border-gray-700 dark:hover:border-white"
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <div>
              <p className="text-base font-semibold text-gray-900 dark:text-white">
                Upload document
              </p>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Drag &amp; drop or click to browse — PDF or DOCX, up to 5MB
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx"
              className="hidden"
              onChange={handleInputChange}
            />
          </div>
        )}

        {phase === "analyzing" && (
          <div className="animate-fade-up mt-6 flex w-full max-w-xl flex-col items-center gap-6 rounded-3xl border border-gray-200 bg-white px-8 py-12 shadow-xl shadow-gray-900/5 dark:border-gray-800 dark:bg-gray-900/60 dark:shadow-black/20">
            <LoaderCircle
              role="status"
              aria-label="Loading"
              size={48}
              className="animate-spin text-gray-900 dark:text-white"
            />

            <div className="w-full">
              <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                <div
                  className="animate-rgb-pan h-full rounded-full bg-[linear-gradient(90deg,#ef4444,#f59e0b,#22c55e,#3b82f6,#a855f7,#ef4444)] transition-[width] duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  {statusText}
                </span>
                <span className="font-bold text-gray-900 tabular-nums dark:text-white">
                  {progress}%
                </span>
              </div>
            </div>

            <div className="inline-flex max-w-full items-center rounded-full border border-gray-200 bg-gray-50 px-4 py-1.5 text-xs font-medium text-gray-600 dark:border-gray-700 dark:bg-gray-800/60 dark:text-gray-300">
              <span className="truncate">{fileName}</span>
            </div>
          </div>
        )}

        {phase === "done" && result && (
          <div className="animate-fade-up mt-4 w-full max-w-2xl rounded-3xl border border-gray-200 bg-white px-8 py-8 text-left shadow-xl shadow-gray-900/5 sm:px-10 dark:border-gray-800 dark:bg-gray-900/60 dark:shadow-black/20">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center rounded-full border border-gray-900 px-3.5 py-1.5 text-xs font-semibold text-gray-900 dark:border-white dark:text-white">
                AI Summary
              </span>
              <span className="inline-flex max-w-full items-center rounded-full border border-gray-200 bg-gray-50 px-3.5 py-1.5 text-xs font-medium text-gray-600 dark:border-gray-700 dark:bg-gray-800/60 dark:text-gray-300">
                <span className="truncate">{fileName}</span>
              </span>
            </div>

            <h2 className="mt-5 text-2xl leading-snug font-extrabold tracking-tight text-gray-900 sm:text-3xl dark:text-white">
              {result.title}
            </h2>

            <ul className="mt-6 space-y-3.5">
              {result.bullets.map((bullet, index) => (
                <li
                  key={index}
                  className="animate-fade-up rounded-2xl border border-gray-100 bg-gray-50/70 px-4 py-3.5 text-sm leading-relaxed text-gray-700 sm:text-base dark:border-gray-800 dark:bg-gray-800/40 dark:text-gray-300"
                  style={{ animationDelay: `${index * 90 + 150}ms` }}
                >
                  {bullet}
                </li>
              ))}
            </ul>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={handleReset}
                  className="rounded-full bg-gray-900 px-6 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-blue-700 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-700"
                >
                  Analyze another document
                </button>
                <Link
                  to="/"
                  className="text-sm font-medium text-gray-500 transition-colors duration-200 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                >
                  Back to home
                </Link>
              </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default Main;
