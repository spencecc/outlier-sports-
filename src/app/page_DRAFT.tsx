import { promises as fs } from 'fs';
import path from 'path';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function MultiSportHomepage() {
  const summaryPath = path.join(process.cwd(), 'public', 'data', 'summary.json');
  const fileContents = await fs.readFile(summaryPath, 'utf8');
  const summaryData = JSON.parse(fileContents);

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-12 border-b border-gray-200 pb-8">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">Copacetic Sports</h1>
        <p className="mt-2 text-lg text-gray-600">50,000 Simulations. Find the Outliers.</p>
        <p className="mt-4 text-sm font-medium text-gray-500 uppercase tracking-wide">
          Command Center — All Sports
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {summaryData.leagues.map((league: any) => {
          if (league.status === 'hidden') return null;

          const isPaperTrade = league.status === 'research';
          const badgeText = isPaperTrade ? 'Paper Trade Mode' : 'Live Tracking';
          const badgeStyle = isPaperTrade
            ? 'bg-yellow-100 text-yellow-800'
            : 'bg-green-100 text-green-800';

          return (
            <div key={league.league} className={`flex flex-col bg-white border-t-4 shadow-sm rounded-b-lg p-6 ${league.accentColor}`}>
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold uppercase">{league.league}</h2>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${badgeStyle}`}>
                  {badgeText}
                </span>
              </div>

              <div className="space-y-2 mb-6 flex-grow">
                <div className="flex justify-between"><span className="text-gray-500">Lifetime ROI</span><span className="font-medium">{league.stats.roi}%</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Units</span><span className="font-medium text-green-600">{league.stats.units}u</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Record</span><span className="font-medium">{league.stats.record}</span></div>
              </div>

              <Link href={`/${league.league}/plays`} className="w-full text-center bg-gray-900 hover:bg-gray-800 text-white font-medium py-2 px-4 rounded transition-colors">
                View {league.league.toUpperCase()} Plays
              </Link>
            </div>
          );
        })}
      </div>
    </main>
  );
}
