import { useState } from 'react';
import { ArrowUpRight, LogIn } from 'lucide-react';
import { authClient } from '../auth/client';
import type { Language } from '../types';

export function LandingActions({ language, onEnterDashboard }: {
  language: Language;
  onEnterDashboard: () => void;
}) {
  const ar = language === 'ar';
  const [connecting, setConnecting] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const signInWithGoogle = async () => {
    setConnecting(true);
    setLoginError(false);
    try {
      const signInResponse = await authClient.signIn.social({
        provider: 'google', callbackURL: `${window.location.origin}/dashboard`,
      });
      if (signInResponse.error) setLoginError(true);
    } catch (error) {
      if (!(error instanceof TypeError)) throw error;
      // Network failures leave the guest route available without losing local plans.
      setLoginError(true);
    } finally {
      setConnecting(false);
    }
  };

  return <div className="landing-actions" dir={ar ? 'rtl' : 'ltr'}>
    <div className="landing-actions__buttons">
      <button type="button" className="landing-actions__google" disabled={connecting} onClick={signInWithGoogle}>
        <LogIn size={18} aria-hidden="true" />
        {connecting ? (ar ? 'جارٍ الاتصال…' : 'Connecting…') : (ar ? 'تسجيل الدخول باستخدام Google' : 'Sign in with Google')}
      </button>
      <button type="button" className="landing-actions__guest" onClick={onEnterDashboard}>
        {ar ? 'الدخول كضيف' : 'Continue as guest'}<ArrowUpRight size={18} aria-hidden="true" />
      </button>
    </div>
    {loginError && <p role="alert">{ar ? 'تعذر الاتصال بـ Google. حاول مرة أخرى أو ادخل كضيف.' : 'Could not connect to Google. Try again or continue as guest.'}</p>}
  </div>;
}
