"use client";

import { useEffect, useState } from "react";

const KEY = "bb_cookie_consent_v1";

export function CookieConsent() {
  const [show, setShow] = useState(false);
  useEffect(() => { if (!localStorage.getItem(KEY)) setShow(true); }, []);
  if (!show) return null;
  return (
    <div className="fixed bottom-20 left-4 right-4 z-[99] rounded-xl border bg-card p-4 md:left-auto md:right-4 md:w-[28rem]">
      <p className="text-sm">We use cookies for analytics and personalization. By continuing, you consent to our cookie policy.</p>
      <button onClick={() => { localStorage.setItem(KEY, "accepted"); setShow(false); }} className="mt-3 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white">Accept</button>
    </div>
  );
}
