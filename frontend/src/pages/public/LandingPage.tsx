import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Skeleton } from '../../components/ui/Skeleton';
import type { PublicSummary } from '../../services/publicService';
import { fetchPublicSummary } from '../../services/publicService';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [summary, setSummary] = useState<PublicSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await fetchPublicSummary();
        if (mounted) setSummary(data);
      } catch (err) {
        console.error(err);
        if (mounted) setError('Unable to load live snapshot right now.');
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="space-y-16">
      <section className="grid gap-10 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:items-center">
        <div className="space-y-6">
          <motion.h1
            className="text-balance text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl md:text-6xl"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            Live regional health intelligence for{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              proactive care
            </span>
            .
          </motion.h1>
          <p className="max-w-xl text-sm text-text-muted md:text-base">
            HealthPulse aggregates secure hospital submissions into real-time, region-wise
            analytics—so governments, hospitals, and citizens can act before trends become crises.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button size="lg" onClick={() => navigate('/public/overview')}>
              View public dashboard
            </Button>
            <Button variant="secondary" size="lg" onClick={() => navigate('/hospital/login')}>
              Hospital login
            </Button>
          </div>
          <div className="flex flex-wrap gap-6 pt-4 text-xs text-text-muted md:text-sm">
            <div>
              <p className="font-semibold text-text-primary">Real-time regional signals</p>
              <p>Region-wise disease, recovery, and mortality insights.</p>
            </div>
            <div>
              <p className="font-semibold text-text-primary">Built for transparency</p>
              <p>Public dashboards that stay readable under pressure.</p>
            </div>
          </div>
        </div>

        <div className="relative">
          <motion.div
            className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/35 blur-3xl"
            animate={{ opacity: [0.4, 0.8, 0.4], scale: [1, 1.05, 1] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="pointer-events-none absolute -bottom-10 -left-8 h-56 w-56 rounded-full bg-accent/35 blur-3xl"
            animate={{ opacity: [0.3, 0.7, 0.3], scale: [1, 1.08, 1] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          />
          <Card className="relative z-10 space-y-6 p-6 md:p-8" interactive>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary/80">
              Live snapshot
            </p>
            <h2 className="text-lg font-semibold text-text-primary md:text-xl">
              Today&apos;s regional health overview
            </h2>
            {loading ? (
              <div className="grid gap-3 sm:grid-cols-3">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            ) : error || !summary ? (
              <p className="text-xs text-danger">{error}</p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-3 text-xs">
                <div className="rounded-xl bg-primary/5 p-3">
                  <p className="text-text-muted">Active regions</p>
                  <p className="mt-1 text-2xl font-semibold text-primary">
                    {summary.totalRegions}
                  </p>
                  <p className="mt-1 text-emerald-600">
                    {summary.highRiskRegionCount} high-risk{' '}
                    {summary.highRiskRegionCount === 1 ? 'region' : 'regions'}
                  </p>
                </div>
                <div className="rounded-xl bg-accent/5 p-3">
                  <p className="text-text-muted">Cases (last 7 days)</p>
                  <p className="mt-1 text-2xl font-semibold text-accent">
                    {summary.recentCases.toLocaleString()}
                  </p>
                  <p className="mt-1 text-amber-600">
                    {summary.weeklyChangePercent === null
                      ? 'Baseline week'
                      : `${summary.weeklyChangePercent > 0 ? '+' : ''}${summary.weeklyChangePercent.toFixed(
                          1,
                        )}% vs prior week`}
                  </p>
                </div>
                <div className="rounded-xl bg-surface p-3 text-xs shadow-soft">
                  <p className="text-text-muted">Total reported cases</p>
                  <p className="mt-1 text-2xl font-semibold text-text-primary">
                    {summary.totalCases.toLocaleString()}
                  </p>
                  <p className="mt-1 text-text-muted">
                    Latest update:{' '}
                    {summary.latestReport
                      ? new Date(summary.latestReport).toLocaleDateString()
                      : 'N/A'}
                  </p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </section>
    </div>
  );
};

