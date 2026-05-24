import React, { useState } from 'react';
import { useAppContext } from '../AppContext';
import { TRANSLATIONS } from '../translations';
import { COIN_PACKAGES, TELEBIRR_MERCHANT_NUMBER } from '../data';
import { Coins, ChevronRight, Phone, Landmark, AlertCircle, CheckCircle, FileText, Send } from 'lucide-react';

export default function CoinWallet() {
  const { 
    currentUser, currentLanguage, coinTransactions, submitCoinPurchase, telebirrMerchantNumber
  } = useAppContext();

  const t = TRANSLATIONS[currentLanguage];

  // Manual payment state
  const [selectedPackage, setSelectedPackage] = useState<typeof COIN_PACKAGES[1]>(COIN_PACKAGES[1]); // Default 50 coins package
  const [refId, setRefId] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handlePurchaseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!refId.trim() || !userPhone.trim()) return;

    submitCoinPurchase(
      selectedPackage.coins,
      selectedPackage.price,
      refId.trim().toUpperCase(),
      userPhone.trim()
    );

    setSuccessMessage('✓ Deposit reference submitted! Admin will verify and credit your coins within minutes.');
    setRefId('');
    setUserPhone('');

    setTimeout(() => {
      setSuccessMessage('');
    }, 6000);
  };

  if (!currentUser) return null;

  // Filter user's transactions
  const userTransactions = coinTransactions.filter(tx => tx.userId === currentUser.id);

  return (
    <div id="coin-wallet-hub" className="max-w-md mx-auto px-4 py-6 font-sans text-slate-100 space-y-6">
      
      {/* Golden Wallet Header Card */}
      <div className="bg-gradient-to-br from-amber-600 to-amber-800 rounded-2xl p-6 shadow-xl relative overflow-hidden border border-white/10">
        <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-amber-500/10 rounded-full blur-2xl" />
        
        <div className="space-y-1">
          <p className="text-[11px] text-amber-200/80 font-bold uppercase tracking-wider">{t.coinWallet}</p>
          <div className="flex items-center gap-2.5">
            <Coins className="w-8 h-8 text-amber-200" />
            <h2 className="text-4xl font-extrabold tracking-tight text-white mb-0.5">{currentUser.coins}</h2>
            <span className="text-sm text-yellow-100 font-semibold bg-white/15 px-2.5 py-0.5 rounded-full z-10">Coins</span>
          </div>
          <p className="text-[10px] text-amber-100/70 pt-1 italic">
            Use coins to permanently unlock chapter releases on ENGIDA.
          </p>
        </div>
      </div>

      {/* Select Coin Package */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          1. {currentLanguage === 'amh' ? 'ጥቅል ይምረጡ' : 'Select Coin Bundle'}
        </h3>
        
        <div className="grid grid-cols-1 gap-2.5">
          {COIN_PACKAGES.map((pkg, index) => (
            <button
              id={`pkg-btn-${index}`}
              key={index}
              onClick={() => setSelectedPackage(pkg)}
              className={`p-4 rounded-xl border text-left transition flex items-center justify-between ${
                selectedPackage.coins === pkg.coins
                  ? 'bg-amber-500/10 border-amber-500/50 text-white'
                  : 'bg-slate-900/40 border-white/[0.03] text-slate-300 hover:bg-slate-900/80'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                  selectedPackage.coins === pkg.coins ? 'bg-amber-550 text-slate-950 font-extrabold' : 'bg-slate-800 text-amber-500'
                }`}>
                  🪙
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-200">{pkg.coins} Coins</h4>
                  <p className="text-[10px] text-slate-400">{pkg.description}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-black text-amber-500">{pkg.price} ETB</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Telebirr Instructions */}
      <div className="bg-slate-900/45 border border-white/[0.03] p-5 rounded-2xl space-y-4 shadow-md">
        <h3 className="text-xs font-extrabold text-amber-500 uppercase tracking-widest flex items-center gap-2">
          <Landmark className="w-4 h-4 text-amber-500" />
          <span>2. Manual Telebirr Transfer</span>
        </h3>

        <p className="text-xs text-slate-300 leading-relaxed">
          {t.telebirrInstruction}
        </p>

        {/* Highlighted Merchant specs */}
        <div className="bg-slate-950/60 p-4 rounded-xl border border-white/[0.03] space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500">{t.merchantLabel}:</span>
            <strong className="text-slate-200 font-bold">ENGIDA Entertainment</strong>
          </div>
          <div className="flex justify-between items-center text-xs border-t border-white/[0.02] pt-2">
            <span className="text-slate-500">Telebirr Account (Merchant Number):</span>
            <span className="text-amber-500 font-mono text-xs font-black flex items-center gap-1.5 bg-amber-500/5 px-2.5 py-0.5 rounded border border-white/[0.02]">
              <Phone className="w-3.5 h-3.5 text-amber-500" />
              {telebirrMerchantNumber}
            </span>
          </div>
          <div className="flex justify-between items-center text-xs border-t border-white/[0.02] pt-2">
            <span className="text-slate-500">Amount Due / የሚከፈልበት የብር መጠን:</span>
            <strong className="text-amber-500 text-sm font-black">{selectedPackage.price} ETB</strong>
          </div>
        </div>

        {/* Submission Ref Form */}
        <form onSubmit={handlePurchaseSubmit} className="space-y-3 pt-2">
          <div>
            <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase">
              {t.telegramNoInput} (Required)
            </label>
            <input
              id="wallet-phone-input"
              type="text"
              required
              value={userPhone}
              onChange={(e) => setUserPhone(e.target.value.replace(/\D/g, ''))}
              placeholder="e.g., 0911223344"
              className="w-full bg-slate-950 border border-slate-800 text-xs p-3 rounded-lg focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 block mb-1 uppercase">
              {t.referenceInput} (Required)
            </label>
            <input
              id="wallet-ref-input"
              type="text"
              required
              value={refId}
              onChange={(e) => setRefId(e.target.value)}
              placeholder="e.g., TXN1209384"
              className="w-full bg-slate-950 border border-slate-800 text-xs p-3 rounded-lg focus:outline-none focus:border-amber-500 uppercase text-slate-100"
            />
          </div>

          <div className="text-[10px] text-slate-500 flex items-start gap-1.5 leading-relaxed bg-slate-950/40 p-2.5 rounded border border-white/[0.02]">
            <AlertCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <span>
              Anti-Fraud Protection: Entering spoofed or fake Reference IDs without real Telebirr transactions results in automatic suspension from monetization and reporting.
            </span>
          </div>

          {successMessage && (
            <p className="text-xs bg-emerald-900/30 text-emerald-400 border border-emerald-900/40 rounded-xl py-3 px-4 font-semibold">
              {successMessage}
            </p>
          )}

          <button
            id="wallet-submit-ref-btn"
            type="submit"
            disabled={!refId || !userPhone}
            className="w-full bg-amber-500 disabled:opacity-45 hover:bg-amber-600 disabled:hover:bg-amber-500 text-slate-950 font-bold py-3.5 px-4 rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{t.submitPayment}</span>
          </button>
        </form>
      </div>

      {/* Transaction History */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Deposit Request Logs ({userTransactions.length})
        </h3>
        
        {userTransactions.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-4 italic border border-slate-900 rounded-2xl bg-slate-950">
            No coin purchases logged yet.
          </p>
        ) : (
          <div className="space-y-2">
            {userTransactions.map((tx) => (
              <div key={tx.id} className="bg-slate-900/40 border border-white/[0.03] p-3 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${
                    tx.status === 'approved' ? 'bg-emerald-950 border border-emerald-990 text-emerald-400' :
                    tx.status === 'rejected' ? 'bg-red-950 border border-red-990 text-red-400' :
                    'bg-slate-950 border border-slate-850 text-amber-500'
                  }`}>
                    {tx.status === 'approved' ? '✓' : tx.status === 'rejected' ? '✗' : '...'}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-200">🪙 {tx.coinAmount} Coins ({tx.birrAmount} ETB)</h5>
                    <p className="text-[10px] text-slate-500 font-mono">Ref: {tx.referenceId}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full ${
                    tx.status === 'approved' ? 'bg-emerald-900/40 text-emerald-400' :
                    tx.status === 'rejected' ? 'bg-red-900/40 text-red-400' : 'bg-slate-900 text-amber-400'
                  }`}>
                    {tx.status}
                  </span>
                  <p className="text-[9px] text-slate-600 font-mono mt-1">
                    {new Date(tx.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
