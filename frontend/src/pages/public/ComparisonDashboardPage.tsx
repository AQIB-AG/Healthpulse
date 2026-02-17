import React, { useEffect, useMemo, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Skeleton } from '../../components/ui/Skeleton';
import { fetchPublicRegions, type PublicRegion } from '../../services/publicService';
import {
  fetchHighRiskRegions,
  fetchRegionComparison,
  fetchSpikes,
  type HighRiskRegion,
  type Spike,
  type ComparisonSeries,
} from '../../services/analyticsService';
import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';

interface ChartRow {
  week: string;
  [region: string]: string | number;
}

const regionColors = ['#2563EB', '#8B5CF6', '#22C55E', '#F97316', '#EF4444', '#0EA5E9'];

export const ComparisonDashboardPage: React.FC = () => {
  const [publicRegions, setPublicRegions] = useState<PublicRegion[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);

  const [highRisk, setHighRisk] = useState<HighRiskRegion[]>([]);
  const [spikes, setSpikes] = useState<Spike[]>([]);
  const [series, setSeries] = useState<ComparisonSeries[]>([]);

  const [loadingRegions, setLoadingRegions] = useState(true);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [regionsData, highRiskData, spikesData] = await Promise.all([
          fetchPublicRegions(),
          fetchHighRiskRegions(),
          fetchSpikes(),
        ]);
        setPublicRegions(regionsData);
        setHighRisk(highRiskData);
        setSpikes(spikesData);

        const defaultSelection = regionsData.slice(0, 2).map((r) => r.region);
        setSelectedRegions(defaultSelection);
      } catch (err) {
        console.error(err);
        setError('Unable to load comparison analytics right now.');
      } finally {
        setLoadingRegions(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (selectedRegions.length === 0) {
      setSeries([]);
      setLoadingAnalytics(false);
      return;
    }
    setLoadingAnalytics(true);
    (async () => {
      try {
        const comparisonSeries = await fetchRegionComparison(selectedRegions);
        setSeries(comparisonSeries);
      } catch (err) {
        console.error(err);
        setError('Unable to load comparison trends.');
      } finally {
        setLoadingAnalytics(false);
      }
    })();
  }, [selectedRegions]);

  const chartData: ChartRow[] = useMemo(() => {
    const labelSet = new Set<string>();
    series.forEach((s) => s.points.forEach((p) => labelSet.add(p.label)));
    const labels = Array.from(labelSet).sort();

    return labels.map((label) => {
      const row: ChartRow = { week: label };
      series.forEach((s) => {
        const point = s.points.find((p) => p.label === label);
        row[s.region] = point ? point.totalCases : 0;
      });
      return row;
    });
  }, [series]);

  const toggleRegion = (region: string) => {
    setSelectedRegions((current) =>
      current.includes(region) ? current.filter((r) => r !== region) : [...current, region],
    );
  };

  return (
    <div className="space-y-6">
      <section className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">Region comparison</h1>
          <p className="text-sm text-text-muted">
            Compare weekly disease activity across regions and monitor emerging spikes.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          {loadingRegions ? (
            <Skeleton className="h-8 w-40 rounded-full" />
          ) : (
            publicRegions.map((region) => {
              const active = selectedRegions.includes(region.region);
              return (
                <button
                  key={region.region}
                  type="button"
                  onClick={() => toggleRegion(region.region)}
                  className={`rounded-full border px-3 py-1.5 transition ${
                    active
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-slate-200 bg-surface text-text-muted hover:border-primary/40 hover:text-primary'
                  }`}
                >
                  {region.region}
                </button>
              );
            })
          )}
        </div>
      </section>

      {spikes.length > 0 && (
        <Card className="border border-amber-300/70 bg-amber-50/80 p-4 shadow-soft">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
                Spike alerts
              </p>
              <p className="text-sm text-amber-900">
                Spikes detected in {spikes.length} region
                {spikes.length === 1 ? '' : 's'}. Monitor these closely.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              {spikes.slice(0, 3).map((spike) => (
                <span
                  key={`${spike.region}-${spike.diseaseName}`}
                  className="rounded-full bg-amber-100 px-3 py-1 text-amber-900"
                >
                  {spike.region} · {spike.diseaseName}{' '}
                  <span className="font-semibold">
                    {spike.growthRate.toFixed(1)}
                    %
                  </span>
                </span>
              ))}
            </div>
          </div>
        </Card>
      )}

      <section className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)]">
        <Card className="p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold text-text-primary">Weekly cases by region</p>
            <p className="text-xs text-text-muted">
              {selectedRegions.length === 0
                ? 'Select one or more regions'
                : `${selectedRegions.length} region${selectedRegions.length === 1 ? '' : 's'} selected`}
            </p>
          </div>
          {loadingAnalytics ? (
            <Skeleton className="h-56 w-full rounded-2xl" />
          ) : error ? (
            <p className="text-xs text-danger">{error}</p>
          ) : chartData.length === 0 ? (
            <p className="text-xs text-text-muted">
              No comparison data available yet. Try submitting hospital reports first.
            </p>
          ) : (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="week" tickLine={false} fontSize={11} />
                  <YAxis tickLine={false} fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: '1px solid rgba(148, 163, 184, 0.4)',
                      fontSize: 12,
                    }}
                  />
                  <Legend />
                  {selectedRegions.map((region, idx) => (
                    <Line
                      key={region}
                      type="monotone"
                      dataKey={region}
                      stroke={regionColors[idx % regionColors.length]}
                      strokeWidth={2}
                      dot={false}
                      isAnimationActive
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>

        <Card className="p-4">
          <p className="mb-3 text-sm font-semibold text-text-primary">High-risk regions</p>
          {loadingRegions ? (
            <div className="space-y-2">
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
            </div>
          ) : highRisk.length === 0 ? (
            <p className="text-xs text-text-muted">
              No regions have crossed the high-risk threshold in the last 7 days.
            </p>
          ) : (
            <div className="space-y-2 text-xs">
              {highRisk.map((region) => (
                <div
                  key={region.region}
                  className="flex items-center justify-between rounded-xl bg-rose-50 px-3 py-2"
                >
                  <span className="font-medium text-rose-900">{region.region}</span>
                  <span className="text-rose-700">
                    {region.totalCases.toLocaleString()} cases / 7 days
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

