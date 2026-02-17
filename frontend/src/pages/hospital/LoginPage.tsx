import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { loginHospital } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';

export const LoginPage: React.FC = () => {
  const { loginFromResponse } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as { state?: { from?: Location } };
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const resp = await loginHospital({ email, password });
      loginFromResponse(resp);
      const redirectTo = location.state?.from?.pathname || '/hospital/dashboard';
      navigate(redirectTo, { replace: true });
    } catch (err: any) {
      console.error(err);
      const msg = err?.response?.data?.message || 'Unable to log in. Please check credentials.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-text-primary">Hospital login</h1>
        <p className="mt-1 text-sm text-text-muted">
          Secure access for verified hospitals and public health teams.
        </p>
      </div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input
          label="Email"
          type="email"
          placeholder="hospital@example.org"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-xs text-danger">{error}</p>}
        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center gap-2 text-text-muted">
            <input
              type="checkbox"
              className="h-3.5 w-3.5 rounded border-slate-300 text-primary focus:ring-primary"
            />
            Remember this device
          </label>
          <span className="text-xs text-text-muted">
            New hospital?{' '}
            <Link to="/hospital/register" className="font-medium text-primary hover:text-primaryLight">
              Register
            </Link>
          </span>
        </div>
        <Button type="submit" className="w-full" size="lg" loading={loading}>
          Log in
        </Button>
      </form>
    </div>
  );
};

