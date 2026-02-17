import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { LandingPage } from '../pages/public/LandingPage';
import { PublicOverviewDashboardPage } from '../pages/public/PublicOverviewDashboardPage';
import { ComparisonDashboardPage } from '../pages/public/ComparisonDashboardPage';
import { LoginPage } from '../pages/hospital/LoginPage';
import { RegisterPage } from '../pages/hospital/RegisterPage';
import { DashboardHomePage } from '../pages/hospital/DashboardHomePage';
import { PublicLayout } from '../layouts/PublicLayout';
import { HospitalLayout } from '../layouts/HospitalLayout';
import { AuthLayout } from '../layouts/AuthLayout';
import { ProtectedRoute } from '../components/routes/ProtectedRoute';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/public/overview" element={<PublicOverviewDashboardPage />} />
        <Route path="/public/comparison" element={<ComparisonDashboardPage />} />
      </Route>

      <Route element={<AuthLayout />}>
        <Route path="/hospital/login" element={<LoginPage />} />
        <Route path="/hospital/register" element={<RegisterPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<HospitalLayout />}>
          <Route path="/hospital/dashboard" element={<DashboardHomePage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

