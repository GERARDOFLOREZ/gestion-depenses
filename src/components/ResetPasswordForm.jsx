import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

function ResetPasswordForm() {
  const { updatePassword } = useAuth();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) return setError('Le mot de passe doit contenir au moins 6 caractères.');
    if (password !== confirm) return setError('Les deux mots de passe ne correspondent pas.');
    setLoading(true);
    const { error: err } = await updatePassword(password);
    setLoading(false);
    if (err) setError(err.message);
  };

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>💰 Gestion des finances</h1>
        <h2>Choisissez un nouveau mot de passe</h2>
        {error && <p className="form-error">{error}</p>}
        <div className="form-group">
          <label htmlFor="new-password">Nouveau mot de passe</label>
          <input type="password" id="new-password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" />
        </div>
        <div className="form-group">
          <label htmlFor="confirm-password">Confirmer</label>
          <input type="password" id="confirm-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" />
        </div>
        <button type="submit" disabled={loading}>{loading ? 'Chargement...' : 'Enregistrer'}</button>
      </form>
    </div>
  );
}

export default ResetPasswordForm;
