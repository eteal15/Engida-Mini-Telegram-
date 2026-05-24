export type RoleType = 'reader' | 'writer' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: RoleType;
  telegramId?: string;
  coins: number;
  streak: number;
  badges: string[];
  lastActive: string;
  telebirrNumber?: string;
  hasSubscription?: boolean;
  subscriptionDueDate?: string;
}

export interface Story {
  id: string;
  title: string;
  coverImage: string;
  description: string;
  descriptionAmh?: string;
  genres: string[];
  authorId: string;
  authorName: string;
  status: 'ongoing' | 'completed';
  views: number;
  likes: number;
  bookmarksCount: number;
  unlockCount: number;
  isApproved: boolean;
  isFeatured: boolean;
  createdAt: string;
}

export interface Chapter {
  id: string;
  storyId: string;
  chapterNumber: number;
  title: string;
  content: string;
  isLocked: boolean; // Approved of locks by admin
  requestedPremiumLock?: boolean; // Writer requested this chapter to be locked
  coinPrice: number;
  views: number;
  likes: number;
  createdAt: string;
}

export interface Comment {
  id: string;
  chapterId: string;
  storyId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: string;
}

export interface Bookmark {
  id: string;
  userId: string;
  storyId: string;
  createdAt: string;
}

export interface Like {
  id: string;
  userId: string;
  storyId?: string;
  chapterId?: string;
  type: 'story' | 'chapter';
}

export interface Follow {
  id: string;
  followerId: string;
  authorId: string;
}

export interface CoinTransaction {
  id: string;
  userId: string;
  coinAmount: number;
  birrAmount: number;
  referenceId: string;
  telebirrNumber: string;
  screenshotUrl?: string;
  status: 'pending' | 'approved' | 'rejected';
  type?: 'coins' | 'subscription';
  createdAt: string;
}

export interface UnlockTransaction {
  id: string;
  readerId: string;
  writerId: string;
  chapterId: string;
  storyId: string;
  amount: number;
  writerShare: number;
  platformShare: number;
  createdAt: string;
}

export interface MonetizationRequest {
  id: string;
  writerId: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  telebirrNumber: string;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  createdAt: string;
}

export interface PremiumLockRequest {
  id: string;
  writerId: string;
  storyId: string;
  storyTitle: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface PayoutRecord {
  id: string;
  writerId: string;
  writerName: string;
  telebirrNumber: string;
  amount: number;
  status: 'pending' | 'paid' | 'rejected';
  notes?: string;
  createdAt: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'chapter' | 'follow' | 'payment' | 'monetization' | 'payout' | 'featured';
  read: boolean;
  createdAt: string;
}

export interface ContentReport {
  id: string;
  reporterId: string;
  storyId: string;
  storyTitle: string;
  reason: string;
  details: string;
  status: 'pending' | 'reviewed' | 'resolved';
  createdAt: string;
}

export interface FraudLog {
  id: string;
  userId: string;
  username: string;
  type: 'rapid_skip' | 'device_repetition' | 'fake_payout';
  details: string;
  createdAt: string;
}
