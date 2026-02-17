import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { registerHospital } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';

export const RegisterPage: React.FC = () => {
  const { loginFromResponse } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [region, setRegion] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !region || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const resp = await registerHospital({ name, region, email, password });
      loginFromResponse(resp);
      navigate('/hospital/dashboard', { replace: true });
    } catch (err: any) {
      console.error(err);
      const msg =
        err?.response?.data?.message ||
        'Unable to register hospital. Please verify details and try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-text-primary">Register hospital</h1>
        <p className="mt-1 text-sm text-text-muted">
          Onboard your hospital to start submitting real-time disease data.
        </p>
      </div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input label="Hospital name" value={name} onChange={(e) => setName(e.target.value)} />
        <Input label="Region" value={region} onChange={(e) => setRegion(e.target.value)} />
        <Input
          label="Email"
          type="email"
          placeholder="hospital@example.org"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          label="Password"
          type="password"
          placeholder="Create a strong password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-xs text-danger">{error}</p>}
        <Button type="submit" className="w-full" size="lg" loading={loading}>
          Create account
        </Button>
      </form>
      <p className="text-xs text-text-muted">
        Already onboarded?{' '}
        <Link to="/hospital/login" className="font-medium text-primary hover:text-primaryLight">
          Log in
        </Link>
      </p>
    </div>
  );
};

