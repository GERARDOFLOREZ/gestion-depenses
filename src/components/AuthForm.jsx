import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

function AuthForm() {
  const { signUp, signIn } = useAuth();
  const [mode, setMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const isSignUp = mode === 'signup';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setInfoMessage('');

    if (!email || !password) {
      setError('Email et mot de passe sont obligatoires.');
      return;
    }
    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }

    setLoading(true);

    if (isSignUp) {
      const { error } = await signUp(email, password);
      setLoading(false);
      if (error) {
        setError(error.message);
      } else {
        setInfoMessage('Compte créé ! Vérifie ta boîte mail pour confirmer ton adresse, puis connecte-toi.');
        setMode('signin');
      }
    } else {
      const { error } = await signIn(email, password);
      setLoading(false);
      if (error) {
        setError(error.message);
      }
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>💰 Gestion des finances</h1>
        <h2>{isSignUp ? 'Créer un compte' : 'Se connecter'}</h2>

        {error && <p className="form-error">{error}</p>}
        {infoMessage && <p className="form-info">{infoMessage}</p>}

        <div className="form-group">
          <label htmlFor="auth-email">Email</label>
          <input
            type="email"
            id="auth-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ton@email.com"
            autoComplete="email"
          />
        </div>

        <div className="form-group">
          <label htmlFor="auth-password">Mot de passe</label>
          <input
            type="password"
            id="auth-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Au moins 6 caractères"
            autoComplete={isSignUp ? 'new-password' : 'current-password'}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Chargement...' : isSignUp ? "S'inscrire" : 'Se connecter'}
        </button>

        <p className="auth-switch">
          {isSignUp ? 'Déjà un compte ?' : 'Pas encore de compte ?'}{' '}
          <button
            type="button"
            className="auth-switch-btn"
            onClick={() => {
              setMode(isSignUp ? 'signin' : 'signup');
              setError('');
              setInfoMessage('');
            }}
          >
            {isSignUp ? 'Se connecter' : "S'inscrire"}
          </button>
        </p>
      </form>
    </div>
  );
}

export default AuthForm;