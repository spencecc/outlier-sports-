import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Disclaimer",
  description: "Legal disclaimer for Copacetic Sports.",
};

export default function DisclaimerPage() {
  return (
    <>
      <PageHeader title="Disclaimer" subhead="Please read before using this site." />

      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        <div
          className="max-w-2xl text-sm leading-relaxed space-y-6"
          style={{ color: "var(--text-secondary)" }}
        >
          <p>
            Copacetic Sports is an independent sports analytics and research
            service. Copacetic Sports is not affiliated with, endorsed by,
            sponsored by, or authorized by Major League Baseball, MLB Advanced
            Media, the National Football League, the National Basketball Association, the
            NCAA, the National Hockey
            League, any team, league, sportsbook, or gaming operator. Team,
            league, and sportsbook names are used only to identify games,
            markets, and publicly available betting lines.
          </p>

          <p>
            Copacetic Sports does not sell a live score or data feed. We publish
            proprietary analysis, projections, and commentary using publicly
            available factual inputs. Nothing on this site is financial or
            investment advice.
          </p>

          <p>
            Information is provided for educational and entertainment purposes
            only. Copacetic Sports does not accept wagers, place bets, or operate
            as a sportsbook. No analysis, projection, or pick is guaranteed to be
            accurate or profitable. Betting involves risk, including loss of
            principal. Users are responsible for complying with all laws
            applicable in their jurisdiction.
          </p>

          <p>
            Sports betting involves substantial risk of loss. Past performance
            of any model, system, or pick service — including the results
            published on this site — is not indicative of future results. You
            can and may lose money betting on sports.
          </p>

          <p>
            All picks, probabilities, and edge estimates published by Copacetic
            Sports reflect the output of a quantitative model and are provided
            for informational purposes. They are not guaranteed to be accurate
            or profitable. The model has limitations that no disclaimer can
            fully enumerate.
          </p>

          <p>
            You are solely responsible for your own betting decisions. Copacetic
            Sports is not responsible for any financial losses incurred as a
            result of acting on information published on this site.
          </p>

          <p>
            Sports betting is illegal in some jurisdictions. It is your
            responsibility to know and comply with the laws applicable in your
            location. Copacetic Sports does not encourage or facilitate illegal
            gambling activity.
          </p>

          <p>
            Must be 21 years of age or older (or the legal gambling age in your
            jurisdiction) to participate in sports wagering. If you or someone
            you know has a gambling problem, call the National Problem Gambling
            Helpline at{" "}
            <a
              href="tel:1-800-522-4700"
              className="underline underline-offset-2"
              style={{ color: "var(--text-primary)" }}
            >
              1-800-522-4700
            </a>{" "}
            or visit{" "}
            <a
              href="https://www.ncpgambling.org"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2"
              style={{ color: "var(--text-primary)" }}
            >
              ncpgambling.org
            </a>
            .
          </p>

          <p>
            Your use of Copacetic Sports is governed by the laws of the State of
            Georgia, without regard to its conflict-of-law provisions. Any dispute
            arising out of or relating to this site, its content, or any
            subscription is to be brought and resolved exclusively in the state
            or federal courts located in Georgia, and you consent to the personal
            jurisdiction and venue of those courts.
          </p>

          <p
            className="text-xs pt-4"
            style={{ color: "var(--text-tertiary)" }}
          >
            Last updated: June 2026
          </p>
        </div>
      </div>
    </>
  );
}
