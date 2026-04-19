/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Phone, Lock, ChevronRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';

interface LoginPageProps {
  onLogin: (role: 'admin' | 'member') => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [role, setRole] = useState<'admin' | 'member'>('member');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length < 10) return;
    setIsLoading(true);
    // Simulate OTP send
    setTimeout(() => {
      setIsLoading(false);
      setStep('otp');
    }, 1000);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin(role);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-brand-cream flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-brand-emerald/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl shadow-brand-emerald/5 p-8 relative z-10 border border-brand-emerald/5"
      >
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-brand-emerald rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-brand-emerald/20">
            <ShieldCheck className="text-brand-gold" size={32} />
          </div>
          <h1 className="text-3xl font-serif font-bold text-brand-emerald">RotaVault</h1>
          <p className="text-brand-emerald/40 text-sm font-medium uppercase tracking-widest mt-1">Secure Cooperative Savings</p>
        </div>

        <div className="flex p-1 bg-brand-sage rounded-2xl mb-8">
          <button 
            onClick={() => setRole('member')}
            className={cn(
              "flex-1 py-3 rounded-xl text-sm font-bold transition-all",
              role === 'member' ? "bg-white text-brand-emerald shadow-sm" : "text-brand-emerald/40"
            )}
          >
            Member
          </button>
          <button 
            onClick={() => setRole('admin')}
            className={cn(
              "flex-1 py-3 rounded-xl text-sm font-bold transition-all",
              role === 'admin' ? "bg-white text-brand-emerald shadow-sm" : "text-brand-emerald/40"
            )}
          >
            Admin
          </button>
        </div>

        <AnimatePresence mode="wait">
          {step === 'phone' ? (
            <motion.form 
              key="phone"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handlePhoneSubmit}
              className="space-y-6"
            >
              <div className="space-y-2">
                <label className="text-xs font-bold text-brand-emerald/40 uppercase tracking-widest ml-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-emerald/30" size={18} />
                  <input 
                    type="tel" 
                    placeholder="080 1234 5678"
                    className="w-full pl-12 pr-4 py-4 bg-brand-sage/30 border border-transparent rounded-2xl focus:border-brand-emerald/20 focus:bg-white transition-all outline-none font-medium"
                    value={phoneNumber}
                    onChange={e => setPhoneNumber(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={isLoading || phoneNumber.length < 10}
                className="w-full btn-primary py-4 flex items-center justify-center gap-2 shadow-lg shadow-brand-emerald/10"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Send OTP
                    <ChevronRight size={18} />
                  </>
                )}
              </button>
            </motion.form>
          ) : (
            <motion.div 
              key="otp"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <button 
                onClick={() => setStep('phone')}
                className="flex items-center gap-2 text-brand-emerald/40 hover:text-brand-emerald transition-colors text-sm font-bold"
              >
                <ArrowLeft size={16} />
                Edit Number
              </button>

              <div className="text-center">
                <h3 className="text-xl font-bold text-brand-emerald mb-2">Verify Identity</h3>
                <p className="text-sm text-brand-emerald/40">Enter the 4-digit code sent to <br/><span className="text-brand-emerald font-bold">{phoneNumber}</span></p>
              </div>

              <div className="flex justify-center gap-4">
                {otp.map((digit, idx) => (
                  <input 
                    key={idx}
                    id={`otp-${idx}`}
                    type="text"
                    maxLength={1}
                    className="w-14 h-16 text-center text-2xl font-bold bg-brand-sage/30 border border-transparent rounded-2xl focus:border-brand-emerald/20 focus:bg-white transition-all outline-none"
                    value={digit}
                    onChange={e => handleOtpChange(idx, e.target.value)}
                  />
                ))}
              </div>

              <button 
                onClick={handleLogin}
                disabled={isLoading || otp.some(d => !d)}
                className="w-full btn-primary py-4 flex items-center justify-center gap-2 shadow-lg shadow-brand-emerald/10 bg-brand-gold hover:bg-brand-gold/90"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Verify & Login
                    <CheckCircle2 size={18} />
                  </>
                )}
              </button>

              <p className="text-center text-xs text-brand-emerald/40 font-medium">
                Didn't receive code? <button className="text-brand-gold font-bold hover:underline">Resend in 45s</button>
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-10 pt-8 border-t border-brand-emerald/5 text-center">
          <p className="text-xs text-brand-emerald/30 font-medium">
            By logging in, you agree to RotaVault's <br/>
            <button className="underline">Terms of Service</button> and <button className="underline">Privacy Policy</button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
