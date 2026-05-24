import React, { useState } from 'react';
import { useAppContext } from '../AppContext';
import { TRANSLATIONS } from '../translations';
import { GENRE_LIST } from '../data';
import { PlusCircle, Award, BookOpen, PenTool, TrendingUp, DollarSign, Send, CheckCircle, FileText, HelpCircle, Lock, Trash, Camera } from 'lucide-react';

export default function WriterDashboard() {
  const { 
    currentUser, currentLanguage, stories, chapters, getWriterStats, 
    createStory, deleteStory, createChapter, submitMonetizationRequest, submitPremiumRequest,
    monetizationRequests, premiumRequests, simulateReadersCount
  } = useAppContext();

  const t = TRANSLATIONS[currentLanguage];

  // Forms
  const [activeTab, setActiveTab] = useState<'overview' | 'monetization' | 'create-story' | 'add-chapter'>('overview');
  
  // Create Story draft inputs
  const [newStoryTitle, setNewStoryTitle] = useState('');
  const [newStoryDesc, setNewStoryDesc] = useState('');
  const [newStoryCover, setNewStoryCover] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [storySuccessMessage, setStorySuccessMessage] = useState('');

  // Create Chapter draft inputs
  const [selStoryId, setSelStoryId] = useState('');
  const [newChapTitle, setNewChapTitle] = useState('');
  const [newChapContent, setNewChapContent] = useState('');
  const [reqLock, setReqLock] = useState(false);
  const [coinPrice, setCoinPrice] = useState(10);
  const [chapterSuccessMessage, setChapterSuccessMessage] = useState('');

  // Monetization Form inputs
  const [fullName, setFullName] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [monEmail, setMonEmail] = useState('');
  const [telebirrNo, setTelebirrNo] = useState('');
  const [monSuccess, setMonSuccess] = useState('');

  if (!currentUser) return null;

  // Compile active writing metrics
  const stats = getWriterStats(currentUser.id);

  // Filter writer's stories
  const writerStories = stories.filter(s => s.authorId === currentUser.id);

  // Check monetization request status
  const activeMonRequest = monetizationRequests.find(r => r.writerId === currentUser.id);

  const handleCreateStorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStoryTitle || !newStoryDesc || selectedGenres.length === 0) return;

    createStory(
      newStoryTitle,
      newStoryDesc,
      newStoryCover,
      selectedGenres,
      currentUser.id,
      currentUser.name
    );

    setStorySuccessMessage('✓ Story submitted! Admins will audit and approve it before it goes live.');
    setNewStoryTitle('');
    setNewStoryDesc('');
    setNewStoryCover('');
    setSelectedGenres([]);

    setTimeout(() => {
      setStorySuccessMessage('');
      setActiveTab('overview');
    }, 4000);
  };

  const handleCreateChapterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selStoryId || !newChapTitle || !newChapContent) return;

    createChapter(
      selStoryId,
      newChapTitle,
      newChapContent,
      reqLock,
      coinPrice
    );

    setChapterSuccessMessage(`✓ Chapter submitted successfully! ${reqLock ? 'Admin premium lock request generated.' : ''}`);
    setNewChapTitle('');
    setNewChapContent('');
    setReqLock(false);

    setTimeout(() => {
      setChapterSuccessMessage('');
      setActiveTab('overview');
    }, 4000);
  };

  const handleGenreToggle = (g: string) => {
    if (selectedGenres.includes(g)) {
      setSelectedGenres(prev => prev.filter(item => item !== g));
    } else {
      if (selectedGenres.length < 3) {
        setSelectedGenres(prev => [...prev, g]);
      }
    }
  };

  const handleMonetizationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phoneNo || !telebirrNo) return;

    submitMonetizationRequest(fullName, phoneNo, monEmail || currentUser.email, telebirrNo);
    setMonSuccess('✓ Your Creator monetization request has been sent to application admins! Direct Telebirr revenue accounts will activate upon review.');
    
    setTimeout(() => {
      setMonSuccess('');
    }, 5000);
  };

  const handleFulfillSandboxRequirements = () => {
    // Quickly augment stats for the logged-in writer so they pass the 500 qualified readers and 3 stories criteria
    // Let's increment readers count for story_1 or story_2 to bypass limit
    if (writerStories.length > 0) {
      simulateReadersCount(writerStories[0].id, 450);
    }
    alert("Sandbox data updated: Simulated Reader metrics set! Re-open monetization tab to request status.");
  };

  // Eligibility evaluation variables
  const isAgeValid = stats.accountAgeDays >= 30;
  const isStoriesValid = stats.storiesPublished >= 3;
  const isChaptersValid = stats.chaptersPublished >= 30;
  const isReadersValid = stats.qualifiedReadersCount >= 500;
  const eligibleForMonetization = isAgeValid && isStoriesValid && isChaptersValid && isReadersValid;

  return (
    <div id="writer-dashboard-canvas" className="max-w-md mx-auto px-4 py-6 font-sans text-slate-100 space-y-6">
      
      {/* Tab Selectors */}
      <div className="flex border-b border-white/[0.02] overflow-x-auto gap-2 py-1 scrollbar-none">
        {(['overview', 'monetization', 'create-story', 'add-chapter'] as const).map((tab) => (
          <button
            id={`writer-tab-${tab}`}
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-xs font-bold py-2.5 px-4 rounded-xl border transition whitespace-nowrap shrink-0 uppercase tracking-wider ${
              activeTab === tab 
                ? 'bg-amber-500 text-slate-950 border-transparent shadow-lg shadow-amber-500/10'
                : 'bg-slate-900/40 text-slate-400 border-white/[0.03] hover:bg-slate-900/80'
            }`}
          >
            {tab === 'overview' && 'Stats & Stories'}
            {tab === 'monetization' && 'Creator Perks 👑'}
            {tab === 'create-story' && 'Write Story 📚'}
            {tab === 'add-chapter' && 'Add Chapter 📝'}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div id="writer-overview-tab" className="space-y-6">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-3.5">
            <div className="bg-slate-900/50 border border-white/[0.03] p-4 rounded-2xl shadow-sm">
              <span className="text-slate-500 text-[10px] font-bold uppercase block mb-1">Total Views / የንባብ ብዛት</span>
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-500" />
                <span className="text-xl font-extrabold text-slate-200">{stats.reads}</span>
              </div>
            </div>

            <div className="bg-slate-900/50 border border-white/[0.03] p-4 rounded-2xl shadow-sm">
              <span className="text-slate-500 text-[10px] font-bold uppercase block mb-1">Streak / ተከታታይ ቀናት</span>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-amber-500 animate-bounce" />
                <span className="text-xl font-extrabold text-slate-200">{currentUser.streak} Days</span>
              </div>
            </div>

            <div className="bg-slate-900/50 border border-white/[0.03] p-4 rounded-2xl shadow-sm">
              <span className="text-slate-500 text-[10px] font-bold uppercase block mb-1">Withdrawable Balance</span>
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-500" />
                <span className="text-xl font-extrabold text-slate-200">{stats.withdrawableBalance} Coins</span>
              </div>
              <p className="text-[9px] text-slate-400 pt-1">
                Pending: {stats.pendingBalance} Coins
              </p>
            </div>

            <div className="bg-slate-900/50 border border-white/[0.03] p-4 rounded-2xl shadow-sm">
              <span className="text-slate-500 text-[10px] font-bold uppercase block mb-1">Approved Payouts</span>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span className="text-xl font-extrabold text-slate-200">{stats.paidBalance} ETB</span>
              </div>
            </div>
          </div>

          {/* Published Stories section */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Published Serialized Books ({writerStories.length})
            </h4>

            {writerStories.length === 0 ? (
              <div className="p-6 text-center border border-white/[0.03] rounded-2xl bg-slate-950 flex flex-col items-center">
                <HelpCircle className="w-8 h-8 text-slate-700 mb-2" />
                <p className="text-xs text-slate-500 italic">No stories published yet. Let's write!</p>
              </div>
            ) : (
              <div className="space-y-3.5">
                {writerStories.map((story) => (
                  <div key={story.id} className="bg-slate-900/40 border border-white/[0.03] p-3.5 rounded-2xl flex items-start gap-4">
                    <img 
                      src={story.coverImage} 
                      alt={story.title} 
                      className="w-16 h-22 object-cover rounded-xl shrink-0 shadow-md border border-slate-950/20"
                      referrerPolicy="no-referrer"
                    />
                    
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between gap-1.5">
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-bold text-sm text-slate-100 block">{story.title}</h4>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wide border ${
                            story.isApproved 
                              ? 'bg-emerald-900/35 text-emerald-400 border-emerald-900/30' 
                              : 'bg-amber-900/35 text-amber-400 border-amber-900/30'
                          }`}>
                            {story.isApproved ? 'Approved' : 'Pending'}
                          </span>
                        </div>
                        <button
                          id={`writer-delete-story-${story.id}`}
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete "${story.title}" permanently?`)) {
                              deleteStory(story.id);
                            }
                          }}
                          className="p-1.5 bg-red-950/40 text-red-500 hover:text-red-300 hover:bg-red-900/30 rounded-lg transition"
                          title="Delete Story"
                        >
                          <Trash className="w-3.5 h-3.5 shrink-0" />
                        </button>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-2">{story.description}</p>
                      
                      <div className="flex items-center gap-4 text-[10px] pt-1.5 font-mono text-slate-500">
                        <span>👁️ {story.views} reads</span>
                        <span>❤️ {story.likes} likes</span>
                        <span>🔒 {story.unlockCount} unlocks</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'monetization' && (
        <div id="writer-monetization-tab" className="space-y-5">
          {/* Header Banner */}
          <div className="bg-slate-900 border border-amber-500/20 p-5 rounded-2xl space-y-2">
            <h3 className="text-sm font-extrabold text-amber-500 uppercase tracking-widest flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <span>ENGIDA Creator Program</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Unlock chapters of your stories so readers pay internal coins to access them. ENGIDA implements a <strong>60% Writer Portfolio Share</strong> and executes direct manual payouts at your Telebirr wallet monthly once approved.
            </p>
          </div>

          {/* Eligibility checklist */}
          <div className="bg-slate-900 border border-slate-850 p-5 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">{t.monetizationProgress}</h4>
              <button
                id="sandbox-fulfill-reqs"
                type="button"
                onClick={handleFulfillSandboxRequirements}
                className="text-[9px] bg-amber-500/15 border border-amber-500/35 text-amber-400 uppercase font-black px-2 py-1 rounded"
              >
                Simulate Reads/Stories Requirements
              </button>
            </div>

            {/* Checklist elements */}
            <div className="space-y-3.5 text-xs">
              <div className="flex items-center justify-between border-b border-slate-950 pb-2.5">
                <span className="text-slate-400">1. {t.monetizeAge}</span>
                <span className={`font-semibold ${isAgeValid ? 'text-emerald-400' : 'text-amber-500'}`}>
                  {stats.accountAgeDays} / 30 Days {isAgeValid ? '✓' : ''}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-slate-950 pb-2.5">
                <span className="text-slate-400">2. {t.monetizeStories}</span>
                <span className={`font-semibold ${isStoriesValid ? 'text-emerald-400' : 'text-amber-500'}`}>
                  {stats.storiesPublished} / 3 Stories {isStoriesValid ? '✓' : ''}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-slate-950 pb-2.5">
                <span className="text-slate-400">3. {t.monetizeChapters}</span>
                <span className={`font-semibold ${isChaptersValid ? 'text-emerald-400' : 'text-amber-500'}`}>
                  {stats.chaptersPublished} / 30 Chapters {isChaptersValid ? '✓' : ''}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">4. {t.monetizeReaders}</span>
                <span className={`font-semibold ${isReadersValid ? 'text-emerald-400' : 'text-amber-500'}`}>
                  {stats.qualifiedReadersCount} / 500 Reads {isReadersValid ? '✓' : ''}
                </span>
              </div>
            </div>

            {/* Application review check status */}
            {activeMonRequest ? (
              <div className={`p-4 rounded-xl border text-center text-xs font-bold ${
                activeMonRequest.status === 'approved' ? 'bg-emerald-950/40 text-emerald-400 border-emerald-900/30' :
                activeMonRequest.status === 'rejected' ? 'bg-red-950/40 text-red-400 border-red-900/30' :
                activeMonRequest.status === 'suspended' ? 'bg-amber-950/40 text-amber-400 border-amber-900/30' :
                'bg-slate-950 text-amber-500 border-amber-500/20'
              }`}>
                Current Creator Application Status: <span className="uppercase">{activeMonRequest.status}</span>
              </div>
            ) : (
              eligibleForMonetization ? (
                /* Eligible and submits application form */
                <form onSubmit={handleMonetizationSubmit} className="border-t border-slate-950 pt-4 space-y-3">
                  <h4 className="text-xs font-bold text-amber-500 uppercase tracking-wide">Monetization Request Credentials</h4>
                  
                  <div>
                    <input
                      id="mon-fullname"
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="FullName / ሙሉ ስም"
                      className="w-full bg-slate-950 border border-slate-800 text-xs p-2.5 rounded-lg text-slate-100"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      id="mon-phone"
                      type="text"
                      required
                      value={phoneNo}
                      onChange={(e) => setPhoneNo(e.target.value)}
                      placeholder="Phone / ስልክ"
                      className="w-full bg-slate-950 border border-slate-800 text-xs p-2.5 rounded-lg text-slate-100"
                    />
                    <input
                      id="mon-telebirr"
                      type="text"
                      required
                      value={telebirrNo}
                      onChange={(e) => setTelebirrNo(e.target.value)}
                      placeholder="Telebirr Wallet"
                      className="w-full bg-slate-950 border border-slate-800 text-xs p-2.5 rounded-lg text-slate-100"
                    />
                  </div>

                  {monSuccess && (
                    <p className="text-xs text-emerald-400 bg-emerald-950/45 p-3 rounded-xl border border-emerald-900/30">
                      {monSuccess}
                    </p>
                  )}

                  <button
                    id="mon-submit-request-btn"
                    type="submit"
                    className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-3 px-4 rounded-xl text-xs transition"
                  >
                    {t.requestMonetizationBtn}
                  </button>
                </form>
              ) : (
                <div className="bg-slate-950 p-4 rounded-xl border border-danger-900 text-danger-400 text-xs text-center font-bold">
                  ⚠️ Minimum reader, age or library metrics not fulfilled. Fulfill criteria above to apply.
                </div>
              )
            )}
          </div>
        </div>
      )}

      {activeTab === 'create-story' && (
        <form onSubmit={handleCreateStorySubmit} className="bg-slate-900 border border-slate-850 p-5 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold/85 text-white uppercase tracking-wider">{t.storyEditor}</h3>

          <div>
            <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase bg-slate-950/30 py-1 px-2.5 rounded">
              {t.storyTitle}
            </label>
            <input
              id="new-story-title-input"
              type="text"
              required
              value={newStoryTitle}
              onChange={(e) => setNewStoryTitle(e.target.value)}
              placeholder="e.g., የድሮው ሰፈር ፍቅር..."
              className="w-full bg-slate-950 border border-slate-850 text-xs p-3 rounded-lg text-slate-1:0"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase bg-slate-950/30 py-1 px-2.5 rounded flex items-center justify-between">
              <span>{t.storyCover}</span>
              <span className="text-[9px] text-amber-500 font-bold lowercase">or upload from device</span>
            </label>
            <div className="space-y-2">
              <input
                id="new-story-cover-input"
                type="text"
                value={newStoryCover}
                onChange={(e) => setNewStoryCover(e.target.value)}
                placeholder="Paste image unsplash URL..."
                className="w-full bg-slate-950 border border-slate-850 text-xs p-3 rounded-lg text-slate-100"
              />
              <div className="flex items-center gap-2">
                <label className="flex-1 bg-slate-950 border border-dashed border-slate-800 hover:border-amber-500/50 hover:bg-slate-900/40 p-3 rounded-lg flex items-center justify-center gap-2 text-xs text-slate-400 cursor-pointer transition">
                  <Camera className="w-4 h-4 text-amber-500" />
                  <span>Choose Cover Photo / ፎቶ አንሳ</span>
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
                            setNewStoryCover(reader.result);
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
                {newStoryCover && (
                  <div className="w-12 h-16 rounded border border-white/15 bg-slate-900 overflow-hidden relative group shrink-0">
                    <img 
                      src={newStoryCover} 
                      alt="Cover Preview" 
                      className="w-full h-full object-cover" 
                      referrerPolicy="no-referrer"
                    />
                    <button 
                      type="button" 
                      onClick={() => setNewStoryCover('')} 
                      className="absolute inset-0 bg-red-955/80 hover:bg-red-900/90 text-white flex items-center justify-center text-[10px] font-bold opacity-0 group-hover:opacity-100 transition"
                    >
                      Clear
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase bg-slate-950/30 py-1 px-2.5 rounded">
              {t.storyDesc}
            </label>
            <textarea
              required
              rows={4}
              value={newStoryDesc}
              onChange={(e) => setNewStoryDesc(e.target.value)}
              placeholder="Explain synopsis of the serialized story..."
              className="w-full bg-slate-950 border border-slate-850 text-xs p-3 rounded-lg text-slate-100"
            />
          </div>

          {/* Genres Grid selector */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 block mb-2 uppercase">
              SELECT GENRES / ምርጥ ዘውጎች (Max 3)
            </label>
            <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto bg-slate-950 p-2.5 rounded-lg border border-slate-850">
              {GENRE_LIST.map((g) => (
                <button
                  id={`genre-editor-btn-${g}`}
                  type="button"
                  key={g}
                  onClick={() => handleGenreToggle(g)}
                  className={`text-[10px] px-2 py-1 rounded-full border transition ${
                    selectedGenres.includes(g)
                      ? 'bg-amber-500 text-slate-950 border-amber-500'
                      : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {storySuccessMessage && (
            <p className="text-xs text-emerald-400 bg-emerald-950/45 p-3 rounded-xl border border-emerald-900/30">
              {storySuccessMessage}
            </p>
          )}

          <button
            id="publish-story-action-btn"
            type="submit"
            disabled={!newStoryTitle || !newStoryDesc || selectedGenres.length === 0}
            className="w-full bg-amber-500 disabled:opacity-45 hover:bg-amber-600 disabled:hover:bg-amber-500 text-slate-950 font-bold py-3.5 px-4 rounded-xl text-xs transition"
          >
            {t.publishStory}
          </button>
        </form>
      )}

      {activeTab === 'add-chapter' && (
        <form onSubmit={handleCreateChapterSubmit} className="bg-slate-900 border border-slate-850 p-5 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold/85 text-white uppercase tracking-wider">{t.chapterEditor}</h3>

          <div>
            <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase">
              SELECT TARGET SERIAL STORY / መጽሐፍ ይምረጡ
            </label>
            <select
              value={selStoryId}
              onChange={(e) => setSelStoryId(e.target.value)}
              required
              className="w-full bg-slate-950 border border-slate-850 text-xs p-3 rounded-lg text-slate-100 focus:outline-none"
            >
              <option value="">-- Choose active story --</option>
              {writerStories.map((s) => (
                <option key={s.id} value={s.id}>{s.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase">
              CHAPTER HEADLINE / የምዕራፍ ርዕስ
            </label>
            <input
              id="new-chap-title-input"
              type="text"
              required
              value={newChapTitle}
              onChange={(e) => setNewChapTitle(e.target.value)}
              placeholder="e.g., ምዕራፍ 3: የመርከቧ ምስጢር"
              className="w-full bg-slate-950 border border-slate-850 text-xs p-3 rounded-lg text-slate-100"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase">
              CHAPTER TEXT / የድርሰቱ ይዘት
            </label>
            <textarea
              required
              rows={10}
              value={newChapContent}
              onChange={(e) => setNewChapContent(e.target.value)}
              placeholder="Paste write-up copy text directly inside this panel..."
              className="w-full bg-slate-950 border border-slate-850 text-xs p-3 rounded-lg text-slate-100 font-serif leading-relaxed"
            />
          </div>

          {/* Premium Chapter lock locking request checks */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-500 uppercase flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                <span>Request Premium Chapter Lock</span>
              </span>
              <input
                type="checkbox"
                checked={reqLock}
                onChange={(e) => setReqLock(e.target.checked)}
                className="w-4 h-4 text-amber-500"
              />
            </div>

            <p className="text-[10px] text-slate-500 leading-relaxed">
              Locked premium chapters require approved monetization creator status from ENGIDA Admins. Only Admin decides locks but writers can suggest price configurations.
            </p>

            {reqLock && (
              <div className="flex items-center gap-3 border-t border-slate-900 pt-2 text-xs">
                <span className="text-slate-400">Lock Coin Price:</span>
                <input
                  type="number"
                  min={5}
                  max={50}
                  value={coinPrice}
                  onChange={(e) => setCoinPrice(parseInt(e.target.value))}
                  className="w-20 bg-slate-900 border border-slate-800 p-1.5 rounded text-center text-amber-400 font-bold"
                />
                <span className="text-slate-500 text-[10px]">(Standard ETB equivalents)</span>
              </div>
            )}
          </div>

          {chapterSuccessMessage && (
            <p className="text-xs text-emerald-400 bg-emerald-950/45 p-3 rounded-xl border border-emerald-900/30">
              {chapterSuccessMessage}
            </p>
          )}

          <button
            id="chapter-publish-action-btn"
            type="submit"
            disabled={!selStoryId || !newChapTitle || !newChapContent}
            className="w-full bg-amber-500 disabled:opacity-45 hover:bg-amber-600 disabled:hover:bg-amber-500 text-slate-950 font-bold py-3.5 px-4 rounded-xl text-xs transition"
          >
            {t.saveChapter}
          </button>
        </form>
      )}

    </div>
  );
}
