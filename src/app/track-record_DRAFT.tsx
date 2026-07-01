import { promises as fs } from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export default async function MultiSportTrackRecord({ searchParams }: { searchParams: { sport?: string } }) {
  // Default to the unified summary if no specific sport is selected
  const activeSport = searchParams.sport || 'all';

  // 1. Enforce Zero-Fetch Rule: Read summary for tabs
  const summaryPath = path.join(process.cwd(), 'public', 'data', 'summary.json');
  const summaryContents = await fs.readFile(summaryPath, 'utf8');
  const summaryData = JSON.parse(summaryContents);

  // 2. Fetch specific league stats if a sport is selected
  let activeStats = null;
  if (activeSport !== 'all') {
    const statsPath = path.join(process.cwd(), 'public', 'data', activeSport, 'stats.json');
    try {
      const statsContents = await fs.readFile(statsPath, 'utf8');
      activeStats = JSON.parse(statsContents);
    } catch (e) {
      // Graceful fallback if file doesn't exist yet
      activeStats = null;
    }
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8 border-b border-gray-200 pb-8">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">Track Record</h1>
        <p className="mt-2 text-lg text-gray-600">Every play, fully transparent and graded.</p>
      </div>

      {/* Sport Filter Tabs */}
      <div className="flex space-x-4 mb-8 overflow-x-auto pb-2">
        <a
          href="/track-record"
          className={`px-4 py-2 rounded-md font-medium whitespace-nowrap ${activeSport === 'all' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          All Sports
        </a>
        {summaryData.leagues.map((league: any) => {
          if (league.status === 'hidden') return null;

          return (
            <a
              key={league.league}
              href={`/track-record?sport=${league.league}`}
              className={`px-4 py-2 rounded-md font-medium uppercase whitespace-nowrap ${activeSport === league.league ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              {league.league} {league.status === 'research' && '(Paper Trade)'}
            </a>
          );
        })}
      </div>

      {/* Dynamic Stat Display */}
      {activeSport === 'all' ? (
        <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-lg">
          <h2 className="text-xl font-bold mb-2">Lifetime Unified Portfolio</h2>
          <p className="text-gray-700">Select a specific sport above to view detailed confidence breakdowns and play-type ROI. Paper-trade (research) sports are strictly excluded from the All-Time live portfolio metrics.</p>
        </div>
      ) : activeStats ? (
        <div className="space-y-8">
          <h2 className="text-2xl font-bold uppercase">{activeSport} Performance</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="text-sm text-gray-500 mb-1">Lifetime ROI</div>
              <div className="text-xl font-bold">{activeStats.lifetime.roi}%</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="text-sm text-gray-500 mb-1">Units</div>
              <div className="text-xl font-bold text-green-600">{activeStats.lifetime.units}u</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-gray-500">Awaiting graded data for this sport...</div>
      )}
    </main>
  );
}
