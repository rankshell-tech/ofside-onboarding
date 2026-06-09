import type { Metadata } from 'next';
import AppLinkInstantRedirect from '@/components/AppLinkInstantRedirect';
import OpenInAppGate from '@/components/OpenInAppGate';
import { appLinkMetaToNextMetadata } from '@/lib/appLinkMeta';
import { APP_LINK_ORIGIN } from '@/lib/mobileAppLinks';

type ResolvedMatch = {
  matchId: string;
  sport: string;
  format: string;
  status: string;
  teams: Array<{ name: string; score?: number }>;
  scoreLabel: string;
};

type PageProps = {
  params: Promise<{ scoreId: string }>;
};

const API_URL = process.env.API_URL?.replace(/\/$/, '') ?? 'https://api.ofside.in';

async function fetchResolvedMatch(scoreId: string): Promise<ResolvedMatch | null> {
  try {
    const response = await fetch(`${API_URL}/api/matches/resolve/${encodeURIComponent(scoreId)}`, {
      next: { revalidate: 15 },
    });
    if (!response.ok) return null;
    const json = (await response.json()) as { data?: ResolvedMatch };
    return json.data ?? null;
  } catch (error) {
    console.error('[score-page] resolve failed:', error);
    return null;
  }
}

function buildAppTarget(resolved: ResolvedMatch | null, scoreId: string) {
  const params = new URLSearchParams({
    matchId: resolved?.matchId ?? scoreId,
    sport: resolved?.sport ?? 'football',
    format: resolved?.format ?? 'Team',
    viewScore: '1',
  });
  return { appPath: '/scoring/scoringScreen', searchParams: params };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { scoreId } = await params;
  const resolved = await fetchResolvedMatch(scoreId);
  const target = buildAppTarget(resolved, scoreId);
  const canonicalWebUrl = `${APP_LINK_ORIGIN}/score/${encodeURIComponent(scoreId)}`;
  const teamNames = resolved?.teams.map((t) => t.name).filter(Boolean) ?? [];
  const title =
    teamNames.length >= 2 ? `${teamNames[0]} vs ${teamNames[1]} — Ofside` : 'Live score on Ofside';
  const description = resolved
    ? `Current score: ${resolved.scoreLabel}. Follow live on Ofside.`
    : 'Follow the match live in the Ofside app.';

  return appLinkMetaToNextMetadata({ ...target }, canonicalWebUrl, title, description);
}

export default async function ScoreLandingPage({ params }: PageProps) {
  const { scoreId } = await params;
  const resolved = await fetchResolvedMatch(scoreId);
  const target = buildAppTarget(resolved, scoreId);
  const teamNames = resolved?.teams.map((t) => t.name).filter(Boolean) ?? [];
  const title =
    teamNames.length >= 2 ? `${teamNames[0]} vs ${teamNames[1]}` : 'Live score on Ofside';
  const description = resolved
    ? `Current score: ${resolved.scoreLabel}. Follow live on Ofside.`
    : 'Follow the match live in the Ofside app. Install the app if you do not have it yet.';

  return (
    <>
      <AppLinkInstantRedirect target={target} />
      <OpenInAppGate target={target} title={title} description={description} />
      {resolved ? (
        <section className="mx-auto -mt-24 max-w-lg px-6 pb-16 text-center">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 text-left shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-gray-500">
              {resolved.status.replace(/_/g, ' ')}
            </p>
            <div className="mt-3 space-y-2">
              {resolved.teams.slice(0, 2).map((team) => (
                <div key={team.name} className="flex items-center justify-between gap-4">
                  <span className="font-semibold text-gray-950">{team.name}</span>
                  {typeof team.score === 'number' ? (
                    <span className="tabular-nums text-lg font-bold text-gray-950">{team.score}</span>
                  ) : null}
                </div>
              ))}
            </div>
            <p className="mt-4 border-t border-gray-100 pt-4 text-center text-sm text-gray-600">
              {resolved.scoreLabel}
            </p>
          </div>
        </section>
      ) : null}
    </>
  );
}
