import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { t } from '../i18n';
import LanguageSelector from './LanguageSelector';

function AuthForm() {
  const { signUp, signIn, resetPassword } = useAuth();
  const [mode, setMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const isSignUp = mode === 'signup';
  const isForgot = mode === 'forgot';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setInfoMessage('');

    if (isForgot) {
      if (!email) {
        setError(t('Entrez votre adresse e-mail.'));
        return;
      }
      setLoading(true);
      const { error } = await resetPassword(email);
      setLoading(false);
      if (error) {
        setError(error.message);
      } else {
        setInfoMessage(t("Si un compte existe pour cette adresse, un lien de réinitialisation vient d'être envoyé."));
      }
      return;
    }

    if (!email || !password) {
      setError(t('Email et mot de passe sont obligatoires.'));
      return;
    }
    if (password.length < 6) {
      setError(t('Le mot de passe doit contenir au moins 6 caractères.'));
      return;
    }

    setLoading(true);

    if (isSignUp) {
      const { error } = await signUp(email, password);
      setLoading(false);
      if (error) {
        setError(error.message);
      } else {
        setInfoMessage(t('Compte créé ! Vérifie ta boîte mail pour confirmer ton adresse, puis connecte-toi.'));
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
      <LanguageSelector className="auth-lang" />
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>💰 {t('Gestion des finances')}</h1>
        <h2>{isForgot ? t('Mot de passe oublié') : isSignUp ? t('Créer un compte') : t('Se connecter')}</h2>

        {error && <p className="form-error">{error}</p>}
        {infoMessage && <p className="form-info">{infoMessage}</p>}

        <div className="form-group">
          <label htmlFor="auth-email">{t('Email')}</label>
          <input
            type="email"
            id="auth-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('ton@email.com')}
            autoComplete="email"
          />
        </div>

        {!isForgot && (
        <div className="form-group">
          <label htmlFor="auth-password">{t('Mot de passe')}</label>
          <input
            type="password"
            id="auth-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t('Au moins 6 caractères')}
            autoComplete={isSignUp ? 'new-password' : 'current-password'}
          />
        </div>
        )}

        {mode === 'signin' && (
          <p className="auth-forgot">
            <button type="button" className="auth-switch-btn" onClick={() => { setMode('forgot'); setError(''); setInfoMessage(''); }}>
              {t('Mot de passe oublié ?')}
            </button>
          </p>
        )}

        <button type="submit" disabled={loading}>
          {loading ? t('Chargement...') : isForgot ? t('Envoyer le lien') : isSignUp ? t("S'inscrire") : t('Se connecter')}
        </button>

        <p className="auth-switch">
          {isForgot ? t('Vous vous souvenez ?') : isSignUp ? t('Déjà un compte ?') : t('Pas encore de compte ?')}{' '}
          <button
            type="button"
            className="auth-switch-btn"
            onClick={() => {
              setMode(isForgot || isSignUp ? 'signin' : 'signup');
              setError('');
              setInfoMessage('');
            }}
          >
            {isForgot || isSignUp ? t('Se connecter') : t("S'inscrire")}
          </button>
        </p>
      </form>
    </div>
  );
}

export default AuthForm;