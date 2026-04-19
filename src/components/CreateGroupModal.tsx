/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Info, ChevronRight, ChevronLeft, ShieldCheck, Users, Calendar, Wallet } from 'lucide-react';
import { cn, formatCurrency } from '../lib/utils';
import type { SavingsModel } from '../types';

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateGroupModal({ isOpen, onClose }: CreateGroupModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    model: 'rotating' as SavingsModel,
    contributionAmount: 10000,
    durationMonths: 6,
    maxMembers: 10,
    latenessFee: 500,
    serviceFee: 2,
    payoutOrder: 'random' as 'random' | 'manual' | 'bid-based',
  });

  const templates = [
    { name: 'Workplace Vault', members: 10, amount: 20000, duration: 10, model: 'rotating', fee: 2, penalty: 500 },
    { name: 'Small Circle Save', members: 5, amount: 50000, duration: 5, model: 'rotating', fee: 1.5, penalty: 1000 },
    { name: 'Year-end Pool', members: 12, amount: 10000, duration: 12, model: 'term-end', fee: 2, penalty: 500 },
  ];

  const applyTemplate = (t: typeof templates[0]) => {
    setFormData({
      ...formData,
      name: t.name,
      maxMembers: t.members,
      contributionAmount: t.amount,
      durationMonths: t.duration,
      model: t.model as SavingsModel,
      serviceFee: t.fee,
      latenessFee: t.penalty
    });
    setStep(2);
  };

  const nextStep = () => setStep(s => Math.min(s + 1, 3));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-ink/40 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-brand-cream w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-6 border-b border-brand-emerald/5 flex items-center justify-between bg-white">
          <div>
            <h3 className="text-xl font-bold text-brand-emerald">Create New Group</h3>
            <p className="text-sm text-brand-emerald/40">Step {step} of 3: {step === 1 ? 'Basic Info' : step === 2 ? 'Rules & Fees' : 'Review'}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-brand-sage rounded-full transition-colors">
            <X size={20} className="text-brand-emerald" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <section className="space-y-4">
                  <label className="text-xs font-bold text-brand-emerald/40 uppercase tracking-widest ml-1">Quick Templates</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {templates.map((t) => (
                      <button 
                        key={t.name}
                        onClick={() => applyTemplate(t)}
                        className="p-4 bg-white border border-brand-emerald/5 rounded-2xl text-left hover:border-brand-gold/50 transition-all group"
                      >
                        <p className="text-sm font-bold text-brand-emerald group-hover:text-brand-gold transition-colors">{t.name}</p>
                        <p className="text-[10px] text-brand-emerald/40 font-medium mt-1">
                          {formatCurrency(t.amount)}/mo • {t.members} members
                        </p>
                      </button>
                    ))}
                  </div>
                </section>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-brand-emerald uppercase tracking-wider">Group Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Workplace Savings 2026"
                    className="w-full px-4 py-3 bg-white border border-brand-emerald/10 rounded-xl focus:ring-2 focus:ring-brand-emerald/20 transition-all outline-none"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-brand-emerald uppercase tracking-wider">Savings Model</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      { id: 'rotating', label: 'Rotating', desc: 'Classic Ajo', icon: Users },
                      { id: 'term-end', label: 'Term-End', desc: 'Forced Savings', icon: ShieldCheck },
                      { id: 'goal-based', label: 'Goal-Based', desc: 'Shared Target', icon: Wallet },
                    ].map((m) => (
                      <button
                        key={m.id}
                        onClick={() => setFormData({ ...formData, model: m.id as SavingsModel })}
                        className={cn(
                          "p-4 rounded-2xl border-2 text-left transition-all",
                          formData.model === m.id 
                            ? "border-brand-gold bg-brand-gold/5 ring-4 ring-brand-gold/10" 
                            : "border-brand-emerald/5 bg-white hover:border-brand-emerald/20"
                        )}
                      >
                        <m.icon size={24} className={cn("mb-2", formData.model === m.id ? "text-brand-gold" : "text-brand-emerald/40")} />
                        <p className="font-bold text-brand-emerald">{m.label}</p>
                        <p className="text-[10px] text-brand-emerald/40 uppercase font-bold tracking-tighter">{m.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-brand-emerald uppercase tracking-wider">Contribution</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-emerald/40 font-bold">₦</span>
                      <input 
                        type="number" 
                        className="w-full pl-8 pr-4 py-3 bg-white border border-brand-emerald/10 rounded-xl outline-none"
                        value={formData.contributionAmount}
                        onChange={e => setFormData({ ...formData, contributionAmount: Number(e.target.value) })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-brand-emerald uppercase tracking-wider">Duration (Months)</label>
                    <input 
                      type="number" 
                      className="w-full px-4 py-3 bg-white border border-brand-emerald/10 rounded-xl outline-none"
                      value={formData.durationMonths}
                      onChange={e => setFormData({ ...formData, durationMonths: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-brand-emerald uppercase tracking-wider">Max Members</label>
                    <input 
                      type="number" 
                      className="w-full px-4 py-3 bg-white border border-brand-emerald/10 rounded-xl outline-none"
                      value={formData.maxMembers}
                      onChange={e => setFormData({ ...formData, maxMembers: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-brand-emerald uppercase tracking-wider">Lateness Fee</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-emerald/40 font-bold">₦</span>
                      <input 
                        type="number" 
                        className="w-full pl-8 pr-4 py-3 bg-white border border-brand-emerald/10 rounded-xl outline-none"
                        value={formData.latenessFee}
                        onChange={e => setFormData({ ...formData, latenessFee: Number(e.target.value) })}
                      />
                    </div>
                  </div>
                </div>

                {formData.model === 'rotating' && (
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-brand-emerald uppercase tracking-wider">Payout Order Preference</label>
                    <div className="grid grid-cols-3 gap-3">
                      {['random', 'manual', 'bid-based'].map((o) => (
                        <button
                          key={o}
                          onClick={() => setFormData({ ...formData, payoutOrder: o as any })}
                          className={cn(
                            "py-2 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all",
                            formData.payoutOrder === o 
                              ? "bg-brand-emerald text-white border-brand-emerald" 
                              : "bg-white text-brand-emerald/40 border-brand-emerald/10"
                          )}
                        >
                          {o}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="p-4 bg-brand-gold/10 rounded-2xl flex gap-3 border border-brand-gold/20">
                  <Info className="text-brand-gold shrink-0" size={20} />
                  <p className="text-xs text-brand-gold font-medium leading-relaxed">
                    A platform service fee of 2% will be deducted from each contribution. 
                    Lateness fees are pooled and distributed at the end of the cycle.
                  </p>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="p-6 bg-white rounded-3xl border border-brand-emerald/5 space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b border-brand-emerald/5">
                    <h4 className="text-2xl font-serif font-bold text-brand-emerald">{formData.name || 'Untitled Group'}</h4>
                    <span className="px-3 py-1 bg-brand-sage text-brand-emerald text-[10px] font-bold rounded-full uppercase tracking-widest">
                      {formData.model}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-y-4">
                    <div>
                      <p className="text-[10px] text-brand-emerald/40 font-bold uppercase tracking-widest">Monthly Contribution</p>
                      <p className="font-bold text-brand-emerald">{formatCurrency(formData.contributionAmount)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-brand-emerald/40 font-bold uppercase tracking-widest">Total Vault Value</p>
                      <p className="font-bold text-brand-emerald">{formatCurrency(formData.contributionAmount * formData.maxMembers)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-brand-emerald/40 font-bold uppercase tracking-widest">Duration</p>
                      <p className="font-bold text-brand-emerald">{formData.durationMonths} Months</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-brand-emerald/40 font-bold uppercase tracking-widest">Max Members</p>
                      <p className="font-bold text-brand-emerald">{formData.maxMembers} People</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-2xl border border-green-100">
                  <ShieldCheck className="text-green-600" size={20} />
                  <p className="text-xs text-green-700 font-medium">
                    Rules will be locked once the first payment is made.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-brand-emerald/5 bg-white flex items-center justify-between">
          <button 
            onClick={prevStep}
            disabled={step === 1}
            className="flex items-center gap-2 text-brand-emerald font-bold text-sm disabled:opacity-30"
          >
            <ChevronLeft size={18} />
            Back
          </button>
          
          {step < 3 ? (
            <button 
              onClick={nextStep}
              className="btn-primary flex items-center gap-2 text-sm py-2 px-8"
            >
              Continue
              <ChevronRight size={18} />
            </button>
          ) : (
            <button 
              onClick={onClose}
              className="btn-primary flex items-center gap-2 text-sm py-2 px-8 bg-brand-gold hover:bg-brand-gold/90"
            >
              Create Group
              <ShieldCheck size={18} />
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
