import React, { useEffect, useMemo, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Skeleton } from '../../components/ui/Skeleton';
import type { PublicRegion, PublicSummary, PublicTrendPoint } from '../../services/publicService';
import {
  fetchPublicRegions,
  fetchPublicSummary,
  fetchPublicTrends,
} from '../../services/publicService';
import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export const PublicOverviewDashboardPage: React.FC = () => {
  const [summary, setSummary] = useState<PublicSummary | null>(null);
  const [regions, setRegions] = useState<PublicRegion[]>([]);
  const [trends, setTrends] = useState<PublicTrendPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | 'all'>('all');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [summaryData, regionsData, trendsData] = await Promise.all([
          fetchPublicSummary(),
          fetchPublicRegions(),
          fetchPublicTrends({}),
        ]);
        if (!mounted) return;
        setSummary(summaryData);
        setRegions(regionsData);
        setTrends(trendsData);
      } catch (err) {
        console.error(err);
        if (mounted) setError('Unable to load public overview right now.');
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (selectedRegion === 'all') {
      return;
    }
    (async () => {
      try {
        const data = await fetchPublicTrends({ region: selectedRegion });
        setTrends(data);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [selectedRegion]);

  const chartData = useMemo(
    () =>
      trends.map((t) => ({
        date: t.date.slice(5),
        cases: t.totalCases,
      })),
    [trends],
  );

  const effectiveSummary = summary;

  return (
    <div className="space-y-6">
      <section className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">Public health overview</h1>
          <p className="text-sm text-text-muted">
            Region-wise disease trends, updated in near real-time from participating hospitals.
          </p>
        </div>
        <div className="flex gap-3 text-xs">
          <select
            className="h-9 rounded-full border border-slate-200/80 bg-surface px-3 text-text-primary shadow-sm"
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value as 'all' | string)}
          >
            <option value="all">All regions</option>
            {regions.map((r) => (
              <option key={r.region} value={r.region}>
                {r.region}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Card className="p-4">
          <p className="text-xs text-text-muted">Total reported cases</p>
          {loading || !effectiveSummary ? (
            <Skeleton className="mt-3 h-8 w-24" />
          ) : (
            <>
              <p className="mt-2 text-2xl font-semibold text-text-primary">
                {effectiveSummary.totalCases.toLocaleString()}
              </p>
              <p className="mt-1 text-xs text-text-muted">
                Across {effectiveSummary.totalRegions} regions
              </p>
            </>
          )}
        </Card>
        <Card className="p-4">
          <p className="text-xs text-text-muted">Cases this week</p>
          {loading || !effectiveSummary ? (
            <Skeleton className="mt-3 h-8 w-24" />
          ) : (
            <>
              <p className="mt-2 text-2xl font-semibold text-emerald-600">
                {effectiveSummary.recentCases.toLocaleString()}
              </p>
              <p className="mt-1 text-xs text-emerald-700">
                {effectiveSummary.weeklyChangePercent === null
                  ? 'Baseline week'
                  : `${effectiveSummary.weeklyChangePercent > 0 ? '+' : ''}${effectiveSummary.weeklyChangePercent.toFixed(
                      1,
                    )}% vs last week`}
              </p>
            </>
          )}
        </Card>
        <Card className="p-4">
          <p className="text-xs text-text-muted">High-risk regions</p>
          {loading || !effectiveSummary ? (
            <Skeleton className="mt-3 h-8 w-16" />
          ) : (
            <>
              <p className="mt-2 text-2xl font-semibold text-amber-600">
                {effectiveSummary.highRiskRegionCount}
              </p>
              <p className="mt-1 text-xs text-amber-700">Flagged for spikes</p>
            </>
          )}
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)]">
        <Card className="p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold text-text-primary">Trend by region</p>
            <p className="text-xs text-text-muted">
              {selectedRegion === 'all' ? 'All regions combined' : selectedRegion}
            </p>
          </div>
          {loading ? (
            <Skeleton className="h-52 w-full rounded-2xl" />
          ) : error ? (
            <p className="text-xs text-danger">{error}</p>
          ) : trends.length === 0 ? (
            <p className="text-xs text-text-muted">No trend data available yet.</p>
          ) : (
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="date" tickLine={false} fontSize={11} />
                  <YAxis tickLine={false} fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: '1px solid rgba(148, 163, 184, 0.4)',
                      fontSize: 12,
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="cases"
                    stroke="#2563EB"
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>
        <Card className="p-4">
          <p className="mb-3 text-sm font-semibold text-text-primary">Regions snapshot</p>
          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
            </div>
          ) : regions.length === 0 ? (
            <p className="text-xs text-text-muted">No regions have reported data yet.</p>
          ) : (
            <div className="space-y-2 text-xs">
              {regions.map((region) => (
                <div
                  key={region.region}
                  className="flex items-center justify-between rounded-xl bg-background px-3 py-2"
                >
                  <span className="font-medium text-text-primary">{region.region}</span>
                  <span className="text-text-muted">
                    {region.totalCases.toLocaleString()} cases
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </section>
    </div>
  );
};

