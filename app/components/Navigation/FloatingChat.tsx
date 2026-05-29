"use client";

import { FormEvent, useState } from "react";
import { Gem, MessageCircle, MoreHorizontal, Send, X } from "lucide-react";

const demoMessages = [
  {
    id: 1,
    text: "The Solenne ring is available in half sizes and ships with insured delivery.",
  },
  {
    id: 2,
    text: "Pearl pieces are packed separately so they stay protected in transit.",
  },
];

export default function FloatingChat() {
  const [open, setOpen] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label={open ? "Close chat" : "Open chat"}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#8b1e3f] text-white shadow-2xl transition hover:bg-[#741832] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d7b56d]"
      >
        {open ? (
          <X size={24} aria-hidden="true" />
        ) : (
          <MessageCircle size={24} aria-hidden="true" />
        )}
      </button>

      {open ? (
        <div className="fixed bottom-24 right-4 z-50 flex h-[min(620px,calc(100vh-120px))] w-[calc(100vw-2rem)] max-w-[370px] flex-col overflow-hidden rounded-lg border border-stone-200 bg-white shadow-2xl sm:right-6">
          <div className="flex shrink-0 items-center justify-between border-b border-stone-200 bg-white px-5 py-4">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-md bg-[#1f2a24] text-[#d7b56d]">
                <Gem size={22} aria-hidden="true" />
              </span>

              <div>
                <h2 className="text-lg font-semibold leading-none text-[#1f2a24]">
                  Aurelle Concierge
                </h2>
                <p className="mt-1 text-sm text-stone-500">Available today</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-stone-500">
              <MoreHorizontal size={22} aria-hidden="true" />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="transition hover:text-[#8b1e3f]"
              >
                <X size={22} aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto bg-[#fbfaf7] p-5">
            <div>
              <div className="max-w-[300px] rounded-lg bg-[#f7f1e8] p-4">
                <p className="text-sm leading-6 text-stone-800">
                  I can help with sizing, materials, gifting, and appointment
                  requests.
                </p>
              </div>

              <p className="mt-2 text-xs text-stone-500">
                Aurelle Concierge - 1h
              </p>
            </div>

            {demoMessages.map((message) => (
              <div key={message.id}>
                <div className="max-w-[300px] rounded-lg bg-white p-4 shadow-sm">
                  <p className="text-sm leading-6 text-stone-800">
                    {message.text}
                  </p>
                </div>

                <p className="mt-1 text-xs text-stone-400">
                  Aurelle Concierge - now
                </p>
              </div>
            ))}
          </div>

          <form
            onSubmit={handleSubmit}
            className="shrink-0 border-t border-stone-200 bg-white p-4"
          >
            <div className="rounded-lg border border-stone-300 p-3">
              <input
                type="email"
                placeholder="email@example.com"
                className="w-full border-b border-stone-200 pb-3 text-sm outline-none placeholder:text-stone-400"
              />

              <div className="flex items-center justify-between gap-3 pt-3">
                <input
                  type="text"
                  placeholder="Message..."
                  className="min-w-0 flex-1 text-sm outline-none placeholder:text-stone-400"
                />

                <button
                  type="submit"
                  aria-label="Send message"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1f2a24] text-white transition hover:bg-[#2d3b33]"
                >
                  <Send size={17} aria-hidden="true" />
                </button>
              </div>
            </div>
          </form>
        </div>
      ) : null}
    </>
  );
}
