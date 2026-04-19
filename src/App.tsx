/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Users, 
  Wallet, 
  ShieldCheck, 
  Settings, 
  Plus, 
  Bell, 
  Search,
  TrendingUp,
  Clock,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownLeft,
  LogOut,
  MessageSquare,
  Scale,
  Menu,
  X
} from 'lucide-react';
import { cn, formatCurrency } from './lib/utils';
import type { User, Group, Contribution } from './types';
import CreateGroupModal from './components/CreateGroupModal';
import LoginPage from './components/LoginPage';

// --- Mock Data ---
const MOCK_MEMBER_USER: User = {
  id: 'u1',
  displayName: 'Gabriel Oseoriakhi',
  email: 'gabriel@example.com',
  phoneNumber: '+234 801 234 5678',
  trustScore: 88,
  kycLevel: 2,
  role: 'member',
  avatarUrl: 'https://picsum.photos/seed/gabriel/200',
  bankDetails: {
    accountNumber: '0123456789',
    bankName: 'Access Bank',
    accountName: 'Gabriel Oseoriakhi'
  }
};

const MOCK_ADMIN_USER: User = {
  id: 'u2',
  displayName: 'Admin Sarah',
  email: 'sarah@rotavault.com',
  phoneNumber: '+234 802 333 4444',
  trustScore: 100,
  kycLevel: 2,
  role: 'admin',
  avatarUrl: 'https://picsum.photos/seed/sarah/200',
  bankDetails: {
    accountNumber: '9876543210',
    bankName: 'Zenith Bank',
    accountName: 'Sarah Admin'
  }
};

const MOCK_GROUPS: Group[] = [
  {
    id: 'g1',
    name: 'Workplace Vault',
    model: 'rotating',
    contributionAmount: 20000,
    durationMonths: 10,
    startDate: '2026-04-01',
    maxMembers: 10,
    serviceFeePercent: 2,
    latenessFeeAmount: 500,
    adminId: 'u1',
    coAdminIds: [],
    memberIds: ['u1', 'u2', 'u3'],
    status: 'active',
    payoutOrder: ['u1', 'u2', 'u3'],
    currentCycle: 1,
    totalVaultValue: 200000,
    penaltyPool: 0
  },
  {
    id: 'g2',
    name: 'Year-end Pool',
    model: 'term-end',
    contributionAmount: 10000,
    durationMonths: 12,
    startDate: '2026-01-01',
    maxMembers: 12,
    serviceFeePercent: 2,
    latenessFeeAmount: 500,
    adminId: 'u2',
    coAdminIds: [],
    memberIds: ['u1', 'u2'],
    status: 'active',
    payoutOrder: [],
    currentCycle: 4,
    totalVaultValue: 120000,
    penaltyPool: 1500
  }
];

// --- Components ---

const Sidebar = ({ user, onLogout, onClose }: { user: User, onLogout: () => void, onClose?: () => void }) => {
  const location = useLocation();
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Users, label: 'My Groups', path: '/groups' },
    { icon: Wallet, label: 'Wallet', path: '/wallet' },
    { icon: MessageSquare, label: 'Group Chat', path: '/chat' },
    { icon: Scale, label: 'Disputes', path: '/disputes' },
    { icon: ShieldCheck, label: 'Trust Score', path: '/trust' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <aside className="w-64 h-full bg-brand-emerald text-white p-6 flex flex-col">
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-gold rounded-lg flex items-center justify-center">
            <ShieldCheck className="text-brand-emerald" size={24} />
          </div>
          <h1 className="text-2xl font-serif font-bold tracking-tight">RotaVault</h1>
        </div>
        {onClose && (
          <button onClick={onClose} className="lg:hidden p-2 hover:bg-white/10 rounded-lg">
            <X size={20} />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                isActive 
                  ? "bg-white/10 text-brand-gold" 
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon size={20} className={cn(isActive ? "text-brand-gold" : "text-white/50 group-hover:text-white")} />
              <span className="font-medium">{item.label}</span>
              {isActive && (
                <motion.div 
                  layoutId="activeNav"
                  className="ml-auto w-1.5 h-1.5 bg-brand-gold rounded-full"
                />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 border-t border-white/10 space-y-4">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-white/5">
          <img src={user.avatarUrl} alt="Avatar" className="w-10 h-10 rounded-full border border-white/20" referrerPolicy="no-referrer" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user.displayName}</p>
            <p className="text-[10px] text-white/50 uppercase font-bold tracking-widest">{user.role}</p>
          </div>
        </div>
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/50 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
        >
          <LogOut size={20} />
          <span className="font-medium">Log Out</span>
        </button>
      </div>
    </aside>
  );
};

const BottomNav = () => {
  const location = useLocation();
  const navItems = [
    { icon: LayoutDashboard, label: 'Home', path: '/' },
    { icon: Users, label: 'Groups', path: '/groups' },
    { icon: Wallet, label: 'Wallet', path: '/wallet' },
    { icon: MessageSquare, label: 'Chat', path: '/chat' },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-brand-emerald/5 px-6 py-3 flex justify-between items-center z-50 pb-safe">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link 
            key={item.path} 
            to={item.path}
            className={cn(
              "flex flex-col items-center gap-1 transition-colors",
              isActive ? "text-brand-emerald" : "text-brand-emerald/40"
            )}
          >
            <item.icon size={20} className={isActive ? "text-brand-gold" : ""} />
            <span className="text-[10px] font-bold uppercase tracking-tighter">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

const TrustScoreCard = ({ score }: { score: number }) => {
  const getTrustLevel = (s: number) => {
    if (s >= 85) return { label: 'Excellent', color: 'text-green-600', bg: 'bg-green-100', icon: CheckCircle2 };
    if (s >= 65) return { label: 'Good', color: 'text-blue-600', bg: 'bg-blue-100', icon: CheckCircle2 };
    if (s >= 40) return { label: 'Fair', color: 'text-amber-600', bg: 'bg-amber-100', icon: AlertCircle };
    return { label: 'Poor', color: 'text-red-600', bg: 'bg-red-100', icon: AlertCircle };
  };

  const level = getTrustLevel(score);

  return (
    <div className="glass-card p-6 flex items-center justify-between">
      <div>
        <p className="text-sm text-brand-emerald/60 font-medium mb-1 uppercase tracking-wider">Your Trust Score</p>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-serif font-bold text-brand-emerald">{score}</span>
          <span className="text-brand-emerald/40 font-medium">/ 100</span>
        </div>
        <div className={cn("mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-tight", level.bg, level.color)}>
          <level.icon size={14} />
          {level.label}
        </div>
      </div>
      <div className="w-24 h-24 relative flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90">
          <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-brand-sage" />
          <circle 
            cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" 
            strokeDasharray={251.2} 
            strokeDashoffset={251.2 - (251.2 * score) / 100} 
            className="text-brand-gold transition-all duration-1000 ease-out"
          />
        </svg>
        <ShieldCheck className="absolute text-brand-emerald/20" size={32} />
      </div>
    </div>
  );
};

const Dashboard = ({ user }: { user: User }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 space-y-8"
    >
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-bold text-brand-emerald mb-1">Welcome back, {user.displayName.split(' ')[0]}</h2>
          <p className="text-brand-emerald/60">Here's what's happening with your savings today.</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-brand-emerald/40 font-bold uppercase tracking-widest mb-1">Total Savings</p>
          <p className="text-2xl font-serif font-bold text-brand-emerald">{formatCurrency(320000)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <TrustScoreCard score={user.trustScore} />
        
        <div className="glass-card p-6 flex flex-col justify-between">
          <div>
            <p className="text-sm text-brand-emerald/60 font-medium mb-1 uppercase tracking-wider">Next Contribution</p>
            <p className="text-2xl font-serif font-bold text-brand-emerald">{formatCurrency(20000)}</p>
            <p className="text-sm text-brand-emerald/40 mt-1">Due in 5 days (Apr 25)</p>
          </div>
          <div className="mt-4 flex items-center gap-2 text-brand-gold font-bold text-xs uppercase tracking-tighter">
            <Clock size={14} />
            Workplace Vault
          </div>
        </div>

        <div className="glass-card p-6 flex flex-col justify-between">
          <div>
            <p className="text-sm text-brand-emerald/60 font-medium mb-1 uppercase tracking-wider">Expected Payout</p>
            <p className="text-2xl font-serif font-bold text-brand-emerald">{formatCurrency(200000)}</p>
            <p className="text-sm text-brand-emerald/40 mt-1">May 15, 2026</p>
          </div>
          <div className="mt-4 flex items-center gap-2 text-green-600 font-bold text-xs uppercase tracking-tighter">
            <TrendingUp size={14} />
            Turn position: 2nd
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-brand-emerald">Active Groups</h3>
            <Link to="/groups" className="text-sm font-bold text-brand-gold hover:underline flex items-center gap-1">
              View All <ChevronRight size={16} />
            </Link>
          </div>
          <div className="space-y-4">
            {MOCK_GROUPS.map((group) => (
              <div key={group.id} className="glass-card p-5 hover:border-brand-emerald/30 transition-all cursor-pointer group">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-lg font-bold text-brand-emerald">{group.name}</h4>
                    <p className="text-xs text-brand-emerald/40 font-medium uppercase tracking-widest">
                      {group.model === 'rotating' ? 'Rotating Ajo' : 'Term-End Savings'}
                    </p>
                  </div>
                  <div className="px-3 py-1 bg-brand-sage text-brand-emerald text-[10px] font-bold rounded-full uppercase tracking-widest">
                    Cycle {group.currentCycle} of {group.durationMonths}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <img 
                        key={i} 
                        src={`https://picsum.photos/seed/${group.id}${i}/100`} 
                        className="w-8 h-8 rounded-full border-2 border-white" 
                        alt="Member"
                        referrerPolicy="no-referrer"
                      />
                    ))}
                    <div className="w-8 h-8 rounded-full bg-brand-sage border-2 border-white flex items-center justify-center text-[10px] font-bold text-brand-emerald">
                      +{group.maxMembers - 4}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-brand-emerald/40 font-bold uppercase tracking-tighter">Vault Value</p>
                    <p className="font-serif font-bold text-brand-emerald">{formatCurrency(group.totalVaultValue)}</p>
                  </div>
                </div>
                <div className="mt-4 h-1.5 w-full bg-brand-sage rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(group.currentCycle / group.durationMonths) * 100}%` }}
                    className="h-full bg-brand-gold"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-brand-emerald">Recent Activity</h3>
            <button className="text-sm font-bold text-brand-gold hover:underline">History</button>
          </div>
          <div className="glass-card divide-y divide-brand-emerald/5">
            {[
              { type: 'payment', title: 'Contribution Paid', group: 'Workplace Vault', amount: 20000, date: '2 hours ago', status: 'success' },
              { type: 'payout', title: 'Payout Received', group: 'Small Circle Save', amount: 120000, date: '2 days ago', status: 'success' },
              { type: 'penalty', title: 'Penalty Applied', group: 'Year-end Pool', amount: 500, date: '3 days ago', status: 'warning' },
              { type: 'trust', title: 'Trust Score Increased', group: 'Platform', amount: 5, date: '1 week ago', status: 'success' },
            ].map((activity, idx) => (
              <div key={idx} className="p-4 flex items-center gap-4 hover:bg-brand-sage/20 transition-colors">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center",
                  activity.type === 'payment' ? "bg-blue-100 text-blue-600" :
                  activity.type === 'payout' ? "bg-green-100 text-green-600" :
                  activity.type === 'penalty' ? "bg-red-100 text-red-600" : "bg-brand-gold/10 text-brand-gold"
                )}>
                  {activity.type === 'payment' ? <ArrowUpRight size={20} /> :
                   activity.type === 'payout' ? <ArrowDownLeft size={20} /> :
                   activity.type === 'penalty' ? <AlertCircle size={20} /> : <ShieldCheck size={20} />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-brand-emerald">{activity.title}</p>
                  <p className="text-xs text-brand-emerald/40">{activity.group} • {activity.date}</p>
                </div>
                <div className="text-right">
                  <p className={cn(
                    "font-mono font-bold text-sm",
                    activity.type === 'payout' ? "text-green-600" : 
                    activity.type === 'penalty' ? "text-red-600" : "text-brand-emerald"
                  )}>
                    {activity.type === 'payout' ? '+' : activity.type === 'penalty' ? '-' : ''}
                    {activity.type === 'trust' ? activity.amount : formatCurrency(activity.amount)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </motion.div>
  );
};

const GroupsPage = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 space-y-8"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-brand-emerald">My Groups</h2>
          <p className="text-brand-emerald/60">Manage your active and pending contribution groups.</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-secondary text-sm py-2">Filter</button>
          <button className="btn-primary text-sm py-2">Join Group</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {MOCK_GROUPS.map((group) => (
          <div key={group.id} className="glass-card p-6 flex flex-col group cursor-pointer hover:border-brand-emerald/30 transition-all">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 bg-brand-sage rounded-2xl flex items-center justify-center text-brand-emerald">
                {group.model === 'rotating' ? <Users size={24} /> : <ShieldCheck size={24} />}
              </div>
              <span className={cn(
                "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                group.status === 'active' ? "bg-green-100 text-green-700" : "bg-brand-sage text-brand-emerald"
              )}>
                {group.status}
              </span>
            </div>
            <h3 className="text-xl font-bold text-brand-emerald mb-1">{group.name}</h3>
            <p className="text-xs text-brand-emerald/40 font-bold uppercase tracking-widest mb-6">
              {group.model === 'rotating' ? 'Rotating Ajo' : 'Term-End Savings'}
            </p>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-[10px] text-brand-emerald/40 font-bold uppercase tracking-widest">Monthly</p>
                <p className="font-bold text-brand-emerald">{formatCurrency(group.contributionAmount)}</p>
              </div>
              <div>
                <p className="text-[10px] text-brand-emerald/40 font-bold uppercase tracking-widest">Total Vault</p>
                <p className="font-bold text-brand-emerald">{formatCurrency(group.totalVaultValue)}</p>
              </div>
            </div>

            <div className="mt-auto pt-6 border-t border-brand-emerald/5 flex items-center justify-between">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <img key={i} src={`https://picsum.photos/seed/${group.id}${i}/100`} className="w-8 h-8 rounded-full border-2 border-white" alt="Member" referrerPolicy="no-referrer" />
                ))}
                <div className="w-8 h-8 rounded-full bg-brand-sage border-2 border-white flex items-center justify-center text-[10px] font-bold text-brand-emerald">
                  +{group.maxMembers - 3}
                </div>
              </div>
              <button className="text-brand-gold font-bold text-sm flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Details <ChevronRight size={16} />
              </button>
            </div>
          </div>
        ))}
        
        <button className="border-2 border-dashed border-brand-emerald/10 rounded-3xl p-6 flex flex-col items-center justify-center gap-4 text-brand-emerald/40 hover:bg-brand-sage/20 hover:border-brand-emerald/20 transition-all">
          <div className="w-12 h-12 rounded-full bg-brand-sage flex items-center justify-center">
            <Plus size={24} />
          </div>
          <p className="font-bold">Create New Group</p>
        </button>
      </div>
    </motion.div>
  );
};

const WalletPage = ({ user }: { user: User }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 space-y-8"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-brand-emerald">Wallet</h2>
          <p className="text-brand-emerald/60">Manage your funds, payouts, and bank accounts.</p>
        </div>
        <button className="btn-primary text-sm py-2">Withdraw Funds</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-brand-emerald rounded-[2rem] p-8 text-white relative overflow-hidden shadow-xl">
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-12">
                <div>
                  <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Available Balance</p>
                  <p className="text-4xl font-serif font-bold">{formatCurrency(450500)}</p>
                </div>
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
                  <Wallet size={24} className="text-brand-gold" />
                </div>
              </div>
              <div className="flex gap-8">
                <div>
                  <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">Total Payouts</p>
                  <p className="text-lg font-bold">{formatCurrency(1200000)}</p>
                </div>
                <div>
                  <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">Total Contributions</p>
                  <p className="text-lg font-bold">{formatCurrency(750000)}</p>
                </div>
              </div>
            </div>
            {/* Decorative circles */}
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-brand-gold/10 rounded-full blur-3xl" />
            <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          </div>

          <section>
            <h3 className="text-xl font-bold text-brand-emerald mb-4">Transaction History</h3>
            <div className="glass-card divide-y divide-brand-emerald/5">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="p-4 flex items-center justify-between hover:bg-brand-sage/20 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-brand-sage flex items-center justify-center text-brand-emerald">
                      <ArrowDownLeft size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-brand-emerald">Payout from Workplace Vault</p>
                      <p className="text-xs text-brand-emerald/40">Apr 10, 2026 • Ref: RV-928374</p>
                    </div>
                  </div>
                  <p className="font-mono font-bold text-green-600">+{formatCurrency(200000)}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <section>
            <h3 className="text-xl font-bold text-brand-emerald mb-4">Linked Accounts</h3>
            <div className="space-y-4">
              <div className="glass-card p-5 border-l-4 border-brand-gold">
                <div className="flex justify-between items-start mb-4">
                  <p className="text-xs font-bold text-brand-emerald/40 uppercase tracking-widest">Primary Account</p>
                  <CheckCircle2 size={16} className="text-brand-gold" />
                </div>
                <p className="text-lg font-bold text-brand-emerald">{user.bankDetails?.bankName}</p>
                <p className="text-sm text-brand-emerald/60 font-mono tracking-widest">**** **** {user.bankDetails?.accountNumber.slice(-4)}</p>
                <p className="text-xs text-brand-emerald/40 mt-4 uppercase font-bold">{user.bankDetails?.accountName}</p>
              </div>
              <button className="w-full py-4 border-2 border-dashed border-brand-emerald/10 rounded-2xl text-brand-emerald/40 font-bold text-sm hover:bg-brand-sage/20 transition-all flex items-center justify-center gap-2">
                <Plus size={18} /> Add Bank Account
              </button>
            </div>
          </section>

          <div className="p-6 bg-brand-gold/10 rounded-3xl border border-brand-gold/20">
            <h4 className="font-bold text-brand-emerald mb-2">Security Tip</h4>
            <p className="text-xs text-brand-emerald/60 leading-relaxed">
              Always verify the payout account details before the cycle ends. Payouts are automated and cannot be reversed once disbursed.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogin = (role: 'admin' | 'member') => {
    setUser(role === 'admin' ? MOCK_ADMIN_USER : MOCK_MEMBER_USER);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-brand-cream flex flex-col lg:flex-row">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-64 h-screen sticky top-0">
          <Sidebar user={user} onLogout={handleLogout} />
        </div>

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {isSidebarOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsSidebarOpen(false)}
                className="lg:hidden fixed inset-0 bg-brand-ink/60 backdrop-blur-sm z-[60]"
              />
              <motion.div 
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="lg:hidden fixed inset-y-0 left-0 w-64 z-[70] shadow-2xl"
              >
                <Sidebar user={user} onLogout={handleLogout} onClose={() => setIsSidebarOpen(false)} />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <main className="flex-1 min-h-screen flex flex-col pb-20 lg:pb-0">
          <header className="h-16 lg:h-20 flex items-center justify-between px-4 lg:px-8 bg-brand-cream/80 backdrop-blur-md sticky top-0 z-40 border-b border-brand-emerald/5">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-brand-sage rounded-xl text-brand-emerald"
              >
                <Menu size={20} />
              </button>
              <div className="relative w-40 lg:w-96 hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-emerald/30" size={18} />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="w-full pl-10 pr-4 py-2 bg-brand-sage/50 border-none rounded-xl focus:ring-2 focus:ring-brand-emerald/20 transition-all text-sm"
                />
              </div>
              <h1 className="lg:hidden text-xl font-serif font-bold text-brand-emerald">RotaVault</h1>
            </div>
            <div className="flex items-center gap-2 lg:gap-4">
              <button className="p-2 rounded-xl hover:bg-brand-sage transition-colors relative">
                <Bell size={20} className="text-brand-emerald" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-brand-cream" />
              </button>
              <button 
                onClick={() => setIsCreateModalOpen(true)}
                className="btn-primary flex items-center gap-2 text-xs lg:text-sm py-2 px-3 lg:px-4"
              >
                <Plus size={18} />
                <span className="hidden xs:inline">Create Group</span>
              </button>
            </div>
          </header>

          <div className="flex-1">
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<Dashboard user={user} />} />
                <Route path="/groups" element={<GroupsPage />} />
                <Route path="/wallet" element={<WalletPage user={user} />} />
                <Route path="/chat" element={<div className="p-8"><h2 className="text-3xl font-bold text-brand-emerald">Group Chat</h2><p className="text-brand-emerald/60 mt-2">Coming soon: Moderated in-app chat for members.</p></div>} />
                <Route path="/disputes" element={<div className="p-8"><h2 className="text-3xl font-bold text-brand-emerald">Disputes</h2><p className="text-brand-emerald/60 mt-2">Coming soon: Dispute Resolution Centre.</p></div>} />
                <Route path="/trust" element={<div className="p-8"><h2 className="text-3xl font-bold text-brand-emerald">Trust Score</h2></div>} />
                <Route path="/settings" element={<div className="p-8"><h2 className="text-3xl font-bold text-brand-emerald">Settings</h2></div>} />
              </Routes>
            </AnimatePresence>
          </div>
        </main>

        <BottomNav />
      </div>

      <CreateGroupModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />
    </Router>
  );
}
