import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile, Story, Chapter, Comment, CoinTransaction, UnlockTransaction,
  MonetizationRequest, PremiumLockRequest, PayoutRecord, AppNotification,
  ContentReport, FraudLog, RoleType
} from './types';
import {
  INITIAL_USERS, INITIAL_STORIES, INITIAL_CHAPTERS, INITIAL_COMMENTS
} from './data';

interface AppContextProps {
  currentUser: UserProfile | null;
  currentLanguage: 'eng' | 'amh';
  stories: Story[];
  chapters: Chapter[];
  comments: Comment[];
  coinTransactions: CoinTransaction[];
  unlockTransactions: UnlockTransaction[];
  monetizationRequests: MonetizationRequest[];
  premiumRequests: PremiumLockRequest[];
  payouts: PayoutRecord[];
  notifications: AppNotification[];
  reports: ContentReport[];
  fraudLogs: FraudLog[];
  bookmarks: string[]; // Story IDs bookmarked by current user
  likedStories: string[]; // Story IDs liked by current user
  likedChapters: string[]; // Chapter IDs liked by current user
  followedWriters: string[]; // Writer IDs followed by current user
  
  // UI states
  activeStoryId: string | null;
  activeChapterId: string | null;
  telebirrMerchantNumber: string;
  telegramBotToken: string;
  
  // Actions
  setLanguage: (lang: 'eng' | 'amh') => void;
  setCurrentUser: (user: UserProfile | null) => void;
  changeUserRole: (role: RoleType) => void;
  loginSimulated: (email: string, name: string, role?: RoleType, telegramId?: string) => void;
  logout: () => void;
  setUserCoins: (amount: number) => void;
  
  // Content Actions
  createStory: (title: string, desc: string, cover: string, genres: string[], authorId: string, authorName: string) => Story;
  updateStory: (storyId: string, updates: Partial<Story>) => void;
  deleteStory: (storyId: string) => void;
  createChapter: (storyId: string, title: string, content: string, requestLock: boolean, coinPrice: number) => Chapter;
  editChapter: (chapterId: string, title: string, content: string, isLocked: boolean, coinPrice: number) => void;
  addComment: (chapterId: string, storyId: string, content: string) => void;
  toggleLikeStory: (storyId: string) => void;
  toggleLikeChapter: (chapterId: string) => void;
  toggleBookmark: (storyId: string) => void;
  toggleFollow: (writerId: string) => void;
  
  // Monetization / Wallet Actions
  submitCoinPurchase: (coinAmount: number, birrAmount: number, refId: string, telebirrNo: string, simulatedFile?: string, type?: 'coins' | 'subscription') => void;
  unlockChapter: (chapterId: string) => boolean;
  submitMonetizationRequest: (fullName: string, phone: string, email: string, telebirrNo: string) => void;
  submitPremiumRequest: (storyId: string) => void;
  
  // Admin Operations
  adminApproveCoinPurchase: (txId: string) => void;
  adminRejectCoinPurchase: (txId: string) => void;
  adminApproveMonetization: (reqId: string) => void;
  adminRejectMonetization: (reqId: string) => void;
  adminSuspendMonetization: (reqId: string) => void;
  adminApprovePremium: (reqId: string) => void;
  adminRejectPremium: (reqId: string) => void;
  adminProcessPayout: (writerId: string, amount: number, status: 'pending' | 'paid' | 'rejected', notes?: string) => void;
  adminModerateStory: (storyId: string, action: 'approve' | 'reject' | 'delete' | 'feature') => void;
  adminSetChapterLock: (chapterId: string, isLocked: boolean, coinPrice: number) => void;
  adminResolveReport: (reportId: string, action: 'resolved' | 'reviewed') => void;
  submitStoryReport: (storyId: string, reason: string, details: string) => void;
  clearAllState: () => void;
  
  // Simulator Utilities
  simulateFraud: (type: 'rapid_skip' | 'device_repetition', details: string) => void;
  simulateReadersCount: (storyId: string, increment: number) => void;
  
  // Helper calculations for Writer Dashboard / Earnings
  getWriterStats: (writerId: string) => {
    reads: number;
    likes: number;
    followers: number;
    pendingBalance: number;
    withdrawableBalance: number;
    paidBalance: number;
    payoutHistory: PayoutRecord[];
    unlockedChaptersCount: number;
    storiesPublished: number;
    chaptersPublished: number;
    qualifiedReadersCount: number;
    avgReadDuration: number;
    accountAgeDays: number;
  };
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  // Configs
  const [telebirrMerchantNumber, setTelebirrMerchantNumber] = useState('0987654321');
  const [telegramBotToken, setTelegramBotToken] = useState('8124956241:AAH_ENGIDA_Story_Bot_Active_Token');

  // Load from LocalStorage or fallback to data.ts initial lists
  const [currentUser, setCurrentUserState] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('engida_current_user');
    if (saved) return JSON.parse(saved);
    // Boot up default logged-in user (lenaedward949@gmail.com which matches user's email in metadata as Admin!)
    return {
      id: 'user_admin',
      name: 'Lena Edward (Admin)',
      email: 'lenaedward949@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      role: 'admin',
      coins: 1250,
      streak: 15,
      badges: ['Ethio Literature Patron', 'Super Reader', 'App Architect'],
      lastActive: new Date().toISOString()
    };
  });

  const [currentLanguage, setLanguageState] = useState<'eng' | 'amh'>(() => {
    return (localStorage.getItem('engida_language') as 'eng' | 'amh') || 'amh';
  });

  const [stories, setStories] = useState<Story[]>(() => {
    const saved = localStorage.getItem('engida_stories');
    return saved ? JSON.parse(saved) : INITIAL_STORIES;
  });

  const [chapters, setChapters] = useState<Chapter[]>(() => {
    const saved = localStorage.getItem('engida_chapters');
    return saved ? JSON.parse(saved) : INITIAL_CHAPTERS;
  });

  const [comments, setComments] = useState<Comment[]>(() => {
    const saved = localStorage.getItem('engida_comments');
    return saved ? JSON.parse(saved) : INITIAL_COMMENTS;
  });

  const [coinTransactions, setCoinTransactions] = useState<CoinTransaction[]>(() => {
    const saved = localStorage.getItem('engida_coin_txs');
    return saved ? JSON.parse(saved) : [
      {
        id: 'tx_1',
        userId: 'reader_yared',
        coinAmount: 110,
        birrAmount: 100,
        referenceId: 'TXN89124712',
        telebirrNumber: '0911556677',
        status: 'approved',
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'tx_2',
        userId: 'writer_selam',
        coinAmount: 50,
        birrAmount: 50,
        referenceId: 'TXN56230911',
        telebirrNumber: '0912345678',
        status: 'pending',
        createdAt: new Date().toISOString()
      }
    ];
  });

  const [unlockTransactions, setUnlockTransactions] = useState<UnlockTransaction[]>(() => {
    const saved = localStorage.getItem('engida_unlock_txs');
    return saved ? JSON.parse(saved) : [
      {
        id: 'un_1',
        readerId: 'reader_yared',
        writerId: 'writer_abera',
        chapterId: 'chap_1_3',
        storyId: 'story_1',
        amount: 10,
        writerShare: 6,
        platformShare: 4,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];
  });

  const [monetizationRequests, setMonetizationRequests] = useState<MonetizationRequest[]>(() => {
    const saved = localStorage.getItem('engida_mon_requests');
    return saved ? JSON.parse(saved) : [
      {
        id: 'mon_req_1',
        writerId: 'writer_abera',
        fullName: 'Abera Molla Garedew',
        phoneNumber: '0911223344',
        email: 'abera@engida.com',
        telebirrNumber: '0911223344',
        status: 'approved',
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];
  });

  const [premiumRequests, setPremiumRequests] = useState<PremiumLockRequest[]>(() => {
    const saved = localStorage.getItem('engida_prem_requests');
    return saved ? JSON.parse(saved) : [];
  });

  const [payouts, setPayouts] = useState<PayoutRecord[]>(() => {
    const saved = localStorage.getItem('engida_payouts');
    return saved ? JSON.parse(saved) : [
      {
        id: 'pay_1',
        writerId: 'writer_abera',
        writerName: 'Abera Molla',
        telebirrNumber: '0911223344',
        amount: 1500, // in ETB
        status: 'paid',
        notes: 'Paid via Telebirr manual transfer on May 15, 2026',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('engida_notifications');
    return saved ? JSON.parse(saved) : [
      {
        id: 'not_1',
        userId: 'user_admin',
        title: 'New Chapter Published',
        message: 'Abera Molla published Chapter 3 of የስደተኛው ማስታወሻ',
        type: 'chapter',
        read: false,
        createdAt: new Date().toISOString()
      }
    ];
  });

  const [reports, setReports] = useState<ContentReport[]>(() => {
    const saved = localStorage.getItem('engida_reports');
    return saved ? JSON.parse(saved) : [];
  });

  const [fraudLogs, setFraudLogs] = useState<FraudLog[]>(() => {
    const saved = localStorage.getItem('engida_fraud_logs');
    return saved ? JSON.parse(saved) : [
      {
        id: 'fraud_1',
        userId: 'reader_test',
        username: 'Simulated Fraudster',
        type: 'rapid_skip',
        details: 'User skipped 10 chapters in less than 3 seconds (Automated script flag).',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];
  });

  // User interactions stored locally
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    const saved = localStorage.getItem('engida_bookmarks');
    return saved ? JSON.parse(saved) : ['story_1'];
  });

  const [likedStories, setLikedStories] = useState<string[]>(() => {
    const saved = localStorage.getItem('engida_likes_st');
    return saved ? JSON.parse(saved) : ['story_1'];
  });

  const [likedChapters, setLikedChapters] = useState<string[]>(() => {
    const saved = localStorage.getItem('engida_likes_ch');
    return saved ? JSON.parse(saved) : ['chap_1_1'];
  });

  const [followedWriters, setFollowedWriters] = useState<string[]>(() => {
    const saved = localStorage.getItem('engida_follows');
    return saved ? JSON.parse(saved) : ['writer_abera'];
  });

  // Simulator statistics incrementers
  const [simulatedReaders, setSimulatedReaders] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('engida_sim_readers');
    return saved ? JSON.parse(saved) : { story_1: 520, story_2: 120, story_3: 40 };
  });

  const [activeStoryId, setActiveStoryId] = useState<string | null>(null);
  const [activeChapterId, setActiveChapterId] = useState<string | null>(null);

  // Sync with LocalStorage
  useEffect(() => {
    localStorage.setItem('engida_stories', JSON.stringify(stories));
  }, [stories]);

  useEffect(() => {
    localStorage.setItem('engida_chapters', JSON.stringify(chapters));
  }, [chapters]);

  useEffect(() => {
    localStorage.setItem('engida_comments', JSON.stringify(comments));
  }, [comments]);

  useEffect(() => {
    localStorage.setItem('engida_coin_txs', JSON.stringify(coinTransactions));
  }, [coinTransactions]);

  useEffect(() => {
    localStorage.setItem('engida_unlock_txs', JSON.stringify(unlockTransactions));
  }, [unlockTransactions]);

  useEffect(() => {
    localStorage.setItem('engida_mon_requests', JSON.stringify(monetizationRequests));
  }, [monetizationRequests]);

  useEffect(() => {
    localStorage.setItem('engida_prem_requests', JSON.stringify(premiumRequests));
  }, [premiumRequests]);

  useEffect(() => {
    localStorage.setItem('engida_payouts', JSON.stringify(payouts));
  }, [payouts]);

  useEffect(() => {
    localStorage.setItem('engida_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('engida_reports', JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem('engida_fraud_logs', JSON.stringify(fraudLogs));
  }, [fraudLogs]);

  useEffect(() => {
    localStorage.setItem('engida_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem('engida_likes_st', JSON.stringify(likedStories));
  }, [likedStories]);

  useEffect(() => {
    localStorage.setItem('engida_likes_ch', JSON.stringify(likedChapters));
  }, [likedChapters]);

  useEffect(() => {
    localStorage.setItem('engida_follows', JSON.stringify(followedWriters));
  }, [followedWriters]);

  useEffect(() => {
    localStorage.setItem('engida_sim_readers', JSON.stringify(simulatedReaders));
  }, [simulatedReaders]);

  // Set Language Action
  const setLanguage = (lang: 'eng' | 'amh') => {
    setLanguageState(lang);
    localStorage.setItem('engida_language', lang);
  };

  // Set Current User Action
  const setCurrentUser = (user: UserProfile | null) => {
    setCurrentUserState(user);
    if (user) {
      localStorage.setItem('engida_current_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('engida_current_user');
    }
  };

  // Change Role dynamically (for simulation & admin override)
  const changeUserRole = (role: RoleType) => {
    if (!currentUser) return;
    const updated = { ...currentUser, role };
    setCurrentUser(updated);
    
    // Auto add custom badge for fun
    if (role === 'admin' && !updated.badges.includes('App Architect')) {
      updated.badges.push('App Architect');
    }
    if (role === 'writer' && !updated.badges.includes('Ethio Creator')) {
      updated.badges.push('Ethio Creator');
    }
  };

  // Login Simulated
  const loginSimulated = (email: string, name: string, role?: RoleType, telegramId?: string) => {
    // If Admin email is entered, automatically make admin!
    let finalRole: RoleType = role || 'reader';
    if (email.toLowerCase() === 'lenaedward949@gmail.com') {
      finalRole = 'admin';
    }

    const newUser: UserProfile = {
      id: `user_${Date.now()}`,
      name,
      email,
      avatar: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(name)}`,
      role: finalRole,
      coins: finalRole === 'admin' ? 1000 : 100,
      streak: 1,
      badges: finalRole === 'admin' ? ['System Lord'] : ['New Reader'],
      lastActive: new Date().toISOString(),
      telegramId: telegramId || undefined
    };

    setCurrentUser(newUser);
    triggerBotNotification(`👤 User Login: ${name} (${finalRole}) logged into ENGIDA.`);
  };

  const logout = () => {
    setCurrentUser(null);
    setActiveStoryId(null);
    setActiveChapterId(null);
  };

  const setUserCoins = (amount: number) => {
    if (!currentUser) return;
    const updated = { ...currentUser, coins: amount };
    setCurrentUser(updated);
  };

  // Trigger Mock Telegram Bot Notification (using fetch or console log fallback)
  const triggerBotNotification = (message: string) => {
    console.log(`[ENGIDA BOT NOTIFICATION]: ${message}`);
    // If real bot token were active, we could dispatch to telegram via API
  };

  // Story Creation
  const createStory = (title: string, desc: string, cover: string, genres: string[], authorId: string, authorName: string) => {
    const newStory: Story = {
      id: `story_${Date.now()}`,
      title,
      coverImage: cover || 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=500',
      description: desc,
      descriptionAmh: desc,
      genres,
      authorId,
      authorName,
      status: 'ongoing',
      views: 0,
      likes: 0,
      bookmarksCount: 0,
      unlockCount: 0,
      isApproved: false, // requires admin approval
      isFeatured: false,
      createdAt: new Date().toISOString()
    };

    setStories(prev => [newStory, ...prev]);
    
    // Notify Admin
    setNotifications(prev => [
      {
        id: `not_${Date.now()}`,
        userId: 'user_admin',
        title: 'New Story Submitted',
        message: `${authorName} submitted a new story: "${title}" for approval.`,
        type: 'chapter',
        read: false,
        createdAt: new Date().toISOString()
      },
      ...prev
    ]);

    triggerBotNotification(`📚 New Story Submitted: "${title}" by ${authorName}. Needs Admin approval.`);
    return newStory;
  };

  const updateStory = (storyId: string, updates: Partial<Story>) => {
    setStories(prev => prev.map(s => s.id === storyId ? { ...s, ...updates } : s));
  };

  const deleteStory = (storyId: string) => {
    setStories(prev => prev.filter(s => s.id !== storyId));
    setChapters(prev => prev.filter(c => c.storyId !== storyId));
    setBookmarks(prev => prev.filter(id => id !== storyId));
    setLikedStories(prev => prev.filter(id => id !== storyId));
    setUnlockTransactions(prev => prev.filter(ut => ut.storyId !== storyId));
    setComments(prev => prev.filter(c => c.storyId !== storyId));
    triggerBotNotification(`🚨 Story deleted: ${storyId}`);
  };

  // Create Chapter
  const createChapter = (storyId: string, title: string, content: string, requestLock: boolean, coinPrice: number) => {
    const parentStory = stories.find(s => s.id === storyId);
    if (!parentStory) {
      throw new Error("Story not found");
    }

    const storyChapters = chapters.filter(c => c.storyId === storyId);
    const nextNum = storyChapters.length + 1;

    const newChapter: Chapter = {
      id: `chap_${Date.now()}`,
      storyId,
      chapterNumber: nextNum,
      title,
      content,
      isLocked: false, // Only admin can approve standard locks, but we store request
      requestedPremiumLock: requestLock,
      coinPrice: requestLock ? coinPrice : 0,
      views: 0,
      likes: 0,
      createdAt: new Date().toISOString()
    };

    setChapters(prev => [...prev, newChapter]);

    // Send Admin lock request if requested
    if (requestLock) {
      const lockReq: PremiumLockRequest = {
        id: `lock_req_${Date.now()}`,
        writerId: parentStory.authorId,
        storyId,
        storyTitle: parentStory.title,
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      setPremiumRequests(prev => [lockReq, ...prev]);
      triggerBotNotification(`🔐 Lock Request: "${parentStory.authorName}" requested a lock on high premium chapters for "${parentStory.title}".`);
    }

    // Trigger normal reader notifications if already approved story
    if (parentStory.isApproved) {
      // Find followers
      // Simulated: distribute notification
      triggerBotNotification(`📢 New Chapter Published: Chapter ${nextNum} of "${parentStory.title}" is out!`);
    }

    return newChapter;
  };

  const editChapter = (chapterId: string, title: string, content: string, isLocked: boolean, coinPrice: number) => {
    setChapters(prev => prev.map(c => c.id === chapterId ? { ...c, title, content, isLocked, coinPrice } : c));
  };

  // Add Comment
  const addComment = (chapterId: string, storyId: string, content: string) => {
    if (!currentUser) return;
    const newComment: Comment = {
      id: `comm_${Date.now()}`,
      chapterId,
      storyId,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      content,
      createdAt: new Date().toISOString()
    };
    setComments(prev => [newComment, ...prev]);
  };

  // Like / Bookmark Interactions
  const toggleLikeStory = (storyId: string) => {
    if (!currentUser) return;
    const isLiked = likedStories.includes(storyId);
    if (isLiked) {
      setLikedStories(prev => prev.filter(id => id !== storyId));
      setStories(prev => prev.map(s => s.id === storyId ? { ...s, likes: Math.max(0, s.likes - 1) } : s));
    } else {
      setLikedStories(prev => [...prev, storyId]);
      setStories(prev => prev.map(s => s.id === storyId ? { ...s, likes: s.likes + 1 } : s));
    }
  };

  const toggleLikeChapter = (chapterId: string) => {
    if (!currentUser) return;
    const isLiked = likedChapters.includes(chapterId);
    if (isLiked) {
      setLikedChapters(prev => prev.filter(id => id !== chapterId));
      setChapters(prev => prev.map(c => c.id === chapterId ? { ...c, likes: Math.max(0, c.likes - 1) } : c));
    } else {
      setLikedChapters(prev => [...prev, chapterId]);
      setChapters(prev => prev.map(c => c.id === chapterId ? { ...c, likes: c.likes + 1 } : c));
    }
  };

  const toggleBookmark = (storyId: string) => {
    if (!currentUser) return;
    const isBookmarked = bookmarks.includes(storyId);
    if (isBookmarked) {
      setBookmarks(prev => prev.filter(id => id !== storyId));
      setStories(prev => prev.map(s => s.id === storyId ? { ...s, bookmarksCount: Math.max(0, s.bookmarksCount - 1) } : s));
    } else {
      setBookmarks(prev => [...prev, storyId]);
      setStories(prev => prev.map(s => s.id === storyId ? { ...s, bookmarksCount: s.bookmarksCount + 1 } : s));
    }
  };

  const toggleFollow = (writerId: string) => {
    if (!currentUser) return;
    const isFollowed = followedWriters.includes(writerId);
    if (isFollowed) {
      setFollowedWriters(prev => prev.filter(id => id !== writerId));
    } else {
      setFollowedWriters(prev => [...prev, writerId]);
    }
  };

  // Submit Coin Manual Telebirr Purchase
  const submitCoinPurchase = (coinAmount: number, birrAmount: number, refId: string, telebirrNo: string, simulatedFile?: string, type: 'coins' | 'subscription' = 'coins') => {
    if (!currentUser) return;
    const newTx: CoinTransaction = {
      id: `tx_${Date.now()}`,
      userId: currentUser.id,
      coinAmount,
      birrAmount,
      referenceId: refId,
      telebirrNumber: telebirrNo,
      screenshotUrl: simulatedFile || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=200',
      status: 'pending',
      type,
      createdAt: new Date().toISOString()
    };

    setCoinTransactions(prev => [newTx, ...prev]);

    // Admin incoming notification
    setNotifications(prev => [
      {
        id: `not_${Date.now()}`,
        userId: 'user_admin',
        title: type === 'subscription' ? 'New Premium subscription' : 'New Telebirr Deposit',
        message: type === 'subscription' 
          ? `${currentUser.name} requested approval for 1-month Premium. Ref: ${refId}`
          : `${currentUser.name} requested approval for ${coinAmount} coins. Ref: ${refId}`,
        type: 'payment',
        read: false,
        createdAt: new Date().toISOString()
      },
      ...prev
    ]);

    triggerBotNotification(
      type === 'subscription'
        ? `👑 Premium Subscription: ${currentUser.name} submitted deposit of ${birrAmount} ETB (monthly subscription). Ref: ${refId}. Review receipt.`
        : `💸 Telebirr Purchase Request: ${currentUser.name} submitted deposit for ${coinAmount} coins. Ref: ${refId}. Waiting review.`
    );
  };

  // Unlock Chapter using Coins
  const unlockChapter = (chapterId: string): boolean => {
    if (!currentUser) return false;
    const targetChapter = chapters.find(c => c.id === chapterId);
    if (!targetChapter) return false;

    const parentStory = stories.find(s => s.id === targetChapter.storyId);
    if (!parentStory) return false;

    // Admins do NOT pay for unlocking premium or standard content!
    const isAdminUser = currentUser.role === 'admin';
    const unlockedAlready = unlockTransactions.some(ut => ut.readerId === currentUser.id && ut.chapterId === chapterId);
    
    if (unlockedAlready || isAdminUser) return true;

    // Check coin amount
    const price = targetChapter.coinPrice || 10;
    if (currentUser.coins < price) {
      return false; // Insufficient coins
    }

    // Deduct coins from reader
    const updatedCoins = currentUser.coins - price;
    setCurrentUser({ ...currentUser, coins: updatedCoins });

    // Deduct and log transaction inside DB
    const writerId = parentStory.authorId;
    const writerShare = Math.floor(price * 0.6); // 60% writer share
    const platformShare = price - writerShare; // 40% platform share

    const newUnlock: UnlockTransaction = {
      id: `un_${Date.now()}`,
      readerId: currentUser.id,
      writerId,
      chapterId,
      storyId: parentStory.id,
      amount: price,
      writerShare,
      platformShare,
      createdAt: new Date().toISOString()
    };

    setUnlockTransactions(prev => [newUnlock, ...prev]);
    
    // Increment story unlock counter & views
    setStories(prev => prev.map(s => s.id === parentStory.id ? { ...s, unlockCount: s.unlockCount + 1, views: s.views + 1 } : s));
    setChapters(prev => prev.map(c => c.id === chapterId ? { ...c, views: c.views + 1 } : c));

    // Send notification to author
    setNotifications(prev => [
      {
        id: `not_${Date.now()}`,
        userId: writerId,
        title: 'Chapter Unlocked',
        message: `A reader unlocked a chapter in your story "${parentStory.title}". You earned ${writerShare} coin shares!`,
        type: 'payout',
        read: false,
        createdAt: new Date().toISOString()
      },
      ...prev
    ]);

    return true;
  };

  // Submit Monetization Application
  const submitMonetizationRequest = (fullName: string, phone: string, email: string, telebirrNo: string) => {
    if (!currentUser) return;
    const newReq: MonetizationRequest = {
      id: `mon_req_${Date.now()}`,
      writerId: currentUser.id,
      fullName,
      phoneNumber: phone,
      email,
      telebirrNumber: telebirrNo,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    setMonetizationRequests(prev => [newReq, ...prev]);

    // Admin notification
    setNotifications(prev => [
      {
        id: `not_${Date.now()}`,
        userId: 'user_admin',
        title: 'New Monetization Request',
        message: `${fullName} requested creator monetization approval.`,
        type: 'monetization',
        read: false,
        createdAt: new Date().toISOString()
      },
      ...prev
    ]);

    triggerBotNotification(`👑 Monetization Request: "${fullName}" is applying for Creator Status.`);
  };

  // Submit Premium stories approval request (Locks)
  const submitPremiumRequest = (storyId: string) => {
    const story = stories.find(s => s.id === storyId);
    if (!story) return;

    const newReq: PremiumLockRequest = {
      id: `prem_req_${Date.now()}`,
      writerId: story.authorId,
      storyId,
      storyTitle: story.title,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    setPremiumRequests(prev => [newReq, ...prev]);
    triggerBotNotification(`🔒 Premium Request: "${story.authorName}" requested a lock approval for "${story.title}".`);
  };

  // ADMIN OPERATIONS

  // Approve Manual Coin / Subscription payments
  const adminApproveCoinPurchase = (txId: string) => {
    const tx = coinTransactions.find(t => t.id === txId);
    if (!tx || tx.status !== 'pending') return;

    setCoinTransactions(prev => prev.map(t => t.id === txId ? { ...t, status: 'approved' } : t));

    const isSub = tx.type === 'subscription';

    if (isSub) {
      const subscriptionDueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
      if (currentUser && currentUser.id === tx.userId) {
        setCurrentUser({ ...currentUser, hasSubscription: true, subscriptionDueDate });
      } else {
        const usersRaw = localStorage.getItem('engida_users') || JSON.stringify(INITIAL_USERS);
        const parsedUsers: UserProfile[] = JSON.parse(usersRaw);
        const ind = parsedUsers.findIndex(u => u.id === tx.userId);
        if (ind !== -1) {
          parsedUsers[ind].hasSubscription = true;
          parsedUsers[ind].subscriptionDueDate = subscriptionDueDate;
          localStorage.setItem('engida_users', JSON.stringify(parsedUsers));
        }
      }

      setNotifications(prev => [
        {
          id: `not_${Date.now()}`,
          userId: tx.userId,
          title: 'Premium Subscription Active! 👑',
          message: `Your 1-Month Premium Subscription of 489 ETB was approved! You can now access all premium books and locked chapters.`,
          type: 'payment',
          read: false,
          createdAt: new Date().toISOString()
        },
        ...prev
      ]);

      triggerBotNotification(`👑 Premium Subscription Approved: User ${tx.userId} is now Premium. Ref: ${tx.referenceId}.`);
    } else {
      // Credit coins to the target user
      // If the target user is currently logged in, update app state
      if (currentUser && currentUser.id === tx.userId) {
        setCurrentUser({ ...currentUser, coins: currentUser.coins + tx.coinAmount });
      } else {
        // Direct local storage update fallback for simulated users
        const usersRaw = localStorage.getItem('engida_users') || JSON.stringify(INITIAL_USERS);
        const parsedUsers: UserProfile[] = JSON.parse(usersRaw);
        const ind = parsedUsers.findIndex(u => u.id === tx.userId);
        if (ind !== -1) {
          parsedUsers[ind].coins += tx.coinAmount;
          localStorage.setItem('engida_users', JSON.stringify(parsedUsers));
        }
      }

      // Send notifications to the user
      setNotifications(prev => [
        {
          id: `not_${Date.now()}`,
          userId: tx.userId,
          title: 'Coins Approved! 🪙',
          message: `Your deposit of Bro ${tx.birrAmount} was approved! ${tx.coinAmount} coins have been added to your wallet.`,
          type: 'payment',
          read: false,
          createdAt: new Date().toISOString()
        },
        ...prev
      ]);

      triggerBotNotification(`✅ Coins Credited: Approved ${tx.coinAmount} coins to user ${tx.userId}. Ref: ${tx.referenceId}.`);
    }
  };

  // Reject manual coin payments
  const adminRejectCoinPurchase = (txId: string) => {
    const tx = coinTransactions.find(t => t.id === txId);
    if (!tx || tx.status !== 'pending') return;

    setCoinTransactions(prev => prev.map(t => t.id === txId ? { ...t, status: 'rejected' } : t));

    setNotifications(prev => [
      {
        id: `not_${Date.now()}`,
        userId: tx.userId,
        title: 'Deposit Rejected ❌',
        message: `Your Telebirr deposit reference ID ${tx.referenceId} was rejected. Please contact support.`,
        type: 'payment',
        read: false,
        createdAt: new Date().toISOString()
      },
      ...prev
    ]);
  };

  // Approve Creator monetization applications
  const adminApproveMonetization = (reqId: string) => {
    const req = monetizationRequests.find(r => r.id === reqId);
    if (!req) return;

    setMonetizationRequests(prev => prev.map(r => r.id === reqId ? { ...r, status: 'approved' } : r));

    // Update creator details in profile
    if (currentUser && currentUser.id === req.writerId) {
      setCurrentUser({ ...currentUser, telebirrNumber: req.telebirrNumber });
    }

    setNotifications(prev => [
      {
        id: `not_${Date.now()}`,
        userId: req.writerId,
        title: 'Monetization Approved! 🎉',
        message: 'Congratulations! Your monetization request was approved. You are now a verified ENGIDA creator and can begin locking premium content.',
        type: 'monetization',
        read: false,
        createdAt: new Date().toISOString()
      },
      ...prev
    ]);

    triggerBotNotification(`👑 Creator Approved: "${req.fullName}" has been approved for writing revenues.`);
  };

  // Reject creator monetization applications
  const adminRejectMonetization = (reqId: string) => {
    const req = monetizationRequests.find(r => r.id === reqId);
    if (!req) return;

    setMonetizationRequests(prev => prev.map(r => r.id === reqId ? { ...r, status: 'rejected' } : r));

    setNotifications(prev => [
      {
        id: `not_${Date.now()}`,
        userId: req.writerId,
        title: 'Monetization Rejected ❌',
        message: 'Your monetization application was rejected. Please ensure your stories strictly fulfill content guidelines.',
        type: 'monetization',
        read: false,
        createdAt: new Date().toISOString()
      },
      ...prev
    ]);
  };

  // Suspend monetization
  const adminSuspendMonetization = (reqId: string) => {
    const req = monetizationRequests.find(r => r.id === reqId);
    if (!req) return;

    setMonetizationRequests(prev => prev.map(r => r.id === reqId ? { ...r, status: 'suspended' } : r));

    setNotifications(prev => [
      {
        id: `not_${Date.now()}`,
        userId: req.writerId,
        title: 'Monetization Suspended ⚠️',
        message: 'Your monetization rights have been suspended due to policy violations, plagiarized content, or suspected engagement spoofing.',
        type: 'monetization',
        read: false,
        createdAt: new Date().toISOString()
      },
      ...prev
    ]);
  };

  // Approve chapter lock requests
  const adminApprovePremium = (reqId: string) => {
    const req = premiumRequests.find(r => r.id === reqId);
    if (!req) return;

    setPremiumRequests(prev => prev.map(r => r.id === reqId ? { ...r, status: 'approved' } : r));

    // Actually lock the stories chapters that were flagged as premium requested!
    setChapters(prev => prev.map(ch => {
      if (ch.storyId === req.storyId && ch.requestedPremiumLock) {
        return { ...ch, isLocked: true, coinPrice: ch.coinPrice || 10 };
      }
      return ch;
    }));

    setNotifications(prev => [
      {
        id: `not_${Date.now()}`,
        userId: req.writerId,
        title: 'Premium Locks Approved! 🔒',
        message: `Your requested locks for "${req.storyTitle}" have been activated. Readers will now pay coins to unlock chapters.`,
        type: 'payout',
        read: false,
        createdAt: new Date().toISOString()
      },
      ...prev
    ]);
  };

  // Reject chapter lock requests
  const adminRejectPremium = (reqId: string) => {
    const req = premiumRequests.find(r => r.id === reqId);
    if (!req) return;

    setPremiumRequests(prev => prev.map(r => r.id === reqId ? { ...r, status: 'rejected' } : r));
  };

  // Process manual payouts to writers (Telebirr balance adjustments)
  const adminProcessPayout = (writerId: string, amount: number, status: 'pending' | 'paid' | 'rejected', notes?: string) => {
    // Generate new payout record
    const targetReq = monetizationRequests.find(mr => mr.writerId === writerId && mr.status === 'approved');
    const tel = targetReq ? targetReq.telebirrNumber : '0911001122';

    const newPayout: PayoutRecord = {
      id: `payout_${Date.now()}`,
      writerId,
      writerName: targetReq ? targetReq.fullName : 'Writer Creator',
      telebirrNumber: tel,
      amount,
      status,
      notes: notes || `Disbursed to Telebirr Wallet ${tel}`,
      createdAt: new Date().toISOString()
    };

    setPayouts(prev => [newPayout, ...prev]);

    setNotifications(prev => [
      {
        id: `not_${Date.now()}`,
        userId: writerId,
        title: status === 'paid' ? 'Telebirr Payout Sent! 💸' : 'Payout Cancelled / Rejected',
        message: status === 'paid' 
          ? `The Platform Admin has manually processed your payout of ETB ${amount} through Telebirr. Note: ${newPayout.notes}`
          : `Your payout request of ETB ${amount} was rejected. Reasons: ${notes}`,
        type: 'payout',
        read: false,
        createdAt: new Date().toISOString()
      },
      ...prev
    ]);

    triggerBotNotification(`💰 Writer Payout Settlement: Sent manual Telebirr payout of ${amount} ETB to creator ${writerId}. Status: ${status}.`);
  };

  // Moderate story: block, approve, delete, feature
  const adminModerateStory = (storyId: string, action: 'approve' | 'reject' | 'delete' | 'feature') => {
    if (action === 'delete') {
      setStories(prev => prev.filter(s => s.id !== storyId));
      setChapters(prev => prev.filter(c => c.storyId !== storyId));
      triggerBotNotification(`🚨 Admin Action: Plagiarized/spam story with ID ${storyId} deleted permanently.`);
    } else {
      setStories(prev => prev.map(s => {
        if (s.id === storyId) {
          return {
            ...s,
            isApproved: action === 'approve' ? true : action === 'reject' ? false : s.isApproved,
            isFeatured: action === 'feature' ? !s.isFeatured : s.isFeatured
          };
        }
        return s;
      }));
    }
  };

  // Change individual chapter locks manually (Admin override)
  const adminSetChapterLock = (chapterId: string, isLocked: boolean, coinPrice: number) => {
    setChapters(prev => prev.map(c => c.id === chapterId ? { ...c, isLocked, coinPrice } : c));
  };

  // Content Reporting
  const submitStoryReport = (storyId: string, reason: string, details: string) => {
    if (!currentUser) return;
    const parentStory = stories.find(s => s.id === storyId);
    if (!parentStory) return;

    const newReport: ContentReport = {
      id: `rep_${Date.now()}`,
      reporterId: currentUser.id,
      storyId,
      storyTitle: parentStory.title,
      reason,
      details,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    setReports(prev => [newReport, ...prev]);

    triggerBotNotification(`⚠️ Report Received: "${parentStory.title}" was flagged for "${reason}". Details: ${details}`);
  };

  // Resolve story report
  const adminResolveReport = (reportId: string, action: 'resolved' | 'reviewed') => {
    setReports(prev => prev.map(r => r.id === reportId ? { ...r, status: action } : r));
  };

  // Simulation support
  const simulateFraud = (type: 'rapid_skip' | 'device_repetition', details: string) => {
    if (!currentUser) return;
    const newFraud: FraudLog = {
      id: `fraud_${Date.now()}`,
      userId: currentUser.id,
      username: currentUser.name,
      type,
      details,
      createdAt: new Date().toISOString()
    };
    setFraudLogs(prev => [newFraud, ...prev]);
    triggerBotNotification(`🚨 Anti-Fraud Alert: Suspicious activity logged. User: ${currentUser.name}. Type: ${type}.`);
  };

  const simulateReadersCount = (storyId: string, increment: number) => {
    setSimulatedReaders(prev => ({
      ...prev,
      [storyId]: (prev[storyId] || 0) + increment
    }));
  };

  // Detailed financial & engagement analytics compiler for writers
  const getWriterStats = (writerId: string) => {
    // 1. Stories published
    const writerStories = stories.filter(s => s.authorId === writerId);
    const publishedCount = writerStories.length;

    // 2. Chapters published
    const storyIds = writerStories.map(s => s.id);
    const writerChapters = chapters.filter(c => storyIds.includes(c.storyId));
    const chaptersCount = writerChapters.length;

    // 3. Readers count (real and simulated)
    const qualifiedCount = writerStories.reduce((acc, s) => acc + (simulatedReaders[s.id] || 0), 0);

    // 4. Reads view accumulator
    const readsTotal = writerStories.reduce((acc, s) => acc + s.views, 0);

    // 5. Total likes accumulator
    const likesTotal = writerStories.reduce((acc, s) => acc + s.likes, 0);

    // 6. Followers count
    // Count how many people follow the writer
    const folCount = followedWriters.filter(id => id === writerId).length + (writerId === 'writer_abera' ? 240 : 45);

    // 7. Calculate Coin Share Revenues (60% writer, 40% platform)
    const writerUnlocks = unlockTransactions.filter(ut => ut.writerId === writerId);
    const unlockRevenues = writerUnlocks.reduce((acc, ut) => acc + ut.writerShare, 0);

    // Calculate premium subscriber reads (40% of total qualified reads are premium subscribers)
    const premiumReadsCount = Math.floor(qualifiedCount * 0.4) + (writerId === 'writer_abera' ? 122 : 18);
    const premiumRevenues = premiumReadsCount * 6; // 60% writer share of 10 Br value per premium read = 6 Br

    // Pending vs Withdrawable balance logic:
    // "Pending earnings mature after 7 days before becoming withdrawable."
    // Let's divide based on unlock Transaction timestamps (unlocked within past 7 days are pending)
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    
    let pendingBalance = 0;
    let withdrawableBalance = 0;

    writerUnlocks.forEach(ut => {
      const txTime = new Date(ut.createdAt).getTime();
      if (txTime > sevenDaysAgo) {
        pendingBalance += ut.writerShare;
      } else {
        withdrawableBalance += ut.writerShare;
      }
    });

    // Subsidize abera dynamic mockup balance to make dashboard look fantastic
    if (writerId === 'writer_abera') {
      withdrawableBalance += 84; 
      pendingBalance += 24;
    }

    const totalEarned = withdrawableBalance + premiumRevenues;
    const platformShare = Math.floor((withdrawableBalance / 0.6) * 0.4) + (premiumReadsCount * 4); // 40% platform share

    // 8. Paid balances
    const writerPayouts = payouts.filter(p => p.writerId === writerId);
    const paidBalance = writerPayouts.filter(p => p.status === 'paid').reduce((acc, p) => acc + p.amount, 0);

    const dueAmount = Math.max(0, totalEarned - paidBalance);

    // Minimum criteria checklist values
    const avgRead = 4.3; // minutes (Simulated)
    const ageDays = writerId === 'writer_abera' ? 45 : 12; // Days old

    return {
      reads: readsTotal + (writerId === 'writer_abera' ? 1410 : 250),
      likes: likesTotal,
      followers: folCount,
      pendingBalance,
      withdrawableBalance,
      totalEarned,
      coinEarned: withdrawableBalance,
      premiumEarned: premiumRevenues,
      premiumReadsCount,
      platformShare,
      dueAmount,
      paidBalance,
      payoutHistory: writerPayouts,
      unlockedChaptersCount: writerUnlocks.length,
      storiesPublished: publishedCount,
      chaptersPublished: chaptersCount,
      qualifiedReadersCount: qualifiedCount,
      avgReadDuration: avgRead,
      accountAgeDays: ageDays
    };
  };

  const clearAllState = () => {
    localStorage.clear();
    setStories(INITIAL_STORIES);
    setChapters(INITIAL_CHAPTERS);
    setComments(INITIAL_COMMENTS);
    setCoinTransactions([]);
    setUnlockTransactions([]);
    setMonetizationRequests([]);
    setPremiumRequests([]);
    setPayouts([]);
    setNotifications([]);
    setReports([]);
    setFraudLogs([]);
    setBookmarks([]);
    setLikedStories([]);
    setLikedChapters([]);
    setFollowedWriters([]);
    setSimulatedReaders({ story_1: 520, story_2: 120, story_3: 40 });
    
    // reset current logged-in user
    setCurrentUser({
      id: 'user_admin',
      name: 'Lena Edward (Admin)',
      email: 'lenaedward949@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      role: 'admin',
      coins: 1250,
      streak: 15,
      badges: ['Ethio Literature Patron', 'Super Reader', 'App Architect'],
      lastActive: new Date().toISOString()
    });
  };

  return (
    <AppContext.Provider value={{
      currentUser, currentLanguage, stories, chapters, comments, coinTransactions,
      unlockTransactions, monetizationRequests, premiumRequests, payouts, notifications,
      reports, fraudLogs, bookmarks, likedStories, likedChapters, followedWriters,
      activeStoryId, activeChapterId, telebirrMerchantNumber, telegramBotToken,
      
      setLanguage, setCurrentUser, changeUserRole, loginSimulated, logout, setUserCoins,
      createStory, updateStory, deleteStory, createChapter, editChapter, addComment,
      toggleLikeStory, toggleLikeChapter, toggleBookmark, toggleFollow,
      submitCoinPurchase, unlockChapter, submitMonetizationRequest, submitPremiumRequest,
      
      adminApproveCoinPurchase, adminRejectCoinPurchase, adminApproveMonetization,
      adminRejectMonetization, adminSuspendMonetization, adminApprovePremium, adminRejectPremium,
      adminProcessPayout, adminModerateStory, adminSetChapterLock, adminResolveReport,
      submitStoryReport, clearAllState, simulateFraud, simulateReadersCount, getWriterStats
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext must be used within an AppProvider");
  return context;
}
