import React, { useState } from 'react';
import { AppProvider, useAppContext } from './AppContext';
import { TRANSLATIONS } from './translations';
import { GENRE_LIST } from './data';
import SplashOnboarding from './components/SplashOnboarding';
import RoleSelectionHud from './components/RoleSelectionHud';
import ReaderScreen from './components/ReaderScreen';
import CoinWallet from './components/CoinWallet';
import WriterDashboard from './components/WriterDashboard';
import AdminDashboard from './components/AdminDashboard';
import { 
  BookOpen, Coins, Bell, User, Search, Flame, Bookmark, ArrowRight, 
  Sparkles, Award, Globe, LogOut, Check, PenTool, ShieldAlert, Trash, Camera
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const getGenreStyle = (genre: string, isActive: boolean) => {
  if (isActive) {
    return 'bg-amber-500 text-slate-950 font-black border-transparent shadow shadow-amber-500/15';
  }
  switch (genre.toLowerCase()) {
    case 'romance':
      return 'bg-pink-950/25 text-pink-400 hover:bg-pink-950/45 border border-pink-500/10';
    case 'dark romance':
      return 'bg-fuchsia-950/25 text-fuchsia-400 hover:bg-fuchsia-950/45 border border-fuchsia-500/10';
    case 'thriller':
      return 'bg-red-950/25 text-red-400 hover:bg-red-950/45 border border-red-500/10';
    case 'mystery':
      return 'bg-indigo-950/25 text-indigo-400 hover:bg-indigo-950/45 border border-indigo-500/10';
    case 'comedy':
      return 'bg-yellow-950/25 text-yellow-400 hover:bg-yellow-950/45 border border-yellow-500/10';
    case 'spiritual':
      return 'bg-teal-950/25 text-teal-400 hover:bg-teal-950/45 border border-teal-500/10';
    case 'horror':
    case 'scary stories':
      return 'bg-slate-900 text-slate-400 hover:bg-slate-850 border border-slate-800';
    case 'adventure':
      return 'bg-emerald-950/25 text-emerald-400 hover:bg-emerald-950/45 border border-emerald-500/10';
    case 'historical':
      return 'bg-amber-950/20 text-amber-500 hover:bg-amber-950/35 border border-amber-500/10';
    case 'drama':
      return 'bg-violet-950/25 text-violet-400 hover:bg-violet-950/45 border border-violet-500/10';
    case 'fantasy':
      return 'bg-cyan-950/25 text-cyan-400 hover:bg-cyan-950/45 border border-cyan-500/10';
    case 'poet':
      return 'bg-sky-950/25 text-sky-400 hover:bg-sky-950/45 border border-sky-500/10';
    default:
      return 'bg-slate-900 border border-slate-800 text-slate-400 hover:bg-slate-850';
  }
};

function AppContent() {
  const { 
    currentUser, currentLanguage, setLanguage, logout, stories, chapters,
    bookmarks, toggleBookmark, notifications, activeStoryId, activeChapterId, deleteStory,
    setCurrentUser
  } = useAppContext();

  const t = TRANSLATIONS[currentLanguage];

  // Core navigation state
  const [activeScreen, setActiveScreen] = useState<'home' | 'wallet' | 'writer' | 'admin' | 'notifications' | 'profile'>('home');
  const [selectedStoryId, setSelectedStoryId] = useState<string | null>(null);
  const [selectedChapterNum, setSelectedChapterNum] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeGenre, setActiveGenre] = useState<string | null>(null);

  // Continuing reading state
  const [lastReadStoryId, setLastReadStoryId] = useState<string>('story_1');
  const [lastReadChapterNum, setLastReadChapterNum] = useState<number>(1);

  if (!currentUser) {
    return <SplashOnboarding onComplete={() => setActiveScreen('home')} />;
  }

  // Story details modal or overlay
  const handleViewStoryDetail = (storyId: string) => {
    setSelectedStoryId(storyId);
    setSelectedChapterNum(1); // Default to Chapter 1
  };

  const handleStartReading = (storyId: string) => {
    setSelectedStoryId(storyId);
    setLastReadStoryId(storyId);
    // Find first chapter number
    const storyChaps = chapters.filter(c => c.storyId === storyId).sort((a,b) => a.chapterNumber - b.chapterNumber);
    const startNum = storyChaps.length > 0 ? storyChaps[0].chapterNumber : 1;
    setSelectedChapterNum(startNum);
    setLastReadChapterNum(startNum);
    setActiveScreen('home'); // or keep state in active reader screen
  };

  // Filter stories based on query + genre + approved is true (or admin owns)
  const filteredStories = stories.filter(story => {
    // Admin sees everything! Users see approved stories or their own
    const hasPrivilege = currentUser.role === 'admin' || story.isApproved || story.authorId === currentUser.id;
    if (!hasPrivilege) return false;

    const matchesSearch = story.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          story.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          story.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesGenre = activeGenre ? story.genres.includes(activeGenre) : true;

    return matchesSearch && matchesGenre;
  });

  const featuredStory = stories.find(s => s.isFeatured && s.isApproved) || stories[0];
  const trendingStories = stories.filter(s => s.isApproved && s.id !== (featuredStory?.id || ''));
  const newArrivalStories = [...stories].reverse().filter(s => s.isApproved);

  // Calculate continue reading details based on lastReadStoryId
  const continueStory = stories.find(s => s.id === lastReadStoryId) || stories[0];
  const continueChapters = chapters.filter(c => c.storyId === continueStory?.id).sort((a,b) => a.chapterNumber - b.chapterNumber);
  const totalChaptersCount = continueChapters.length || 5;
  const currentChapterIndex = continueChapters.findIndex(c => c.chapterNumber === lastReadChapterNum) + 1 || 1;
  const continueProgressPercent = Math.min(100, Math.round((currentChapterIndex / totalChaptersCount) * 100)) || 20;

  // If reading chapter
  const isReadingActive = selectedStoryId && selectedChapterNum > 0;

  const handleBackFromReader = () => {
    setSelectedStoryId(null);
  };

  return (
    <div id="engida-app-shell" className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none pb-22">
      
      {/* Dynamic Header Hud Swap */}
      <RoleSelectionHud />

      {/* Primary header panel */}
      {!isReadingActive && (
        <header id="app-primary-header" className="bg-slate-950 border-b border-white/[0.01] px-4 pt-5 pb-3 sticky top-[45px] z-30">
          <div className="max-w-md mx-auto flex items-end justify-between">
            
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight text-amber-500 uppercase">
                ENGIDA
              </span>
              <span className="text-[10px] text-slate-400 font-medium tracking-wide mt-0.5">
                {currentLanguage === 'amh' ? 'እንግዳ · የታሪክ ዓለም' : 'Engida · World of Stories'}
              </span>
            </div>

            {/* Quick Balance indicator, Language, Notification Bell */}
            <div className="flex items-center gap-2.5 bg-slate-950">
              <button
                id="quick-wallet-trigger"
                onClick={() => setActiveScreen('wallet')}
                className="bg-amber-500/10 text-amber-400 px-3 py-1 rounded-full text-[11px] font-black flex items-center gap-1 hover:bg-amber-500/20 transition cursor-pointer"
              >
                <Coins className="w-3 h-3" />
                <span>{currentUser.coins} 🪙</span>
              </button>

              <button
                id="header-lang-toggle"
                onClick={() => setLanguage(currentLanguage === 'amh' ? 'eng' : 'amh')}
                className="p-1 hover:bg-slate-900 rounded text-xs font-bold text-amber-400 transition"
              >
                {currentLanguage === 'amh' ? 'EN' : 'አማ'}
              </button>

              <button
                id="header-notification-bell"
                onClick={() => setActiveScreen('notifications')}
                className="relative p-1.5 hover:bg-slate-900 rounded-full text-slate-300 transition"
              >
                <Bell className="w-5 h-5 text-slate-300" />
                {notifications.length > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-amber-500 rounded-full animate-ping" />
                )}
              </button>
            </div>

          </div>
        </header>
      )}

      {/* CORE SCREENS DISPATCHER */}
      <AnimatePresence mode="wait">
        {isReadingActive ? (
          /* IMERSIVE READER SCREEN */
          <motion.div
            key="reader"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <ReaderScreen
              storyId={selectedStoryId!}
              chapterNumber={selectedChapterNum}
              onBack={handleBackFromReader}
              onGotoChapter={(num) => setSelectedChapterNum(num)}
              onGotoWallet={() => {
                handleBackFromReader();
                setActiveScreen('wallet');
              }}
            />
          </motion.div>
        ) : (
          <div className="flex-1">
            {activeScreen === 'home' && (
              <motion.div 
                id="home-screen-canvas" 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="max-w-md mx-auto px-4 py-3 space-y-6"
              >
                
                {/* Featured Story slide panel */}
                {!activeGenre && !searchQuery && featuredStory && (
                  <div 
                    id="featured-story-banner"
                    onClick={() => handleStartReading(featuredStory.id)}
                    className="relative rounded-3xl overflow-hidden aspect-[16/9] w-full shadow-2xl border border-white/[0.01] cursor-pointer group hover:border-white/[0.06] transition duration-300"
                  >
                    <img 
                      src={featuredStory.coverImage} 
                      alt={featuredStory.title} 
                      className="absolute inset-0 w-full h-full object-cover transition duration-500 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Dark gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-slate-950/70" />
                    
                    {/* Top left badge */}
                    <div className="absolute top-3 left-3 bg-amber-500 text-slate-950 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md">
                      ★ {currentLanguage === 'amh' ? 'ተለይቶ የቀረበ' : 'FEATURED'}
                    </div>

                    {/* Book Metadata & text */}
                    <div className="absolute bottom-4 inset-x-4 space-y-1">
                      <h4 className="text-lg font-extrabold text-white leading-tight drop-shadow-md">
                        {featuredStory.title}
                      </h4>
                      <p className="text-[11px] text-amber-450 font-bold tracking-wide uppercase">
                        {currentLanguage === 'amh' ? `በ ${featuredStory.authorName}` : `by ${featuredStory.authorName}`}
                      </p>
                      
                      {/* Interactive Stats line */}
                      <div className="flex items-center gap-3 pt-0.5 text-[10px] text-slate-300 font-mono">
                        <span>👁️ {featuredStory.views.toLocaleString()}</span>
                        <span>❤️ {featuredStory.likes.toLocaleString()}</span>
                        <span>📖 {totalChaptersCount} {currentLanguage === 'amh' ? 'ምዕራፎች' : 'chaps'}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Continue Reading section ("ማንበብ ይቀጥሉ") */}
                {!activeGenre && !searchQuery && continueStory && (
                  <div className="space-y-2">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
                      {currentLanguage === 'amh' ? 'ማንበብ ይቀጥሉ' : 'Continue Reading'}
                    </h3>
                    
                    <div 
                      id={`continue-reading-${continueStory.id}`}
                      onClick={() => handleStartReading(continueStory.id)}
                      className="bg-slate-900/40 border border-white/[0.03] p-3 rounded-2xl flex items-center justify-between gap-4 hover:bg-slate-900/80 transition duration-200 cursor-pointer shadow-md"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <img 
                          src={continueStory.coverImage} 
                          alt={continueStory.title} 
                          className="w-10 h-10 rounded-full object-cover shrink-0 shadow-inner border border-white/10"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1 min-w-0 space-y-1">
                          <h4 className="font-bold text-xs text-slate-100 truncate leading-none">
                            {continueStory.title}
                          </h4>
                          
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-slate-400 font-medium">
                              {currentLanguage === 'amh' ? `ምዕራፍ ${currentChapterIndex} / ${totalChaptersCount}` : `Chapter ${currentChapterIndex} of ${totalChaptersCount}`}
                            </span>
                          </div>

                          {/* Beautiful Progress Bar */}
                          <div className="w-24 bg-slate-950 h-1 rounded-full overflow-hidden mt-1.5 flex">
                            <div 
                              className="bg-amber-500 h-full rounded-full" 
                              style={{ width: `${continueProgressPercent}%` }} 
                            />
                          </div>
                        </div>
                      </div>

                      <div className="p-1 px-1 text-slate-405 text-amber-500 hover:text-amber-400 transition">
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Search Bar section */}
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                  <input
                    id="main-stories-search-input"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t.searchPlaceholder}
                    className="w-full bg-slate-900/30 border border-white/[0.03] p-3 pl-10 rounded-xl text-xs focus:outline-none focus:border-amber-500/20 focus:bg-slate-900/70 text-slate-100 transition duration-150"
                  />
                </div>

                {/* Horizontal Scroll genres selectors */}
                <div className="space-y-2">
                  <div className="flex gap-1.5 overflow-x-auto py-1 scrollbar-none scroll-smooth">
                    <button
                      id="genre-tab-all"
                      onClick={() => setActiveGenre(null)}
                      className={`text-[10px] font-bold py-1.5 px-4 rounded-full border transition whitespace-nowrap uppercase ${
                        activeGenre === null
                          ? 'bg-amber-500 text-slate-950 border-transparent shadow shadow-amber-500/10'
                          : 'bg-slate-900/40 text-slate-400 border-white/[0.03] hover:bg-slate-900/80'
                      }`}
                    >
                      {currentLanguage === 'amh' ? 'ሁሉም' : 'All'}
                    </button>
                    {GENRE_LIST.map((g) => (
                      <button
                        id={`genre-tab-${g}`}
                        key={g}
                        onClick={() => setActiveGenre(g)}
                        className={`text-[10px] font-bold py-1.5 px-3.5 rounded-full border transition whitespace-nowrap uppercase ${getGenreStyle(g, activeGenre === g)}`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dynamic Content Views */}
                {searchQuery || activeGenre ? (
                  /* Standard List view for search/genre queries */
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <Search className="w-3.5 h-3.5 text-amber-500" />
                      <span>{searchQuery || activeGenre ? 'Search Results / የፍለጋ ውጤቶች' : t.trendingStories}</span>
                    </h3>

                    {filteredStories.length === 0 ? (
                      <p className="text-xs text-slate-500 py-10 text-center italic border border-white/[0.03] rounded-2xl bg-slate-900/30">
                        No matching stories found. Check different keywords or genres.
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 gap-3.5">
                        {filteredStories.map((story) => (
                          <div 
                            id={`story-card-${story.id}`}
                            key={story.id} 
                            onClick={() => handleStartReading(story.id)}
                            className="bg-slate-900/35 border border-white/[0.03] p-4 rounded-2xl flex gap-4 hover:bg-slate-900/75 hover:shadow-lg hover:border-white/[0.08] transition duration-200 cursor-pointer animate-fade-in"
                          >
                            <img 
                              src={story.coverImage} 
                              alt={story.title} 
                              className="w-16 h-22 object-cover rounded-xl shrink-0 shadow border-0 bg-slate-950/20"
                              referrerPolicy="no-referrer"
                            />
                            <div className="flex-1 flex flex-col justify-between py-0.5">
                              <div className="space-y-0.5">
                                <div className="flex items-start justify-between gap-1.5">
                                  <h4 className="font-extrabold text-sm text-slate-100 leading-snug">{story.title}</h4>
                                  {(currentUser.role === 'admin' || story.authorId === currentUser.id) && (
                                    <button
                                      id={`delete-story-${story.id}`}
                                      title="Delete Story"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (window.confirm(`Are you sure you want to delete "${story.title}" permanently?`)) {
                                          deleteStory(story.id);
                                        }
                                      }}
                                      className="p-1.5 bg-red-950/40 text-red-500 hover:text-red-300 hover:bg-red-900/30 rounded-lg transition"
                                    >
                                      <Trash className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </div>
                                <p className="text-[10px] text-amber-500/95 font-bold tracking-wide">by {story.authorName}</p>
                                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mt-1">
                                  {story.description}
                                </p>
                              </div>

                              <div className="flex items-center gap-4 text-[10px] text-slate-500 pt-1.5 font-mono">
                                <span>👁️ {story.views.toLocaleString()}</span>
                                <span>❤️ {story.likes.toLocaleString()}</span>
                                <span className="bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded text-[8px] font-bold font-sans">
                                  {story.genres[0]}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  /* Horizontally scrolling vertical tracks (per the screenshot design!) */
                  <div className="space-y-7">
                    
                    {/* SECTION 1: Trending 🔥 ተወዳጅ */}
                    <div className="space-y-3">
                      <h3 className="text-sm font-black text-slate-100 flex items-center gap-1.5 px-0.5">
                        <span role="img" aria-label="fire">🔥</span>
                        <span>{t.trendingStories}</span>
                      </h3>
                      
                      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none snap-x h-auto">
                        {trendingStories.map((story) => {
                          const storyChaps = chapters.filter(c => c.storyId === story.id);
                          const hasLocked = storyChaps.some(c => c.isLocked);
                          return (
                            <div 
                              id={`story-vertical-${story.id}`}
                              key={story.id}
                              onClick={() => handleStartReading(story.id)}
                              className="w-[145px] shrink-0 snap-start flex flex-col cursor-pointer group"
                            >
                              {/* Book cover container with aspect 3/4.2 */}
                              <div className="relative aspect-[3/4.2] w-full rounded-2xl overflow-hidden shadow-lg border border-white/[0.02] bg-slate-900/20 transition duration-300 active:scale-95">
                                <img 
                                  src={story.coverImage} 
                                  alt={story.title} 
                                  className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                                  referrerPolicy="no-referrer"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                                
                                {hasLocked && (
                                  <div className="absolute top-2.5 right-2.5 bg-amber-500/90 backdrop-blur text-slate-950 px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest shadow">
                                    PREMIUM
                                  </div>
                                )}
                              </div>

                              {/* Title, Author, Views & Likes stats under the cover */}
                              <div className="mt-2.5 space-y-0.5 flex flex-col text-left">
                                <h4 className="font-extrabold text-xs text-slate-100 leading-tight truncate group-hover:text-amber-400 transition">
                                  {story.title}
                                </h4>
                                <p className="text-[10px] text-slate-400 font-medium truncate">
                                  {story.authorName}
                                </p>
                                <div className="text-[9px] text-slate-500 font-mono mt-1 flex items-center gap-1">
                                  <span>👁️ {story.views.toLocaleString()}</span>
                                  <span>•</span>
                                  <span>❤️ {story.likes.toLocaleString()}</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* SECTION 2: New Arrivals 🎉 ✨ አዲስ የወጡ */}
                    <div className="space-y-3">
                      <h3 className="text-sm font-black text-slate-100 flex items-center gap-1.5 px-0.5">
                        <span role="img" aria-label="sparkles">✨</span>
                        <span>{currentLanguage === 'amh' ? 'አዲስ የወጡ' : 'New Arrivals'}</span>
                      </h3>
                      
                      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none snap-x h-auto">
                        {newArrivalStories.map((story) => {
                          const storyChaps = chapters.filter(c => c.storyId === story.id);
                          const hasLocked = storyChaps.some(c => c.isLocked);
                          return (
                            <div 
                              id={`story-arrival-${story.id}`}
                              key={story.id}
                              onClick={() => handleStartReading(story.id)}
                              className="w-[145px] shrink-0 snap-start flex flex-col cursor-pointer group"
                            >
                              {/* Book cover aspect 3/4.2 */}
                              <div className="relative aspect-[3/4.2] w-full rounded-2xl overflow-hidden shadow-lg border border-white/[0.02] bg-slate-900/20 transition duration-300 active:scale-95">
                                <img 
                                  src={story.coverImage} 
                                  alt={story.title} 
                                  className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                                  referrerPolicy="no-referrer"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                                
                                {hasLocked && (
                                  <div className="absolute top-2.5 right-2.5 bg-amber-500/90 backdrop-blur text-slate-950 px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest shadow">
                                    PREMIUM
                                  </div>
                                )}
                              </div>

                              {/* Text info info */}
                              <div className="mt-2.5 space-y-0.5 flex flex-col text-left">
                                <h4 className="font-extrabold text-xs text-slate-100 leading-tight truncate group-hover:text-amber-400 transition">
                                  {story.title}
                                </h4>
                                <p className="text-[10px] text-slate-400 font-medium truncate">
                                  {story.authorName}
                                </p>
                                <div className="text-[9px] text-slate-500 font-mono mt-1 flex items-center gap-1">
                                  <span>👁️ {story.views.toLocaleString()}</span>
                                  <span>•</span>
                                  <span>❤️ {story.likes.toLocaleString()}</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                  </div>
                )}

              </motion.div>
            )}

            {activeScreen === 'wallet' && <CoinWallet />}
            {activeScreen === 'writer' && <WriterDashboard />}
            {activeScreen === 'admin' && <AdminDashboard />}

            {/* NOTIFICATIONS SCREEN */}
            {activeScreen === 'notifications' && (
              <motion.div 
                id="notifications-screen" 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="max-w-md mx-auto px-4 py-5 space-y-4"
              >
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {t.notifications} ({notifications.length})
                </h3>

                {notifications.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-10 italic">Your notice log is currently clear.</p>
                ) : (
                  <div className="space-y-2.5">
                    {notifications.map((not) => (
                      <div key={not.id} className="bg-slate-900/40 border border-white/[0.03] p-4 rounded-xl space-y-1 shadow-sm">
                        <div className="flex items-center justify-between text-[11px] text-slate-500">
                          <span className="font-bold text-amber-550 tracking-wide uppercase text-[9px]">
                            {not.type} Notice
                          </span>
                          <span className="font-mono text-[9px]">
                            {new Date(not.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <h4 className="font-bold text-xs text-slate-100">{not.title}</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">{not.message}</p>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* DETAILED USER PROFILE & SETTINGS */}
            {activeScreen === 'profile' && (
              <motion.div 
                id="profile-screen" 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="max-w-md mx-auto px-4 py-5 space-y-6"
              >
                
                {/* Profile card details */}
                <div className="bg-slate-900/40 border border-white/[0.03] p-5 rounded-2xl flex items-center gap-4 relative overflow-hidden shadow-md">
                  <div className="relative group shrink-0">
                    <img 
                      src={currentUser.avatar} 
                      alt={currentUser.name} 
                      className="w-14 h-14 rounded-full border border-amber-500/15 shadow object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <label className="absolute inset-0 bg-slate-950/60 rounded-full flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition duration-200">
                      <Camera className="w-4 h-4 text-white" />
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = () => {
                              if (typeof reader.result === 'string') {
                                // Update local user profile state
                                const updatedUser = { ...currentUser, avatar: reader.result };
                                setCurrentUser(updatedUser);
                                
                                // Direct local storage update fallback for simulated users list
                                const usersRaw = localStorage.getItem('engida_users');
                                if (usersRaw) {
                                  try {
                                    const parsedUsers = JSON.parse(usersRaw);
                                    const ind = parsedUsers.findIndex((u: any) => u.id === currentUser.id);
                                    if (ind !== -1) {
                                      parsedUsers[ind].avatar = reader.result;
                                      localStorage.setItem('engida_users', JSON.stringify(parsedUsers));
                                    }
                                  } catch (err) {
                                    console.error(err);
                                  }
                                }
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>
                  <div className="space-y-0.5 flex-1">
                    <h4 className="font-extrabold text-base text-white">{currentUser.name}</h4>
                    <p className="text-xs text-slate-400">{currentUser.email}</p>
                    <div className="flex flex-wrap gap-2 items-center mt-1.5">
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-transparent">
                        Role / ሚና፡ {currentUser.role}
                      </span>
                      <label className="text-[10px] text-slate-400 font-bold hover:text-white transition cursor-pointer flex items-center gap-1 active:scale-95">
                        <Camera className="w-3.5 h-3.5 text-amber-500" />
                        <span>Edit Photo</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = () => {
                                if (typeof reader.result === 'string') {
                                  const updatedUser = { ...currentUser, avatar: reader.result };
                                  setCurrentUser(updatedUser);
                                  
                                  const usersRaw = localStorage.getItem('engida_users');
                                  if (usersRaw) {
                                    try {
                                      const parsedUsers = JSON.parse(usersRaw);
                                      const ind = parsedUsers.findIndex((u: any) => u.id === currentUser.id);
                                      if (ind !== -1) {
                                        parsedUsers[ind].avatar = reader.result;
                                        localStorage.setItem('engida_users', JSON.stringify(parsedUsers));
                                      }
                                    } catch (err) {
                                      console.error(err);
                                    }
                                  }
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Badges Achievements */}
                <div className="bg-slate-900/40 border border-white/[0.03] p-4.5 rounded-2xl space-y-3 shadow-md">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-500" />
                    <span>Reader Badges & Accolades</span>
                  </h4>

                  <div className="flex flex-wrap gap-2">
                    {currentUser.badges.map((badge, index) => (
                      <span key={index} className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-950/40 border border-white/[0.03] text-amber-450 flex items-center gap-1">
                        ★ {badge}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Streaks & bookmarks stats */}
                <div className="grid grid-cols-2 gap-3.5">
                  <div className="bg-slate-900/25 p-4 rounded-xl border border-white/[0.03] text-center shadow-sm">
                    <Flame className="w-6 h-6 text-orange-500 mx-auto animate-bounce mb-1" />
                    <span className="text-xs font-extrabold block text-slate-100">{currentUser.streak} Day Habit</span>
                    <span className="text-[10px] text-slate-500">Reading Habit Streak</span>
                  </div>

                  <div className="bg-slate-900/25 p-4 rounded-xl border border-white/[0.03] text-center shadow-sm">
                    <Bookmark className="w-6 h-6 text-amber-500 mx-auto mb-1" />
                    <span className="text-xs font-extrabold block text-slate-100">{bookmarks.length} Bookmarks</span>
                    <span className="text-[10px] text-slate-500">Saved in Library</span>
                  </div>
                </div>

                {/* Configurations Menu */}
                <div className="bg-slate-900/40 border border-white/[0.03] rounded-2xl p-2.5 space-y-1 shadow-md">
                  <div className="flex items-center justify-between p-3.5 border-b border-white/[0.02]">
                    <div className="flex flex-col text-left">
                      <span className="text-xs font-bold text-slate-200">App Language Choice</span>
                      <span className="text-[10px] text-slate-400">Toggle bilingual layout</span>
                    </div>

                    <div className="flex gap-1.5 bg-slate-950 p-1 rounded-full border border-white/[0.03]">
                      <button
                        id="lang-p-amh"
                        onClick={() => setLanguage('amh')}
                        className={`text-[10px] font-black px-2.5 py-1 rounded-full ${
                          currentLanguage === 'amh' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        አማርኛ
                      </button>
                      <button
                        id="lang-p-eng"
                        onClick={() => setLanguage('eng')}
                        className={`text-[10px] font-black px-2.5 py-1 rounded-full ${
                          currentLanguage === 'eng' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        EN
                      </button>
                    </div>
                  </div>

                  {/* Log Out button */}
                  <button
                    id="profile-logout-btn"
                    onClick={logout}
                    className="w-full text-left p-3.5 text-red-400 hover:bg-slate-850 rounded-xl transition flex items-center gap-2.5 text-xs font-bold"
                  >
                    <LogOut className="w-4 h-4 shrink-0" />
                    <span>Sign Out from Engida</span>
                  </button>
                </div>

              </motion.div>
            )}
          </div>
        )}
      </AnimatePresence>

      {/* FIXED FOOTER NAV BAR (Not visible during active reading) */}
      {!isReadingActive && (
        <nav id="app-footer-nav" className="bg-slate-950/85 backdrop-blur-md border-t border-white/[0.02] fixed bottom-0 inset-x-0 py-2.5 z-40 shadow-2xl">
          <div className="max-w-md mx-auto px-6 flex items-center justify-between">
            
            <button
              id="footer-home-btn"
              onClick={() => {
                setActiveScreen('home');
                setSelectedStoryId(null);
              }}
              className={`flex flex-col items-center gap-1 transition ${
                activeScreen === 'home' ? 'text-amber-500 font-bold scale-105' : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              <BookOpen className="w-5 h-5" />
              <span className="text-[9px] uppercase tracking-wide">Stories</span>
            </button>

            <button
              id="footer-wallet-btn"
              onClick={() => {
                setActiveScreen('wallet');
                setSelectedStoryId(null);
              }}
              className={`flex flex-col items-center gap-1 transition ${
                activeScreen === 'wallet' ? 'text-amber-500 font-bold scale-105' : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              <Coins className="w-5 h-5" />
              <span className="text-[9px] uppercase tracking-wide">Wallet</span>
            </button>

            {/* Writer tab wrapper. Always available but highlighted to writers */}
            <button
              id="footer-writer-btn"
              onClick={() => {
                setActiveScreen('writer');
                setSelectedStoryId(null);
              }}
              className={`flex flex-col items-center gap-1 transition ${
                activeScreen === 'writer' ? 'text-amber-500 font-bold scale-105' : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              <PenTool className="w-5 h-5 animate-pulse" />
              <span className="text-[9px] uppercase tracking-wide">Write</span>
            </button>

            {/* Admin toggle if elevated */}
            {currentUser.role === 'admin' && (
              <button
                id="footer-admin-btn"
                onClick={() => {
                  setActiveScreen('admin');
                  setSelectedStoryId(null);
                }}
                className={`flex flex-col items-center gap-1 transition ${
                  activeScreen === 'admin' ? 'text-amber-500 font-bold scale-105' : 'text-slate-400 hover:text-slate-300'
                }`}
              >
                <ShieldAlert className="w-5 h-5 text-amber-500" />
                <span className="text-[9px] uppercase tracking-wide">Admin</span>
              </button>
            )}

            <button
              id="footer-profile-btn"
              onClick={() => {
                setActiveScreen('profile');
                setSelectedStoryId(null);
              }}
              className={`flex flex-col items-center gap-1 transition ${
                activeScreen === 'profile' ? 'text-amber-500 font-bold scale-105' : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              <User className="w-5 h-5" />
              <span className="text-[9px] uppercase tracking-wide">Profile</span>
            </button>

          </div>
        </nav>
      )}

    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
