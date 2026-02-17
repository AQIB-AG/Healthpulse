import React, { useEffect, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Skeleton } from '../../components/ui/Skeleton';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { fetchMyReports, submitDiseaseReport, type HospitalReport } from '../../services/hospitalService';

export const DashboardHomePage: React.FC = () => {
  const { hospital } = useAuth();
  const [diseaseName, setDiseaseName] = useState('');
  const [cases, setCases] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [reports, setReports] = useState<HospitalReport[]>([]);
  const [reportsLoading, setReportsLoading] = useState(true);
  const [reportsError, setReportsError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchMyReports();
        setReports(data);
      } catch (err) {
        console.error(err);
        setReportsError('Unable to load your recent reports.');
      } finally {
        setReportsLoading(false);
      }
    })();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!diseaseName || !cases) {
      setSubmitError('Please provide disease name and case count.');
      return;
    }
    const numericCases = Number(cases);
    if (Number.isNaN(numericCases) || numericCases <= 0) {
      setSubmitError('Cases must be a positive number.');
      return;
    }
    setSubmitError(null);
    setSubmitting(true);
    try {
      const report = await submitDiseaseReport({
        diseaseName,
        cases: numericCases,
      });
      setReports((prev) => [report, ...prev]);
      setDiseaseName('');
      setCases('');
    } catch (err: any) {
      console.error(err);
      const msg =
        err?.response?.data?.message || 'Unable to submit report. Please try again shortly.';
      setSubmitError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-3">
        <Card className="p-4">
          <p className="text-xs text-text-muted">Hospital</p>
          <p className="mt-2 text-base font-semibold text-text-primary">{hospital?.name}</p>
          <p className="mt-1 text-xs text-text-muted">{hospital?.region}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-text-muted">Total reports submitted</p>
          {reportsLoading ? (
            <Skeleton className="mt-3 h-6 w-16" />
          ) : (
            <p className="mt-2 text-2xl font-semibold text-primary">{reports.length}</p>
          )}
        </Card>
        <Card className="p-4">
          <p className="text-xs text-text-muted">Most recent disease reported</p>
          {reportsLoading ? (
            <Skeleton className="mt-3 h-6 w-32" />
          ) : reports[0] ? (
            <p className="mt-2 text-sm font-semibold text-text-primary">
              {reports[0].diseaseName}{' '}
              <span className="ml-1 text-xs text-text-muted">
                ({new Date(reports[0].reportedAt).toLocaleString()})
              </span>
            </p>
          ) : (
            <p className="mt-2 text-xs text-text-muted">No submissions yet.</p>
          )}
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1.7fr)]">
        <Card className="p-5">
          <p className="mb-2 text-sm font-semibold text-text-primary">Submit new disease report</p>
          <p className="mb-4 text-xs text-text-muted">
            Region is prefilled from your hospital profile. Each submission contributes instantly to
            the regional public analytics.
          </p>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input
              label="Disease name"
              placeholder="e.g. Dengue, Influenza"
              value={diseaseName}
              onChange={(e) => setDiseaseName(e.target.value)}
            />
            <Input
              label="Region"
              value={hospital?.region || ''}
              readOnly
              className="bg-slate-50"
            />
            <Input
              label="Number of cases"
              type="number"
              min={1}
              value={cases}
              onChange={(e) => setCases(e.target.value)}
            />
            {submitError && <p className="text-xs text-danger">{submitError}</p>}
            <Button type="submit" size="lg" className="w-full" loading={submitting}>
              Submit report
            </Button>
          </form>
        </Card>

        <Card className="p-5">
          <p className="mb-3 text-sm font-semibold text-text-primary">Your recent reports</p>
          {reportsLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
            </div>
          ) : reportsError ? (
            <p className="text-xs text-danger">{reportsError}</p>
          ) : reports.length === 0 ? (
            <p className="text-xs text-text-muted">
              Once you submit a report, it will appear here for quick reference.
            </p>
          ) : (
            <div className="space-y-2 text-xs">
              {reports.map((report) => (
                <div
                  key={report._id}
                  className="flex items-center justify-between rounded-xl bg-background px-3 py-2"
                >
                  <div>
                    <p className="font-medium text-text-primary">
                      {report.diseaseName}{' '}
                      <span className="ml-1 text-[10px] uppercase tracking-wide text-text-muted">
                        {report.region}
                      </span>
                    </p>
                    <p className="text-[11px] text-text-muted">
                      {new Date(report.reportedAt).toLocaleString()}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-primary">{report.cases}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </section>
    </div>
  );
};

