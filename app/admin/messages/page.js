"use client";

import { useEffect, useState } from "react";
import { formatDate } from "@/lib/utils";
import toast from "react-hot-toast";

export default function MessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  // Modal State
  const [selectedMessage, setSelectedMessage] = useState(null);

  const fetchMessages = async (page = 1) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/contact?page=${page}&limit=10`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch");

      setMessages(data.messages);
      setPagination(data.pagination);
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this message?")) return;

    try {
      const res = await fetch(`/api/contact/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete");

      toast.success("Message deleted successfully");
      fetchMessages(pagination.page);
    } catch (err) {
      toast.error(err.message || "Failed to delete message");
    }
  };

  useEffect(() => {
    fetchMessages(1);
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="border-b border-slate-100 pb-4">
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Customer Messages
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Manage inquiries and messages sent by users.
        </p>
      </div>

      {/* Table Container */}
      <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl shadow-sm">
        <div className="w-full">
          {/* Scrollable table wrapper */}
          <div className="w-full overflow-x-auto pb-2">
            <table className="w-full text-left border-collapse min-w-[750px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-400 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
                  <th className="py-3.5 px-4 sm:px-6">Sender</th>
                  <th className="py-3.5 px-4">Email / Phone</th>
                  <th className="py-3.5 px-4">Message</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                {loading ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-12 text-center text-slate-400"
                    >
                      Loading messages...
                    </td>
                  </tr>
                ) : messages.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-12 text-center text-slate-400"
                    >
                      No messages found.
                    </td>
                  </tr>
                ) : (
                  messages.map((msg) => (
                    <tr
                      key={msg.id}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="py-4 px-4 sm:px-6 font-semibold text-slate-900 whitespace-nowrap">
                        {msg.name || "N/A"}
                      </td>
                      <td className="py-4 px-4 text-slate-600 whitespace-nowrap">
                        <div className="font-medium text-slate-800 text-xs sm:text-sm">
                          {msg.email}
                        </div>
                        {msg.phone && (
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            {msg.phone}
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-4 text-slate-600 max-w-xs">
                        <p className="line-clamp-2 text-xs sm:text-sm">
                          {msg.message}
                        </p>
                      </td>
                      <td className="py-4 px-4 text-xs text-slate-500 whitespace-nowrap">
                        {formatDate(msg.createdAt)}
                      </td>
                      <td className="py-4 px-4 sm:px-6 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => setSelectedMessage(msg)}
                            className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs bg-white hover:bg-slate-50 transition-all shadow-sm"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleDelete(msg.id)}
                            className="px-3 py-1.5 rounded-xl border border-red-200 text-red-600 font-semibold text-xs bg-red-50/50 hover:bg-red-100/50 transition-all shadow-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {!loading && pagination.totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 sm:px-6 py-4 border-t border-slate-200 bg-slate-50/70 rounded-b-2xl sm:rounded-b-3xl text-xs sm:text-sm">
              <span className="text-slate-500 text-center sm:text-left font-medium">
                Showing page{" "}
                <strong className="text-slate-800">{pagination.page}</strong> of{" "}
                <strong className="text-slate-800">
                  {pagination.totalPages}
                </strong>
              </span>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-center">
                <button
                  onClick={() => fetchMessages(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  className="flex-1 sm:flex-initial px-3.5 py-1.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
                >
                  Previous
                </button>
                <button
                  onClick={() => fetchMessages(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages}
                  className="flex-1 sm:flex-initial px-3.5 py-1.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* View Message Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl sm:rounded-3xl max-w-lg w-full p-6 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base sm:text-lg text-slate-900">
                Message Details
              </h3>
              <button
                onClick={() => setSelectedMessage(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg px-2"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              <div>
                <span className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase">
                  Sender Name:
                </span>
                <p className="font-semibold text-slate-900 text-sm sm:text-base">
                  {selectedMessage.name || "N/A"}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase">
                    Email:
                  </span>
                  <p className="text-slate-700 font-medium truncate">
                    {selectedMessage.email}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase">
                    Phone:
                  </span>
                  <p className="text-slate-700 font-medium">
                    {selectedMessage.phone || "N/A"}
                  </p>
                </div>
              </div>

              <div>
                <span className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase">
                  Date:
                </span>
                <p className="text-slate-600">
                  {formatDate(selectedMessage.createdAt)}
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <span className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase block mb-1">
                  Full Message:
                </span>
                <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                  {selectedMessage.message}
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedMessage(null)}
                className="w-full sm:w-auto px-5 py-2 bg-slate-900 text-white rounded-xl font-semibold text-xs hover:bg-slate-800 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
