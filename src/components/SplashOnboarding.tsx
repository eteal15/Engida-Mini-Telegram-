import React, { useState } from 'react';
import { useAppContext } from '../AppContext';
import { TRANSLATIONS } from '../translations';
import { BookOpen, Sparkles, Send, Award, Coins } from 'lucide-react';
import { motion } from 'motion/react';

export default function SplashOnboarding({ onComplete }: { onComplete: () => void }) {
  const { currentLanguage, setLanguage, loginSimulated, currentUser } = useAppContext();
  const [step, setStep] = useState<'splash' | 'onboarding' | 'auth'>('splash');
  const t = TRANSLATIONS[currentLanguage];

  // Auth fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [telegramId, setTelegramId] = useState('');

  const handleStart = () => {
    setStep('onboarding');
  };

  const handleNextToAuth = () => {
    setStep('auth');
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    loginSimulated(email, name, 'reader', telegramId);
    onComplete();
  };

  const handleQuickDemoAdmin = () => {
    loginSimulated('lenaedward949@gmail.com', 'Lena Edward (Admin)', 'admin');
    onComplete();
  };

  const handleQuickDemoWriter = () => {
    loginSimulated('abera@engida.com', 'Abera Molla', 'writer', '@abera_molla');
    onComplete();
  };

  return (
    <div id="splash-onboarding-container" className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-6 font-sans relative overflow-hidden">
      {/* Dynamic Background Accents */}
      <div className="absolute top-[-100px] left-[-100px] w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-100px] right-[-100px] w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Language Header switch */}
      <div className="flex justify-end pt-2 z-10">
        <button
          id="lang-toggle-btn"
          onClick={() => setLanguage(currentLanguage === 'amh' ? 'eng' : 'amh')}
          className="bg-slate-900 border border-amber-500/30 text-xs px-3 py-1.5 rounded-full text-amber-400 hover:bg-slate-800 transition duration-150 font-medium"
        >
          {currentLanguage === 'amh' ? 'English (EN)' : 'አማርኛ (AM)'}
        </button>
      </div>

      {step === 'splash' && (
        <div id="splash-step-content" className="flex-1 flex flex-col justify-center items-center text-center space-y-6 max-w-md mx-auto z-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="w-24 h-24 bg-gradient-to-tr from-amber-600 to-amber-400 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20 mb-4 border border-amber-300/30"
          >
            <BookOpen id="app-logo-icon" className="w-12 h-12 text-slate-950 stroke-[2.5]" />
          </motion.div>

          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-amber-300 via-amber-400 to-amber-600 uppercase"
          >
            {t.appName}
          </motion.h1>

          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-sm font-medium text-amber-500 tracking-wider uppercase"
          >
            {currentLanguage === 'amh' ? 'እንግዳ ልብወለድ' : 'ENGIDA FICTION'}
          </motion.p>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-base text-slate-300 leading-relaxed px-4"
          >
            {t.tagline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="w-full pt-10"
          >
            <button
              id="splash-get-started-btn"
              onClick={handleStart}
              className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-4 px-6 rounded-xl transition duration-150 transform active:scale-95 shadow-lg shadow-amber-500/20 text-lg flex items-center justify-center gap-2"
            >
              {t.getStarted}
              <Sparkles className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      )}

      {step === 'onboarding' && (
        <div id="onboarding-step-content" className="flex-1 flex flex-col justify-center max-w-md mx-auto py-8 z-10 w-full">
          <div className="text-center mb-8">
            <span className="text-amber-500 font-bold tracking-widest text-xs uppercase block mb-1">
              {currentLanguage === 'amh' ? 'እንዴት እንደሚሰራ' : 'OUR PLATFORM'}
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-white mb-2">
              {currentLanguage === 'amh' ? 'ደራሲያንና አንባቢዎችን የሚያገናኝ' : 'The Home of Ethiopian Stories'}
            </h2>
            <p className="text-xs text-slate-400">
              {t.onboardingSub}
            </p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="bg-slate-900/60 backdrop-blur border border-slate-800 p-4 rounded-xl flex items-start gap-3.5">
              <div className="bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/20 text-amber-400 mt-0.5">
                <BookOpen className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-100 text-sm">
                  {currentLanguage === 'amh' ? 'ሰፊ የልብወለድ ምርጫዎች' : 'Interactive Serialization'}
                </h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {currentLanguage === 'amh' ? 'የፍቅር፣ አስፈሪ፣ ታሪካዊና ስነ-ልቦና ጨምሮ ቁጥራቸው የበዙ አማርኛ ልብወለዶችን ያግኙ።' : 'Follow books chapter-by-chapter, discuss updates in real time, and share responses.'}
                </p>
              </div>
            </div>

            <div className="bg-slate-900/60 backdrop-blur border border-slate-800 p-4 rounded-xl flex items-start gap-3.5">
              <div className="bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/20 text-amber-400 mt-0.5">
                <Coins className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-100 text-sm">
                  {currentLanguage === 'amh' ? 'በቴሌብር የሚሰራ ሳንቲም' : 'Curated Micro-Payments'}
                </h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {currentLanguage === 'amh' ? 'ምዕራፎችን በቀላሉ በሳንቲም ይቆልፉ ወይም ይክፈቱ። በቴሌብር እጅግ ቀለል ያለ የክፍያ ስርአት!' : 'Writers unlock premium locking access from admins, and readers pay easily using Telebirr transfers.'}
                </p>
              </div>
            </div>

            <div className="bg-slate-900/60 backdrop-blur border border-slate-800 p-4 rounded-xl flex items-start gap-3.5">
              <div className="bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/20 text-amber-400 mt-0.5">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-100 text-sm">
                  {currentLanguage === 'amh' ? 'የድርሰት ክህሎት ገቢ ማግኛ' : 'Fair Creator Economy'}
                </h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {currentLanguage === 'amh' ? '3 ሙሉ ታሪክ ካተሙ በኋላ የገቢ ማስገኛ ፈቃድ በመጠየቅ 60% የትርፍ ድርሻ በአጭር ጊዜ ማግኘት ይጀምሩ።' : 'Writers keep 60% of all locked chapters unlocks, with direct manual payout settlements monthly.'}
                </p>
              </div>
            </div>
          </div>

          <button
            id="onboarding-continue-btn"
            onClick={handleNextToAuth}
            className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-3.5 px-6 rounded-xl transition duration-150 flex items-center justify-center gap-2 shadow-lg shadow-amber-500/15"
          >
            {currentLanguage === 'amh' ? 'ወደ መግቢያ ይለፉ' : 'Go to Registration'}
            <Send className="w-4 h-4" />
          </button>
        </div>
      )}

      {step === 'auth' && (
        <div id="auth-step-content" className="flex-1 flex flex-col justify-center max-w-md mx-auto py-8 z-10 w-full">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-extrabold tracking-tight text-white mb-2">
              {t.loginTitle}
            </h2>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              {t.loginSub}
            </p>
          </div>

          {/* Core App Signup Form */}
          <form id="auth-simulator-form" onSubmit={handleLoginSubmit} className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4 mb-5">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                {currentLanguage === 'amh' ? 'ሙሉ ስም' : 'Full Name'}
              </label>
              <input
                id="auth-name-input"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Almaz Kebede"
                className="w-full bg-slate-950 border border-slate-800 text-sm p-3 rounded-lg focus:outline-none focus:border-amber-500/50 text-slate-100"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                {currentLanguage === 'amh' ? 'ኢሜይል መለያ' : 'Email Address'}
              </label>
              <input
                id="auth-email-input"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g., almaz@gmail.com"
                className="w-full bg-slate-950 border border-slate-800 text-sm p-3 rounded-lg focus:outline-none focus:border-amber-500/50 text-slate-100"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                {currentLanguage === 'amh' ? 'ቴሌግራም መለያ (አማራጭ)' : 'Telegram ID (Optional)'}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-sm text-slate-500 font-medium">@</span>
                <input
                  id="auth-tg-input"
                  type="text"
                  value={telegramId}
                  onChange={(e) => setTelegramId(e.target.value.replace('@', ''))}
                  placeholder="almaz_writer"
                  className="w-full bg-slate-950 border border-slate-800 text-sm p-3 pl-7 rounded-lg focus:outline-none focus:border-amber-500/50 text-slate-100"
                />
              </div>
            </div>

            <button
              id="auth-submit-btn"
              type="submit"
              disabled={!name || !email}
              className="w-full bg-amber-500 disabled:opacity-45 hover:bg-amber-600 disabled:hover:bg-amber-500 text-slate-950 font-bold py-3 px-4 rounded-lg transition duration-150 text-sm"
            >
              {currentLanguage === 'amh' ? 'ሂሳብ ፍጠርና ግባ' : 'Create Account & Enter'}
            </button>
          </form>

          {/* Quick Sandbox Profiles Loader */}
          <div className="border-t border-slate-900 pt-4 space-y-3">
            <p className="text-center text-[10px] text-slate-500 font-semibold tracking-wider uppercase mb-1">
              Sandbox Testing Logins (Fast Setup)
            </p>
            
            <div className="grid grid-cols-2 gap-2">
              <button
                id="sandbox-login-admin"
                type="button"
                onClick={handleQuickDemoAdmin}
                className="bg-slate-900 hover:bg-slate-850 text-white py-2.5 px-3 rounded-lg text-xs font-medium border border-slate-800 text-left flex flex-col justify-between"
              >
                <span className="text-amber-500 font-bold text-[10px] uppercase">Login Admin</span>
                <span className="truncate text-slate-350">lenaedward949@gmail.com</span>
              </button>

              <button
                id="sandbox-login-author"
                type="button"
                onClick={handleQuickDemoWriter}
                className="bg-slate-900 hover:bg-slate-850 text-white py-2.5 px-3 rounded-lg text-xs font-medium border border-slate-800 text-left flex flex-col justify-between"
              >
                <span className="text-amber-500 font-bold text-[10px] uppercase">Login Author</span>
                <span className="truncate text-slate-350">Abera Molla (Pro Author)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer Branding */}
      <footer className="text-center py-2 text-[11px] text-slate-600 font-mono z-10 select-none">
        ENGIDA v1.2.0 • Addis Ababa, Ethiopia
      </footer>
    </div>
  );
}
