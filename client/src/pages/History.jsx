import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Clock, Trash2 } from "lucide-react";
import api from "../utils/api";
import { notify } from "../utils/notify";

const DOT_COUNT = 8;

const BULLET_STYLES = [
  { border: "border-red-300 dark:border-red-800", badge: "bg-red-500" },
  { border: "border-green-300 dark:border-green-700", badge: "bg-green-500" },
  { border: "border-blue-300 dark:border-blue-800", badge: "bg-blue-500" },
  {
    border: "border-orange-300 dark:border-orange-700",
    badge: "bg-orange-500",
  },
  { border: "border-purple-300 dark:border-purple-800", badge: "bg-purple-500" },
];

function ChatGPTSpinner() {
  return (
    <div
      role="status"
      aria-label="Loading"
      className="relative h-12 w-12 shrink-0"
    >
      {Array.from({ length: DOT_COUNT }).map((_, i) => (
        <span
          key={i}
          className="absolute top-1/2 left-1/2 h-2 w-2"
          style={{
            transform: `translate(-50%, -50%) rotate(${(360 / DOT_COUNT) * i}deg) translateY(-16px)`,
          }}
        >
          <span
            className="chatgpt-dot block h-full w-full rounded-full bg-gray-900 dark:bg-white"
            style={{ animationDelay: `${(i * 1) / DOT_COUNT}s` }}
          />
        </span>
      ))}
    </div>
  );
}

const formatBytes = (bytes) => {
  if (!bytes) return "0 KB";
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const fileTypeOf = (doc) => {
  const ext = doc.originalName.split(".").pop();
  if (ext) return ext.toUpperCase();
  return doc.mimeType?.includes("word") ? "DOCX" : "PDF";
};

const BackButton = ({ onClick, label }) => (
  <button
    type="button"
    onClick={onClick}
    className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors duration-200 hover:border-gray-900 hover:text-gray-900 dark:border-gray-700 dark:text-gray-300 dark:hover:border-white dark:hover:text-white"
  >
    <ArrowLeft size={15} />
    {label}
  </button>
);

function History() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("list");
  const [selected, setSelected] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get("/documents");
        setDocuments(res.data.documents);
      } catch (err) {
        const message =
          err.response?.data?.message || "Failed to load history";
        notify(message, "error");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const openDetails = (doc) => {
    setSelected(doc);
    setView("details");
    setConfirmId(null);
  };

  const backToList = () => {
    setView("list");
    setSelected(null);
    setConfirmId(null);
  };

  const handleDelete = async (doc) => {
    if (deleting) return;
    if (confirmId !== doc._id) {
      setConfirmId(doc._id);
      return;
    }
    setDeleting(true);
    try {
      await api.delete(`/documents/${doc._id}`);
      setDocuments((prev) => prev.filter((d) => d._id !== doc._id));
      if (selected?._id === doc._id) {
        setView("list");
        setSelected(null);
      }
      setConfirmId(null);
      notify("Document deleted");
    } catch (err) {
      notify(
        err.response?.data?.message || "Failed to delete document",
        "error",
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-white pt-16 dark:bg-[#030712]">
      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-3xl flex-col px-6 py-14">
        {view === "list" && (
          <>
            <Link
              to="/main"
              className="inline-flex w-fit items-center gap-2 rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors duration-200 hover:border-gray-900 hover:text-gray-900 dark:border-gray-700 dark:text-gray-300 dark:hover:border-white dark:hover:text-white"
            >
              <ArrowLeft size={15} />
              Back to upload
            </Link>

            <div className="mt-8 text-center">
              <span className="inline-flex items-center rounded-full border border-gray-900 bg-transparent px-4 py-1.5 text-xs font-medium text-gray-900 dark:border-white dark:text-white">
                Your library
              </span>
              <h1 className="mt-5 text-4xl leading-tight font-extrabold tracking-tight text-gray-900 sm:text-5xl dark:text-white">
                History
              </h1>
              <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-gray-600 dark:text-gray-400">
                Every document you've uploaded — click one to see its details
                and AI summary.
              </p>
            </div>

            {loading && (
              <div className="flex flex-1 flex-col items-center justify-center gap-5 py-20">
                <ChatGPTSpinner />
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Loading your history…
                </p>
              </div>
            )}

            {!loading && documents.length === 0 && (
              <div className="animate-fade-up flex flex-1 flex-col items-center justify-center gap-4 py-20 text-center">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  No documents yet
                </h2>
                <p className="max-w-sm text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                  Upload your first document and Clarious AI will turn it into a
                  clean, scannable summary.
                </p>
                <Link
                  to="/main"
                  className="mt-2 rounded-full bg-gray-900 px-6 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-blue-700 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-700"
                >
                  Upload a document
                </Link>
              </div>
            )}

            {!loading && documents.length > 0 && (
              <ul className="mt-10 flex flex-col gap-3">
                {documents.map((doc, index) => (
                  <li
                    key={doc._id}
                    className="animate-fade-up"
                    style={{ animationDelay: `${index * 70}ms` }}
                  >
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => openDetails(doc)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          openDetails(doc);
                        }
                      }}
                      className="group flex w-full cursor-pointer items-center gap-4 rounded-2xl border border-gray-200 bg-white px-5 py-4 text-left transition-colors duration-200 hover:border-gray-900 dark:border-gray-800 dark:bg-gray-900/60 dark:hover:border-white"
                    >
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-gray-900 sm:text-base dark:text-white">
                          {doc.originalName}
                        </span>
                        <span className="mt-0.5 flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                          <Clock size={12} className="shrink-0" />
                          {formatBytes(doc.size)} · {formatDate(doc.createdAt)}
                        </span>
                      </span>
                      <span
                        className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium ${
                          doc.status === "completed"
                            ? "border-green-500 text-green-700 dark:text-green-400"
                            : "border-red-400 text-red-600 dark:text-red-400"
                        }`}
                      >
                        {doc.status === "completed" ? "Completed" : "Failed"}
                      </span>
                      <button
                        type="button"
                        disabled={deleting}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(doc);
                        }}
                        aria-label="Delete document"
                        className={`flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60 ${
                          confirmId === doc._id
                            ? "border-red-500 bg-red-500 text-white"
                            : "border-gray-300 text-gray-500 hover:border-red-500 hover:text-red-600 dark:border-gray-700 dark:text-gray-400 dark:hover:border-red-400 dark:hover:text-red-400"
                        }`}
                      >
                        <Trash2 size={12} />
                        {confirmId === doc._id ? "Delete?" : "Delete"}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}

        {view === "details" && selected && (
          <div className="animate-fade-up flex flex-col">
            <BackButton onClick={backToList} label="Back to history" />

            <div className="mt-8 rounded-3xl border border-gray-200 bg-white px-7 py-8 shadow-xl shadow-gray-900/5 sm:px-9 dark:border-gray-800 dark:bg-gray-900/60 dark:shadow-black/20">
              <h1 className="text-xl leading-snug font-extrabold tracking-tight break-words text-gray-900 sm:text-2xl dark:text-white">
                {selected.originalName}
              </h1>
              <p className="mt-1.5 flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                <Clock size={13} className="shrink-0" />
                Uploaded on {formatDate(selected.createdAt)}
              </p>

              <dl className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-gray-100 bg-gray-50/70 px-5 py-4 dark:border-gray-800 dark:bg-gray-800/40">
                  <dt className="text-xs font-medium tracking-wide text-gray-500 uppercase dark:text-gray-400">
                    File name
                  </dt>
                  <dd className="mt-1.5 truncate text-sm font-semibold text-gray-900 dark:text-white">
                    {selected.originalName}
                  </dd>
                </div>
                <div className="rounded-2xl border border-gray-100 bg-gray-50/70 px-5 py-4 dark:border-gray-800 dark:bg-gray-800/40">
                  <dt className="text-xs font-medium tracking-wide text-gray-500 uppercase dark:text-gray-400">
                    File type
                  </dt>
                  <dd className="mt-1.5 text-sm font-semibold text-gray-900 dark:text-white">
                    {fileTypeOf(selected)}
                  </dd>
                </div>
                <div className="rounded-2xl border border-gray-100 bg-gray-50/70 px-5 py-4 dark:border-gray-800 dark:bg-gray-800/40">
                  <dt className="text-xs font-medium tracking-wide text-gray-500 uppercase dark:text-gray-400">
                    File size
                  </dt>
                  <dd className="mt-1.5 text-sm font-semibold text-gray-900 dark:text-white">
                    {formatBytes(selected.size)}
                  </dd>
                </div>
                <div className="rounded-2xl border border-gray-100 bg-gray-50/70 px-5 py-4 dark:border-gray-800 dark:bg-gray-800/40">
                  <dt className="text-xs font-medium tracking-wide text-gray-500 uppercase dark:text-gray-400">
                    Status
                  </dt>
                  <dd className="mt-1.5">
                    <span
                      className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${
                        selected.status === "completed"
                          ? "border-green-500 text-green-700 dark:text-green-400"
                          : "border-red-400 text-red-600 dark:text-red-400"
                      }`}
                    >
                      {selected.status === "completed"
                        ? "Completed"
                        : "Failed"}
                    </span>
                  </dd>
                </div>
              </dl>

              {selected.status === "completed" && selected.notes?.title ? (
                <button
                  type="button"
                  onClick={() => {
                    setConfirmId(null);
                    setView("response");
                  }}
                  className="mt-7 w-full cursor-pointer rounded-2xl border border-gray-200 bg-gray-50/70 px-5 py-4 text-left transition-colors duration-200 hover:border-gray-900 dark:border-gray-800 dark:bg-gray-800/40 dark:hover:border-white"
                >
                  <span className="block text-sm font-semibold text-gray-900 sm:text-base dark:text-white">
                    AI Summary
                  </span>
                  <span className="mt-0.5 block truncate text-xs text-gray-500 dark:text-gray-400">
                    {selected.notes.title}
                  </span>
                </button>
              ) : (
                <p className="mt-7 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm leading-relaxed text-red-600 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-400">
                  Analysis failed for this document — no summary was generated.
                </p>
              )}

              <button
                type="button"
                disabled={deleting}
                onClick={() => handleDelete(selected)}
                className={`mt-7 inline-flex cursor-pointer items-center gap-2 rounded-full border px-5 py-2 text-sm font-medium transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60 ${
                  confirmId === selected._id
                    ? "border-red-500 bg-red-500 text-white"
                    : "border-gray-300 text-gray-700 hover:border-red-500 hover:text-red-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-red-400 dark:hover:text-red-400"
                }`}
              >
                <Trash2 size={14} />
                {confirmId === selected._id ? "Confirm delete?" : "Delete document"}
              </button>
            </div>
          </div>
        )}

        {view === "response" && selected?.notes && (
          <div className="animate-fade-up flex flex-col">
            <BackButton onClick={() => setView("details")} label="Back to details" />

            <div className="mt-8 rounded-3xl border border-gray-200 bg-white px-7 py-8 shadow-xl shadow-gray-900/5 sm:px-9 dark:border-gray-800 dark:bg-gray-900/60 dark:shadow-black/20">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center rounded-full border border-gray-900 px-3.5 py-1.5 text-xs font-semibold text-gray-900 dark:border-white dark:text-white">
                  AI Summary
                </span>
                <span className="inline-flex max-w-full items-center rounded-full border border-gray-200 bg-gray-50 px-3.5 py-1.5 text-xs font-medium text-gray-600 dark:border-gray-700 dark:bg-gray-800/60 dark:text-gray-300">
                  <span className="truncate">{selected.originalName}</span>
                </span>
              </div>

              <h2 className="mt-5 text-2xl leading-snug font-extrabold tracking-tight text-gray-900 sm:text-3xl dark:text-white">
                {selected.notes.title}
              </h2>

              <ul className="mt-6 space-y-3.5">
                {selected.notes.bullets.map((bullet, index) => {
                  const style = BULLET_STYLES[index % BULLET_STYLES.length];
                  return (
                    <li
                      key={index}
                      className={`animate-fade-up flex items-start gap-3 rounded-2xl border bg-gray-50/70 px-4 py-3.5 dark:bg-gray-800/40 ${style.border}`}
                      style={{ animationDelay: `${index * 90 + 150}ms` }}
                    >
                      <span
                        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${style.badge}`}
                      >
                        {index + 1}
                      </span>
                      <span className="text-sm leading-relaxed text-gray-700 sm:text-base dark:text-gray-300">
                        {bullet}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default History;
