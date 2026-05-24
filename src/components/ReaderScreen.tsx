import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../AppContext';
import { TRANSLATIONS } from '../translations';
import { Chapter, Story } from '../types';
import { 
  ArrowLeft, ChevronLeft, ChevronRight, Type, ThumbsUp, MessageSquare, 
  Lock, Key, Coins, Eye, Play, FastForward, ShieldAlert
} from 'lucide-react';

export default function ReaderScreen({ 
  storyId, 
  chapterNumber, 
  onBack, 
  onGotoChapter,
  onGotoWallet
}: { 
  storyId: string; 
  chapterNumber: number; 
  onBack: () => void;
  onGotoChapter: (num: number) => void;
  onGotoWallet: () => void;
}) {
  const { 
    stories, chapters, comments, addComment, unlockChapter, unlockTransactions, 
    currentUser, currentLanguage, likedChapters, toggleLikeChapter, submitStoryReport,
    simulateFraud, simulateReadersCount
  } = useAppContext();

  const t = TRANSLATIONS[currentLanguage];
  const story = stories.find(s => s.id === storyId);

  // List of all chapters for this story
  const storyChapters = chapters
    .filter(c => c.storyId === storyId)
    .sort((a, b) => a.chapterNumber - b.chapterNumber);

  // Active chapter
  const activeChapterIndex = storyChapters.findIndex(c => c.chapterNumber === chapterNumber);
  const chapter = storyChapters[activeChapterIndex];

  // UI Adjustment Settings
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg' | 'xl' | '2xl'>('lg');
  const [isLowBandwidth, setIsLowBandwidth] = useState(false);
  const [commentText, setCommentText] = useState('');

  // Chapter Unlock Dialog states
  const [unlockError, setUnlockError] = useState('');

  // Qualified Reader Timer State
  // Real check: Requires 5 minutes (300 seconds).
  // Simulated: We maintain a timer in seconds, and let them "Fast Forward" to trigger credit easily for testing.
  const [secondsRead, setSecondsRead] = useState(0);
  const [hasAwardedQualifiedRead, setHasAwardedQualifiedRead] = useState(false);
  const [fraudWarning, setFraudWarning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Anti-fraud helper: tracks rapid clicks
  const pageLoadedTime = useRef<number>(Date.now());

  // Report Form state
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('Plagiarism');
  const [reportDetail, setReportDetail] = useState('');

  useEffect(() => {
    // Reset timer on chapter swap
    setSecondsRead(0);
    setHasAwardedQualifiedRead(false);
    setFraudWarning(false);
    pageLoadedTime.current = Date.now();

    if (chapter && !chapter.isLocked) {
      timerRef.current = setInterval(() => {
        setSecondsRead(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [chapterNumber, storyId]);

  // Monitor reading duration to trigger award safely
  useEffect(() => {
    if (secondsRead >= 300 && !hasAwardedQualifiedRead && story) {
      triggerQualifiedReaderAward();
    }
  }, [secondsRead, hasAwardedQualifiedRead, story]);

  // Is unlocked logic
  const isUnlocked = () => {
    if (!chapter) return false;
    if (!chapter.isLocked) return true;
    if (!currentUser) return false;
    if (currentUser.role === 'admin') return true; // Admins get free reading access!

    // Check if subscription is active
    const isSubscriptionActive = currentUser && currentUser.hasSubscription && 
      (!currentUser.subscriptionDueDate || new Date(currentUser.subscriptionDueDate).getTime() > Date.now());
    if (isSubscriptionActive) return true;
    
    // Check if there's an unlock transaction for this chapter
    return unlockTransactions.some(
      ut => ut.readerId === currentUser.id && ut.chapterId === chapter.id
    );
  };

  const currentUnlocked = isUnlocked();

  const handleUnlock = () => {
    if (!chapter || !currentUser) return;
    setUnlockError('');

    const success = unlockChapter(chapter.id);
    if (!success) {
      setUnlockError(t.insufficientCoins);
    } else {
      // Success: Start the timer
      setSecondsRead(0);
      timerRef.current = setInterval(() => {
        setSecondsRead(prev => prev + 1);
      }, 1000);
    }
  };

  const triggerQualifiedReaderAward = () => {
    if (hasAwardedQualifiedRead || !story) return;
    setHasAwardedQualifiedRead(true);
    // Award 1 qualified read credit to writing analytics
    simulateReadersCount(story.id, 1);
  };

  // Skip chapters too fast check (Anti-fraud showcase!)
  const handleChapterNavigation = (num: number) => {
    const elapsedSeconds = (Date.now() - pageLoadedTime.current) / 1000;
    
    // If reader moves to next chapter in less than 3 seconds without unlocked or reading
    if (elapsedSeconds < 3) {
      simulateFraud(
        'rapid_skip',
        `User skipped Chapter ${chapterNumber} to Chapter ${num} in ${elapsedSeconds.toFixed(1)}s (Possible click bot)`
      );
      setFraudWarning(true);
      setTimeout(() => setFraudWarning(false), 4000);
    }

    onGotoChapter(num);
  };

  const handleFastForwardTimer = () => {
    // Let the user instantly fast forward 5 minutes to trigger qualified write credentials
    setSecondsRead(300);
    triggerQualifiedReaderAward();
  };

  const handlePostCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !chapter) return;
    addComment(chapter.id, storyId, commentText);
    setCommentText('');
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportDetail.trim()) return;
    submitStoryReport(storyId, reportReason, reportDetail);
    setShowReportModal(false);
    setReportDetail('');
    alert("Story successfully reported to administrators. It will be reviewed within 24 hours.");
  };

  if (!story || !chapter) {
    return (
      <div id="reader-error" className="p-8 text-center bg-slate-950 text-slate-100 min-h-screen flex flex-col items-center justify-center">
        <p className="text-amber-500 font-bold mb-4">Chapter not found / ምዕራፉ አልተገኘም</p>
        <button id="reader-error-back-btn" onClick={onBack} className="bg-slate-900 border border-slate-700 px-4 py-2 rounded-xl text-xs">
          Go Back
        </button>
      </div>
    );
  }

  // Comments for this chapter
  const chapterComments = comments.filter(c => c.chapterId === chapter.id);

  return (
    <div id="reader-screen-root" className="min-h-screen bg-slate-950 text-slate-100 pb-24 relative font-sans">
      
      {/* Top Reading Navigation Bar */}
      <header id="reader-header" className="bg-slate-900/90 backdrop-blur sticky top-12 z-40 border-b border-white/[0.02]">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <button 
            id="reader-back-nav" 
            onClick={onBack}
            className="p-1.5 hover:bg-slate-800 text-slate-300 rounded-lg transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="text-center max-w-[200px]">
            <h3 className="text-xs text-amber-500 font-bold tracking-wider uppercase truncate">{story.title}</h3>
            <p className="text-[11px] text-slate-400 truncate">{chapter.title}</p>
          </div>

          {/* Quick Font Sizer & Controls */}
          <div className="flex items-center gap-1.5">
            <button
              id="report-flag-btn"
              onClick={() => setShowReportModal(true)}
              className="text-[10px] bg-red-950/40 text-red-400 hover:bg-red-900/30 border-0 px-2.5 py-1 rounded transition"
            >
              Report
            </button>
            <button
              id="font-size-adjust-btn"
              onClick={() => {
                const sizes: ('sm' | 'base' | 'lg' | 'xl' | '2xl')[] = ['sm', 'base', 'lg', 'xl', '2xl'];
                const curIndex = sizes.indexOf(fontSize);
                const nextSize = sizes[(curIndex + 1) % sizes.length];
                setFontSize(nextSize);
              }}
              title="Change Text Size"
              className="p-1.5 hover:bg-slate-850 text-slate-400 hover:text-white rounded transition"
            >
              <Type className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Cyber Fraud Alert HUD */}
      {fraudWarning && (
        <div id="fraud-popup-indicator" className="bg-red-950/90 border-y border-red-500 text-red-200 text-xs py-2 px-4 shadow-lg sticky top-[98px] z-50 flex items-center gap-2.5 animate-bounce">
          <ShieldAlert className="w-4 h-4 text-red-500 shrink-0" />
          <span>
            <strong>Anti-Fraud Flag</strong>: Skipping chapters too rapidly triggers automated activity logs inside the Admin database profiles.
          </span>
        </div>
      )}

      {/* Content Canvas */}
      <main id="reader-content-canvas" className="max-w-md mx-auto px-6 pt-6">
        
        {/* Book Cover Banner in Low Bandwidth mode */}
        {!isLowBandwidth && (
          <div className="h-28 w-full rounded-2xl overflow-hidden relative mb-6 border-0 shadow-lg">
            <img 
              src={story.coverImage} 
              alt={story.title}
              className="w-full h-full object-cover blur-[2px] brightness-50"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent" />
            <div className="absolute bottom-4 left-4">
              <span className="bg-amber-500/10 text-amber-400 text-[10px] font-bold tracking-wider uppercase border border-amber-500/20 px-2 py-0.5 rounded-full mb-1 inline-block">
                {story.genres[0]}
              </span>
              <h2 className="text-lg font-bold text-white line-clamp-1">{chapter.title}</h2>
            </div>
          </div>
        )}

        {/* Low Connection optimization option */}
        <div className="bg-slate-900/25 border border-white/[0.03] p-3 rounded-xl mb-6 flex items-center justify-between shadow-sm">
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-slate-200">{t.lowBandwidth}</span>
            <span className="text-[10px] text-slate-400 max-w-[250px]">{t.lowBandwidthDesc}</span>
          </div>
          <input 
            id="low-bandwidth-toggle"
            type="checkbox"
            checked={isLowBandwidth}
            onChange={(e) => setIsLowBandwidth(e.target.checked)}
            className="w-4 h-4 text-amber-500"
          />
        </div>

        {/* Story Text Box or Locked Card overlay */}
        {currentUnlocked ? (
          <div id="active-unlocked-chapter">
            {/* Under the hood timer handles qualified reads but remains hidden from dashboard per user guidelines */}

            {/* Core Story text with font adjustments */}
            <article 
              id="story-body-text"
              className={`text-slate-200 leading-relaxed font-serif whitespace-pre-wrap break-words tracking-wide text-${fontSize}`}
            >
              {chapter.content}
            </article>

            {/* Chapter End Likes, feedback */}
            <div className="border-t border-slate-900 mt-12 pt-6 flex flex-col items-center">
              <p className="text-xs text-slate-500 mb-3 select-none">
                Finishing Chapter {chapterNumber}? Show appreciation to {story.authorName}!
              </p>
              
              <div className="flex items-center gap-3">
                <button
                  id="chapter-like-btn"
                  onClick={() => toggleLikeChapter(chapter.id)}
                  className={`flex items-center gap-2 py-2.5 px-6 rounded-full text-xs font-bold transition border ${
                    likedChapters.includes(chapter.id)
                      ? 'bg-amber-500 text-slate-950 border-amber-500'
                      : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-850'
                  }`}
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span>{chapter.likes + (likedChapters.includes(chapter.id) ? 1 : 0)} Likes</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* LOCKED CHAPTER WIDGET */
          <div id="active-locked-chapter-teaser" className="bg-slate-900/40 border border-white/[0.04] p-6 rounded-2xl text-center space-y-5 relative overflow-hidden my-6 shadow-xl">
            <div className="absolute top-0 right-0 p-1.5 bg-amber-500/10 text-amber-500 border-b border-l border-amber-500/30 text-[9px] font-bold uppercase tracking-wide">
              {t.lockedChapter}
            </div>

            <div className="w-14 h-14 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 mx-auto border border-amber-500/25">
              <Lock className="w-6 h-6 stroke-[2]" />
            </div>

            <div className="space-y-1">
              <h4 className="text-lg font-bold text-white uppercase">{t.lockedChapter}</h4>
              <p className="text-xs text-slate-400">
                {t.unlockChapterDesc.replace('{price}', String(chapter.coinPrice || 10))}
              </p>
            </div>

            {/* Short preview content of 150 characters */}
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-950 text-xs text-slate-500 italic select-none line-clamp-3 relative">
              <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-slate-900 to-transparent" />
              "{chapter.content.substring(0, 180)}..."
            </div>

            {unlockError && (
              <p className="text-xs text-red-400 font-semibold bg-red-950/20 py-1.5 px-3 rounded-lg border border-red-900/30">
                {unlockError}
              </p>
            )}

            <div className="space-y-3 pt-2">
              <button
                id="unlock-chapter-action-btn"
                onClick={handleUnlock}
                className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-3.5 px-4 rounded-xl text-sm transition shadow-lg shadow-amber-500/10 flex items-center justify-center gap-2"
              >
                <Key className="w-4 h-4" />
                {t.unlockBtn.replace('{price}', String(chapter.coinPrice || 10))}
              </button>

              <button
                id="reader-goto-wallet-btn"
                onClick={onGotoWallet}
                className="w-full bg-slate-950 hover:bg-slate-900 text-amber-400 border border-amber-500/20 text-xs py-2 px-4 rounded-lg transition"
              >
                {t.buyCoinsBtn}
              </button>
            </div>
          </div>
        )}

        {/* BOTTOM NAVIGATION: NEXT/PREV CHAPTER */}
        <div id="reader-chapter-navigation" className="flex items-center justify-between border-t border-slate-900 mt-12 pt-6">
          <button
            id="reader-prev-chapter-btn"
            disabled={activeChapterIndex === 0}
            onClick={() => handleChapterNavigation(storyChapters[activeChapterIndex - 1].chapterNumber)}
            className="flex items-center gap-1.5 bg-slate-900/40 disabled:opacity-35 disabled:hover:bg-slate-900/40 hover:bg-slate-900/80 border border-white/[0.03] p-2.5 rounded-xl text-xs font-semibold text-slate-300 transition"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Prev Chapter</span>
          </button>

          <span className="text-xs text-slate-500 font-medium font-mono">
            Chapter {chapterNumber} of {storyChapters.length}
          </span>

          <button
            id="reader-next-chapter-btn"
            disabled={activeChapterIndex === storyChapters.length - 1}
            onClick={() => handleChapterNavigation(storyChapters[activeChapterIndex + 1].chapterNumber)}
            className="flex items-center gap-1.5 bg-slate-900/40 disabled:opacity-35 disabled:hover:bg-slate-900/40 hover:bg-slate-900/80 border border-white/[0.03] p-2.5 rounded-xl text-xs font-semibold text-slate-300 transition"
          >
            <span>Next Chapter</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* CHAPTER DISCUSSION / COMMENTS DEBATES */}
        {currentUnlocked && (
          <section id="chapter-discussion-box" className="border-t border-slate-900 mt-12 pt-8">
            <h4 className="text-sm font-bold/80 text-white uppercase tracking-wider flex items-center gap-2 mb-4">
              <MessageSquare className="w-4 h-4 text-amber-500" />
              <span>{t.commentsTitle} ({chapterComments.length})</span>
            </h4>

            {/* Comment Form */}
            {currentUser ? (
              <form id="comment-add-form" onSubmit={handlePostCommentSubmit} className="flex gap-2 mb-6">
                <input
                  id="comment-input-text"
                  type="text"
                  required
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder={t.writeCommentPlaceholder}
                  className="flex-1 bg-slate-900 border border-slate-850 rounded-xl text-xs p-3 focus:outline-none focus:border-amber-500/50"
                />
                <button
                  id="comment-submit-btn"
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 rounded-xl text-xs transition"
                >
                  {t.commentBtn}
                </button>
              </form>
            ) : (
              <p className="text-xs text-slate-500 mb-6 italic">Please log in to participate in story debates.</p>
            )}

            {/* Comments Stream */}
            <div className="space-y-4">
              {chapterComments.length === 0 ? (
                <p id="no-comments-prompt" className="text-xs text-slate-500 text-center py-4 italic">
                  No discussions yet. Be the first to express your thoughts!
                </p>
              ) : (
                chapterComments.map(c => (
                  <div key={c.id} className="bg-slate-900/30 border border-white/[0.02] p-3.5 rounded-xl space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img 
                          src={c.userAvatar || 'https://api.dicebear.com/7.x/pixel-art/svg?seed=engida'} 
                          alt="avatar" 
                          className="w-5 h-5 rounded-full"
                          referrerPolicy="no-referrer"
                        />
                        <span className="text-xs font-bold text-slate-300">{c.userName}</span>
                      </div>
                      <span className="text-[10px] text-slate-600 font-mono">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 pl-7 leading-relaxed">{c.content}</p>
                  </div>
                ))
              )}
            </div>
          </section>
        )}
      </main>

      {/* STORY VIOLATION FLAG / REPORT MODAL */}
      {showReportModal && (
        <div id="story-report-modal" className="fixed inset-0 bg-black/80 flex items-center justify-center p-6 z-[999] backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-850 p-6 rounded-2xl w-full max-w-sm space-y-4">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2 uppercase">
              <ShieldAlert className="w-5 h-5 text-red-500" />
              <span>{t.reportStoryBtn}</span>
            </h3>

            <form onSubmit={handleReportSubmit} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase">
                  {t.reportReason}
                </label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-xs p-3 rounded-lg focus:outline-none focus:border-red-500"
                >
                  <option value="Plagiarism">Plagiarism (የቅጅ መብት ጥሰት)</option>
                  <option value="AI Assisted Mass Generated">AI-Generated Spam Content</option>
                  <option value="Harassment or Violence">Harassment or Offensive language</option>
                  <option value="Inappropriate Content">Inappropriate themes</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase">
                  {t.reportDetails}
                </label>
                <textarea
                  required
                  rows={3}
                  value={reportDetail}
                  onChange={(e) => setReportDetail(e.target.value)}
                  placeholder="Explain exactly why this story violates guidelines..."
                  className="w-full bg-slate-950 border border-slate-800 text-xs p-3 rounded-lg focus:outline-none focus:border-red-500 text-slate-100"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  id="report-modal-cancel"
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="flex-1 bg-slate-800 hover:bg-slate-750 text-slate-300 py-2.5 rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  id="report-modal-submit"
                  type="submit"
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-lg text-xs font-semibold"
                >
                  {t.reportSubmit}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
