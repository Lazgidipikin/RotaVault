/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type SavingsModel = 'rotating' | 'term-end' | 'goal-based';

export interface User {
  id: string;
  displayName: string;
  email: string;
  phoneNumber: string;
  avatarUrl?: string;
  trustScore: number; // 0-100
  kycLevel: 1 | 2;
  role: 'admin' | 'member';
  bankDetails?: {
    accountNumber: string;
    bankName: string;
    accountName: string;
  };
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  model: SavingsModel;
  contributionAmount: number;
  durationMonths: number;
  startDate: string;
  maxMembers: number;
  serviceFeePercent: number;
  latenessFeeAmount: number;
  adminId: string;
  coAdminIds: string[];
  memberIds: string[];
  status: 'pending' | 'active' | 'completed' | 'archived';
  payoutOrder: string[]; // User IDs in order
  currentCycle: number; // 1 to durationMonths
  totalVaultValue: number;
  penaltyPool: number;
}

export interface Contribution {
  id: string;
  groupId: string;
  userId: string;
  amount: number;
  cycle: number;
  date: string;
  status: 'paid' | 'late' | 'pending';
  penaltyPaid?: number;
  serviceFeePaid: number;
  referenceId: string;
}

export interface Payout {
  id: string;
  groupId: string;
  userId: string;
  amount: number;
  cycle: number;
  date: string;
  status: 'pending' | 'disbursed' | 'failed';
  referenceId: string;
}

export interface TrustScoreHistory {
  userId: string;
  change: number;
  reason: string;
  date: string;
}
