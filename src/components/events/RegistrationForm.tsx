"use client";

import { useId, useState, type ChangeEvent, type FormEvent } from "react";
import { Turnstile } from "@/components/shared/Turnstile";

interface RegistrationFormProps {
  eventSlug: string;
  eventTitle: string;
}

type Status = "idle" | "submitting" | "success" | "error";

interface Fields {
  firstName: string;
  lastName: string;
  company: string;
  email: string;
}

const EMPTY: Fields = { firstName: "", lastName: "", company: "", email: "" };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function RegistrationForm({ eventSlug, eventTitle }: RegistrationFormProps) {
  const uid = useId();
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [honeypot, setHoneypot] = useState("");
  const [token, setToken] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ meetingLink: string | null; googleCalendarUrl: string | null }>({
    meetingLink: null,
    googleCalendarUrl: null,
  });

  const set = (key: keyof Fields) => (e: ChangeEvent<HTMLInputElement>) =>
    setFields((f) => ({ ...f, [key]: e.target.value }));

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!fields.firstName.trim() || !fields.lastName.trim() || !fields.company.trim()) {
      setError("Please fill in every field.");
      return;
    }
    if (!EMAIL_RE.test(fields.email.trim())) {
      setError("Please enter a valid work email.");
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...fields, website: honeypot, turnstileToken: token, eventSlug, eventTitle }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Something went wrong. Please try again.");
      }
      setResult({ meetingLink: data.meetingLink ?? null, googleCalendarUrl: data.googleCalendarUrl ?? null });
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-[0_4px_20px_rgba(10,25,60,0.06)] md:p-10">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-navy/[0.08]">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="h-6 w-6 text-navy" aria-hidden="true">
            <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h2 className="mt-5 font-heading text-2xl font-bold text-gray-900">You&apos;re registered</h2>
        <p className="mt-3 text-[0.95rem] leading-relaxed text-gray-500">
          {result.meetingLink
            ? `We just emailed your join link to ${fields.email.trim()}. You can also use it right here.`
            : `Thanks for registering. We just emailed a confirmation to ${fields.email.trim()} and will send the join link before the webinar.`}
        </p>

        {result.meetingLink && (
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <a
              href={result.meetingLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-navy px-7 py-3.5 text-sm font-bold text-white transition-colors hover:bg-navy-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2"
            >
              Join the Webinar
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            {result.googleCalendarUrl && (
              <a
                href={result.googleCalendarUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-navy underline-offset-4 hover:underline"
              >
                Add to Google Calendar
              </a>
            )}
          </div>
        )}
      </div>
    );
  }

  const inputClasses =
    "w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-[0.95rem] text-gray-900 placeholder:text-gray-400 transition-colors focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/20";
  const labelClasses = "mb-1.5 block text-sm font-semibold text-gray-700";

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-2xl border border-gray-100 bg-white p-8 shadow-[0_4px_20px_rgba(10,25,60,0.06)] md:p-10"
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={`${uid}-first`} className={labelClasses}>First name</label>
          <input
            id={`${uid}-first`}
            name="firstName"
            type="text"
            autoComplete="given-name"
            required
            value={fields.firstName}
            onChange={set("firstName")}
            className={inputClasses}
          />
        </div>
        <div>
          <label htmlFor={`${uid}-last`} className={labelClasses}>Last name</label>
          <input
            id={`${uid}-last`}
            name="lastName"
            type="text"
            autoComplete="family-name"
            required
            value={fields.lastName}
            onChange={set("lastName")}
            className={inputClasses}
          />
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor={`${uid}-company`} className={labelClasses}>Company</label>
        <input
          id={`${uid}-company`}
          name="company"
          type="text"
          autoComplete="organization"
          required
          value={fields.company}
          onChange={set("company")}
          className={inputClasses}
        />
      </div>

      <div className="mt-5">
        <label htmlFor={`${uid}-email`} className={labelClasses}>Work email</label>
        <input
          id={`${uid}-email`}
          name="email"
          type="email"
          autoComplete="email"
          required
          value={fields.email}
          onChange={set("email")}
          className={inputClasses}
        />
      </div>

      {/* Honeypot: hidden from users, catches bots. */}
      <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden" tabIndex={-1}>
        <label htmlFor={`${uid}-website`}>Website</label>
        <input
          id={`${uid}-website`}
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      {error && (
        <p role="alert" className="mt-5 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </p>
      )}

      <Turnstile onVerify={setToken} onExpire={() => setToken("")} className="mt-6" />

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-navy px-7 py-3.5 text-sm font-bold text-white transition-colors hover:bg-navy-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
      >
        {status === "submitting" ? "Registering..." : "Register & Get the Link"}
      </button>

      <p className="mt-4 text-xs leading-relaxed text-gray-400">
        We&apos;ll only use your details to send you the webinar link and related updates from the
        ReForm Health Alliance.
      </p>
    </form>
  );
}
