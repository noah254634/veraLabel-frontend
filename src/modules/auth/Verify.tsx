import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Loader2, ArrowRight, RefreshCw, Key } from 'lucide-react';
import { verifyEmailApi, resendVerificationApi } from './authApi';
import { useAuthStore } from './useAuthstore';
import toast from 'react-hot-toast';

const VerifyPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const email = searchParams.get('email') || '';
  const { isAuthenticated } = useAuthStore();
  
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
      return;
    }
    if (!email) {
      toast.error('Email parameter is missing. Redirecting to signup...');
      navigate('/signup', { replace: true });
    }
  }, [email, isAuthenticated, navigate]);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('No email specified.');
      return;
    }
    if (code.length !== 6 || isNaN(Number(code))) {
      toast.error('Please enter a valid 6-digit verification code.');
      return;
    }

    try {
      setLoading(true);
      await verifyEmailApi(email, code);
      toast.success('Account verified successfully! You can now log in.');
      navigate('/login', { replace: true });
    } catch (err: any) {
      console.error('Verification failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email || cooldown > 0) return;
    try {
      setResending(true);
      await resendVerificationApi(email);
      toast.success('A new 6-digit verification code has been sent.');
      setCooldown(60); // 60 seconds cooldown
    } catch (err: any) {
      console.error('Resend failed:', err);
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 sm:px-0 animate-in fade-in slide-in-from-bottom-2 duration-700">
      
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-4 text-indigo-500 justify-center md:justify-start">
          <ShieldCheck size={18} strokeWidth={2.5} />
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] font-bold">
            Auth_Verification_Gateway
          </span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tighter text-center md:text-left">
          Verify Account<span className="text-indigo-600">.</span>
        </h2>
        <p className="text-zinc-500 mt-4 font-light text-sm text-center md:text-left leading-relaxed">
          Please enter the 6-digit code sent to <span className="text-indigo-400 font-mono break-all">{email || 'your email'}</span>.
        </p>
      </div>

      <form className="space-y-8" onSubmit={handleSubmit}>
        
        <div className="space-y-3 group">
          <label className="block text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-zinc-600 group-focus-within:text-indigo-500 transition-colors ml-1">
            // Verification_Code
          </label>
          <div className="relative">
            <Key
              className="absolute left-0 top-1/2 -translate-y-1/2 text-zinc-700 group-focus-within:text-white transition-colors"
              size={16}
            />
            <input
              type="text"
              name="code"
              maxLength={6}
              required
              value={code}
              onChange={(e) => setCode(e.target.value.trim())}
              placeholder="123456"
              className="w-full pl-8 pr-4 py-3 bg-transparent border-b border-zinc-800 outline-none focus:border-indigo-500 text-zinc-200 transition-all placeholder:text-zinc-800 text-lg font-bold tracking-[0.5em] font-mono"
            />
          </div>
        </div>

        <div className="flex items-center justify-between ml-1 text-[11px]">
          <span className="text-zinc-600">Didn't receive the code?</span>
          <button
            type="button"
            onClick={handleResend}
            disabled={resending || cooldown > 0}
            className="flex items-center gap-1.5 text-zinc-300 font-bold hover:text-indigo-400 disabled:text-zinc-700 transition-all uppercase tracking-wider font-mono disabled:cursor-not-allowed"
          >
            {resending ? (
              <Loader2 className="animate-spin" size={12} />
            ) : (
              <RefreshCw size={10} className={cooldown > 0 ? 'animate-pulse' : ''} />
            )}
            {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend Code'}
          </button>
        </div>

        <button
          disabled={loading || !code || code.length !== 6}
          className="w-full group flex items-center justify-center gap-3 bg-zinc-100 hover:bg-white text-black py-4 font-bold text-[11px] uppercase tracking-[0.2em] transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={16} />
          ) : (
            <>
              Confirm Authorization
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>

      <div className="mt-12 pt-8 border-t border-zinc-900/50">
        <p className="text-center text-[11px] text-zinc-600 font-light tracking-wide">
          Return to login sequence?{" "}
          <Link
            to="/login"
            className="text-zinc-300 font-bold hover:text-indigo-400 transition-colors uppercase tracking-tighter"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default VerifyPage;
