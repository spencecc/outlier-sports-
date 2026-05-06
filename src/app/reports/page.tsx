import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import BeehiivSignup from "@/components/BeehiivSignup";
import ReportCard from "@/components/ReportCard";
import emailsData from "../../../public/data/emails.json";

export const metadata: Metadata = {
  title: "Reports",
  description:
    "Daily analysis emails from Copacetic Sports — plays, results, and model context delivered every morning.",
};

interface EmailEntry {
  date: string;
  displayDate: string;
  title: string;
  file: string;
}

const emails = emailsData as EmailEntry[];

export default function ReportsPage() {
  return (
    <>
      <PageHeader
        title="Reports"
        subhead="Daily analysis — plays, results, and model context."
      />

      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        <div className="max-w-2xl">

          {emails.length > 0 ? (
            <div className="space-y-4 mb-16">
              {emails.map((email) => (
                <ReportCard
                  key={email.date}
                  date={email.displayDate}
                  title={email.title}
                  url={`/data/emails/${email.file}`}
                />

              ))}
            </div>
          ) : (
            <div
              className="border p-8 mb-12"
              style={{ borderColor: "var(--border)" }}
            >
              <p
                className="font-display text-2xl md:text-3xl mb-4"
                style={{ color: "var(--text-primary)" }}
              >
                No reports yet.
              </p>
              <p
                className="text-base leading-relaxed mb-6"
                style={{ color: "var(--text-secondary)" }}
              >
                Daily analysis emails will appear here. Subscribe below to get
                them in your inbox every morning.
              </p>
              <BeehiivSignup />
            </div>
          )}

          <div
            className="border p-8"
            style={{ borderColor: "var(--border)" }}
          >
            <p
              className="font-sans text-sm font-medium mb-2"
              style={{ color: "var(--text-primary)" }}
            >
              Get the daily email
            </p>
            <p
              className="text-sm leading-relaxed mb-6"
              style={{ color: "var(--text-secondary)" }}
            >
              Plays, results, and model context delivered every morning before
              first pitch.
            </p>
            <BeehiivSignup />
          </div>

        </div>
      </div>
    </>
  );
}
