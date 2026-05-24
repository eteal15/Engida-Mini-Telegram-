import React, { useState } from 'react';
import { useAppContext } from '../AppContext';
import { 
  ShieldCheck, AlertTriangle, Users, BookOpen, PenTool, TrendingUp, DollarSign, 
  ChevronDown, ChevronUp, Check, X, ShieldAlert, BadgeInfo, AlertCircle, Trash
} from 'lucide-react';

export default function AdminDashboard() {
  const {
    currentUser, currentLanguage, stories, chapters, coinTransactions, unlockTransactions,
    monetizationRequests, premiumRequests, payouts, reports, fraudLogs,
    adminApproveCoinPurchase, adminRejectCoinPurchase, adminApproveMonetization,
    adminRejectMonetization, adminSuspendMonetization, adminApprovePremium, adminRejectPremium,
    adminProcessPayout, adminModerateStory, adminSetChapterLock, adminResolveReport,
    telebirrMerchantNumber, getWriterStats
  } = useAppContext();

  // Collapsible accordion states
  const [expandedSection, setExpandedSection] = useState<string | null>('overview');

  // Manual writer payout settlement inputs
  const [selectedWriterId, setSelectedWriterId] = useState('');
  const [payoutAmount, setPayoutAmount] = useState('');
  const [payoutNotes, setPayoutNotes] = useState('');
  const [payoutSuccessMsg, setPayoutSuccessMsg] = useState('');

  const toggleSection = (section: string) => {
    setExpandedSection(prev => prev === section ? null : section);
  };

  const handleManualPayoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWriterId || !payoutAmount) return;

    adminProcessPayout(
      selectedWriterId,
      parseFloat(payoutAmount),
      'paid',
      payoutNotes || 'Settled manually via Telebirr Transfer'
    );

    setPayoutSuccessMsg('✓ Creator Payout recorded dynamically and balances adjusted! SMS/Bot alert dispatched.');
    setSelectedWriterId('');
    setPayoutAmount('');
    setPayoutNotes('');

    setTimeout(() => setPayoutSuccessMsg(''), 5000);
  };

  if (!currentUser) return null;

  // Compile calculations
  const totalReadersCount = 1840; // Simulated database count
  const totalWritersCount = monetizationRequests.length + 15;
  const activeReadersCount = 380;
  
  // Platform financial accounting:
  // Approved coin deposits total revenue in ETB
  const approvedCoinTxs = coinTransactions.filter(tx => tx.status === 'approved');
  const totalPlatformRevenue = approvedCoinTxs.reduce((acc, tx) => acc + tx.birrAmount, 0);

  // Writer coin unlocks transactions
  // 1 coin = 1 ETB platform value
  const totalUnlockValue = unlockTransactions.reduce((acc, ut) => acc + ut.amount, 0);
  const totalWriterShareValue = unlockTransactions.reduce((acc, ut) => acc + ut.writerShare, 0);
  const totalPlatformShareValue = unlockTransactions.reduce((acc, ut) => acc + ut.platformShare, 0);

  // Filter pending lists
  const pendingCoinTxs = coinTransactions.filter(tx => tx.status === 'pending');
  const pendingMonRequests = monetizationRequests.filter(req => req.status === 'pending');
  const pendingPremiumRequests = premiumRequests.filter(req => req.status === 'pending');
  const pendingReports = reports.filter(rep => rep.status === 'pending');

  return (
    <div id="admin-dashboard-canvas" className="max-w-md mx-auto px-4 py-6 font-sans text-slate-100 space-y-5">
      
      {/* Premium Dashboard Header block */}
      <div className="bg-slate-900/40 border border-white/[0.03] p-5 rounded-2xl flex items-center gap-3.5 shadow-lg">
        <div className="bg-amber-500/10 p-2.5 rounded-xl border border-transparent text-amber-400 shrink-0">
          <ShieldCheck className="w-6 h-6 stroke-[2]" />
        </div>
        <div>
          <h2 className="text-base font-extrabold tracking-tight text-white uppercase">ENGIDA BUSINESS CONTROL</h2>
          <p className="text-[10px] text-slate-400 font-mono">AUTHORIZED PERSONNEL ONLY • BACKEND PERSISTENT ADMIN</p>
        </div>
      </div>

      {/* ACCORDION SECTIONS */}

      {/* SECTION 1: OVERVIEW DASHBOARD */}
      <div className="bg-slate-900/40 border border-white/[0.03] rounded-2xl overflow-hidden shadow-md">
        <button
          id="admin-acc-overview"
          onClick={() => toggleSection('overview')}
          className="w-full px-5 py-4 flex items-center justify-between font-bold text-xs uppercase tracking-wider text-slate-200 hover:bg-slate-850/40 transition border-b border-white/[0.02]"
        >
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-amber-500" />
            <span>1. Overview Dashboard</span>
          </div>
          {expandedSection === 'overview' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {expandedSection === 'overview' && (
          <div className="p-5 space-y-4">
            {/* Quick Multi Stats block */}
            <div className="grid grid-cols-2 gap-3 text-center text-slate-200">
              <div className="bg-slate-950/40 p-3 rounded-xl border border-white/[0.02]">
                <span className="text-[9px] text-slate-500 font-bold block mb-1">TOTAL USERS</span>
                <strong className="text-xl font-extrabold">{totalReadersCount}</strong>
              </div>
              <div className="bg-slate-950/40 p-3 rounded-xl border border-white/[0.02]">
                <span className="text-[9px] text-slate-500 font-bold block mb-1">ACTIVE READERS</span>
                <strong className="text-xl font-extrabold text-amber-500">{activeReadersCount}</strong>
              </div>
              <div className="bg-slate-950/40 p-3 rounded-xl border border-white/[0.02]">
                <span className="text-[9px] text-slate-500 font-bold block mb-1">DEPOSITED REVENUE</span>
                <strong className="text-xl font-extrabold text-emerald-400">{totalPlatformRevenue} ETB</strong>
              </div>
              <div className="bg-slate-950/40 p-3 rounded-xl border border-white/[0.02]">
                <span className="text-[9px] text-slate-500 font-bold block mb-1">WRITER UNLOCKS</span>
                <strong className="text-xl font-extrabold text-amber-400">{totalUnlockValue} Coins</strong>
              </div>
            </div>

            {/* Platform indicators summaries */}
            <div className="bg-slate-950/40 p-4 rounded-xl border border-white/[0.02] text-xs text-slate-400 space-y-1.5">
              <div className="flex justify-between items-center text-[10px]">
                <span>Platform Commission (40%):</span>
                <span className="font-bold text-slate-200">{totalPlatformShareValue} Coins</span>
              </div>
              <div className="flex justify-between items-center text-[10px] border-t border-white/[0.02] pt-1.5">
                <span>Creator Earnings (60%):</span>
                <span className="font-bold text-slate-200">{totalWriterShareValue} Coins</span>
              </div>
              <div className="flex justify-between items-center text-[10px] border-t border-white/[0.02] pt-1.5">
                <span>Pending Telebirr Reviews:</span>
                <span className="text-amber-500 font-bold">{pendingCoinTxs.length} Deposits</span>
              </div>
              <div className="flex justify-between items-center text-[10px] border-t border-white/[0.02] pt-1.5">
                <span>Pending Creator Verifications:</span>
                <span className="text-amber-500 font-bold">{pendingMonRequests.length} Requests</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 2: TELEBIRR PAYMENT APPROVALS (PAYMENT APPROVAL PAGE) */}
      <div className="bg-slate-900/40 border border-white/[0.03] rounded-2xl overflow-hidden shadow-md">
        <button
          id="admin-acc-payments"
          onClick={() => toggleSection('payments')}
          className="w-full px-5 py-4 flex items-center justify-between font-bold text-xs uppercase tracking-wider text-slate-200 hover:bg-slate-850/40 transition border-b border-white/[0.02]"
        >
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-amber-500" />
            <span>2. Telebirr Coin Approvals ({pendingCoinTxs.length})</span>
          </div>
          {expandedSection === 'payments' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {expandedSection === 'payments' && (
          <div className="p-5 space-y-3">
            {pendingCoinTxs.length === 0 ? (
              <p className="text-slate-550 text-xs text-center italic py-4">No deposits waiting review.</p>
            ) : (
              pendingCoinTxs.map((tx) => (
                <div key={tx.id} className="bg-slate-950/45 p-4 rounded-xl border border-white/[0.03] space-y-3">
                  <div className="flex justify-between items-start text-xs">
                    <div>
                      <h4 className="font-bold text-slate-200">
                        {tx.type === 'subscription' ? '👑 1-Month Premium Subscription' : `Deposit Order for ${tx.coinAmount} Coins`}
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-1">Ref ID: <strong className="text-amber-400 font-mono uppercase">{tx.referenceId}</strong></p>
                    </div>
                    <span className="text-amber-400 font-black text-sm">{tx.birrAmount} ETB</span>
                  </div>

                  {/* Transaction Screenshot uploaded from user device */}
                  {tx.screenshotUrl && (
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold text-slate-500 uppercase block">Telebirr Screenshot Receipt / የክፍያ ማረጋገጫ፡</span>
                      <a 
                        href={tx.screenshotUrl} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="block w-24 h-32 rounded-lg overflow-hidden border border-white/10 hover:border-amber-500 transition relative group"
                      >
                        <img 
                          src={tx.screenshotUrl} 
                          alt="Payment Screenshot Receipt" 
                          className="w-full h-full object-cover group-hover:scale-105 transition"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-slate-950/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                          <span className="text-[8px] font-black text-white bg-slate-900/80 px-1.5 py-0.5 rounded">VIEW FULL</span>
                        </div>
                      </a>
                    </div>
                  )}

                  {/* Metadata attributes */}
                  <div className="text-[10px] space-y-1 text-slate-500 border-t border-white/[0.02] pt-2 bg-slate-900/20 p-2 rounded">
                    <div>User ID: {tx.userId}</div>
                    <div>Manual Sender Telebirr No: {tx.telebirrNumber}</div>
                    <div>Requested Time: {new Date(tx.createdAt).toLocaleString()}</div>
                  </div>

                  {/* Approve or reject buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-1.5">
                    <button
                      id={`approve-coin-${tx.id}`}
                      onClick={() => adminApproveCoinPurchase(tx.id)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-3 rounded text-xs flex items-center justify-center gap-1 transition"
                    >
                      <Check className="w-3.5 h-3.5" /> Approve Order
                    </button>
                    <button
                      id={`reject-coin-${tx.id}`}
                      onClick={() => adminRejectCoinPurchase(tx.id)}
                      className="bg-red-950/40 hover:bg-red-900/30 text-red-400 border border-red-900/30 font-semibold py-2 px-3 rounded text-xs flex items-center justify-center gap-1 transition"
                    >
                      <X className="w-3.5 h-3.5" /> Reject
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* SECTION 3: CREATOR MONETIZATION CONFORMS */}
      <div className="bg-slate-900/40 border border-white/[0.03] rounded-2xl overflow-hidden shadow-md">
        <button
          id="admin-acc-monetization"
          onClick={() => toggleSection('monetization')}
          className="w-full px-5 py-4 flex items-center justify-between font-bold text-xs uppercase tracking-wider text-slate-200 hover:bg-slate-850/40 transition border-b border-white/[0.02]"
        >
          <div className="flex items-center gap-2">
            <PenTool className="w-4 h-4 text-amber-500" />
            <span>3. Monetization Requests ({pendingMonRequests.length})</span>
          </div>
          {expandedSection === 'monetization' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {expandedSection === 'monetization' && (
          <div className="p-5 space-y-3">
            {pendingMonRequests.length === 0 ? (
              <p className="text-slate-550 text-xs text-center italic py-4">No creator requests waiting review.</p>
            ) : (
              pendingMonRequests.map((req) => (
                <div key={req.id} className="bg-slate-950 p-4 rounded-xl border border-slate-900 space-y-3 text-xs">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-white text-sm">{req.fullName}</h4>
                      <p className="text-[10px] text-slate-500">ID: {req.writerId} • Email: {req.email}</p>
                    </div>
                  </div>

                  <div className="bg-slate-900/50 p-3 rounded border border-slate-900 space-y-1.5 text-[10.5px] text-slate-400">
                    <div>Telebirr wallet to bind: <strong className="text-slate-200 font-mono">{req.telebirrNumber}</strong></div>
                    <div>Phone: <strong className="text-slate-200 font-mono">{req.phoneNumber}</strong></div>
                    <div>Requested: {new Date(req.createdAt).toLocaleDateString()}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      id={`approve-mon-${req.id}`}
                      onClick={() => adminApproveMonetization(req.id)}
                      className="bg-amber-550 hover:bg-amber-600 text-slate-950 font-black py-2.5 rounded transition uppercase tracking-wide text-[10.5px]"
                    >
                      Approve Author
                    </button>
                    <button
                      id={`reject-mon-${req.id}`}
                      onClick={() => adminRejectMonetization(req.id)}
                      className="bg-slate-900 hover:bg-slate-850 text-slate-400 border border-slate-800 py-2.5 rounded transition text-[10.5px]"
                    >
                      Reject Application
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* SECTION 4: PREMIUM CHAPTER LOCK REQUESTS */}
      <div className="bg-slate-900/40 border border-white/[0.03] rounded-2xl overflow-hidden shadow-md">
        <button
          id="admin-acc-locks"
          onClick={() => toggleSection('locks')}
          className="w-full px-5 py-4 flex items-center justify-between font-bold text-xs uppercase tracking-wider text-slate-200 hover:bg-slate-850/40 transition border-b border-white/[0.02]"
        >
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-500" />
            <span>4. Premium chapter Locks ({pendingPremiumRequests.length})</span>
          </div>
          {expandedSection === 'locks' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {expandedSection === 'locks' && (
          <div className="p-5 space-y-3">
            {pendingPremiumRequests.length === 0 ? (
              <p className="text-slate-550 text-xs text-center italic py-4">No chapter lock requests awaiting audit.</p>
            ) : (
              pendingPremiumRequests.map((req) => (
                <div key={req.id} className="bg-slate-950 p-4 rounded-xl border border-slate-900 space-y-3 text-xs">
                  <div>
                    <h4 className="font-bold text-slate-200">Story ID: {req.storyTitle}</h4>
                    <p className="text-[10px] text-slate-500">Proposed by Writer {req.writerId}</p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      id={`approve-prem-${req.id}`}
                      onClick={() => adminApprovePremium(req.id)}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-3 rounded transition text-[11px]"
                    >
                      Approve Locked Access
                    </button>
                    <button
                      id={`reject-prem-${req.id}`}
                      onClick={() => adminRejectPremium(req.id)}
                      className="flex-1 bg-slate-900 hover:bg-slate-850 text-slate-400 border border-slate-800 py-2 px-3 rounded transition text-[11px]"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* SECTION 5: REVENUE & MANUAL CREATOR PAYOUTS */}
      <div className="bg-slate-900/40 border border-white/[0.03] rounded-2xl overflow-hidden shadow-md">
        <button
          id="admin-acc-payouts"
          onClick={() => toggleSection('payouts')}
          className="w-full px-5 py-4 flex items-center justify-between font-bold text-xs uppercase tracking-wider text-slate-200 hover:bg-slate-850/40 transition border-b border-white/[0.02]"
        >
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-amber-500" />
            <span>5. Manual Telebirr Payouts Tracker</span>
          </div>
          {expandedSection === 'payouts' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {expandedSection === 'payouts' && (
          <div className="p-5 space-y-5">
            {/* Manual payout form */}
            <form onSubmit={handleManualPayoutSubmit} className="bg-slate-950/45 p-4 rounded-xl border border-white/[0.03] space-y-3.5">
              <h4 className="text-[10px] font-bold text-amber-500 uppercase tracking-wide">Record Writer Payout (Manual Transfer)</h4>

              <div>
                <label className="text-[9px] text-slate-400 font-bold block mb-1">CHOOSE AUTHOR WRITER</label>
                <select
                  required
                  value={selectedWriterId}
                  onChange={(e) => setSelectedWriterId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 text-xs p-2.5 rounded-lg text-slate-200"
                >
                  <option value="">-- Choose monetize-approved writer --</option>
                  <option value="writer_abera">Abera Molla Garedew (0911223344)</option>
                  <option value="writer_selam">Selamawit Kebede (0912345678)</option>
                </select>
              </div>

              {/* Dynamic live accounting split calculations */}
              {selectedWriterId && (
                (() => {
                  const stats = getWriterStats(selectedWriterId);
                  return (
                    <div className="bg-slate-900 border border-amber-500/25 p-3.5 rounded-xl text-xs space-y-2.5">
                      <h4 className="font-extrabold text-amber-500 text-[10px] tracking-wide uppercase">Revenue Share Calculations (60% Writer / 40% Platform)</h4>
                      
                      <div className="flex justify-between border-b border-white/[0.03] pb-1.5 text-slate-400 text-[11px]">
                        <span>Coins Unlock Share (60%):</span>
                        <span className="font-bold text-slate-200">{stats.coinEarned} ETB</span>
                      </div>
                      
                      <div className="flex justify-between border-b border-white/[0.03] pb-1.5 text-slate-400 text-[11px]">
                        <span>Premium Subscriber Reads Royalty (60%):</span>
                        <span className="font-bold text-slate-200">{stats.premiumEarned} ETB <span className="text-[10px] text-slate-500">({stats.premiumReadsCount} Views)</span></span>
                      </div>
                      
                      <div className="flex justify-between border-b border-white/[0.03] pb-1.5 text-slate-400 text-[11px]">
                        <span>Total Accumulated Wallet Earnings:</span>
                        <span className="font-bold text-emerald-400">{stats.totalEarned} ETB</span>
                      </div>
                      
                      <div className="flex justify-between border-b border-white/[0.03] pb-1.5 text-slate-400 text-[11px]">
                        <span>Platform Direct Commission (40%):</span>
                        <span className="font-bold text-slate-300">{stats.platformShare} ETB</span>
                      </div>
                      
                      <div className="flex justify-between border-b border-white/[0.03] pb-1.5 text-slate-400 text-[11px]">
                        <span>Previous Closed Payments Settled:</span>
                        <span className="font-bold text-slate-400">{stats.paidBalance} ETB</span>
                      </div>
                      
                      <div className="flex justify-between pt-1 font-bold text-xs bg-amber-500/10 p-2 rounded border border-transparent">
                        <span className="text-amber-400 uppercase tracking-tight">EXACT DIRECT PAY DUE:</span>
                        <span className="text-white font-mono text-sm">{stats.dueAmount} ETB</span>
                      </div>

                      {stats.dueAmount > 0 && (
                        <button
                          type="button"
                          onClick={() => setPayoutAmount(stats.dueAmount.toString())}
                          className="w-full bg-amber-550/20 text-amber-400 border border-amber-550/30 font-black p-2 rounded text-[10px] hover:bg-amber-550/30 transition uppercase tracking-wider block text-center"
                        >
                          ⚡ Auto-Fill Due Payout Amount ({stats.dueAmount} ETB)
                        </button>
                      )}
                    </div>
                  );
                })()
              )}

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9px] text-slate-400 font-bold block mb-1">AMOUNT (ETB)</label>
                  <input
                    id="payout-amount-input"
                    type="number"
                    required
                    value={payoutAmount}
                    onChange={(e) => setPayoutAmount(e.target.value)}
                    placeholder="e.g., 1500"
                    className="w-full bg-slate-900 border border-slate-800 text-xs p-2.5 rounded-lg text-slate-250"
                  />
                </div>
                <div>
                  <label className="text-[9px] text-slate-400 font-bold block mb-1">METHOD</label>
                  <input
                    type="text"
                    disabled
                    value="Telebirr Manual"
                    className="w-full bg-slate-900 border border-slate-850 text-xs p-2.5 rounded-lg text-slate-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[9px] text-slate-400 font-bold block mb-1">CASH TRANSFER NOTES & REF ID</label>
                <input
                  id="payout-notes-input"
                  type="text"
                  value={payoutNotes}
                  onChange={(e) => setPayoutNotes(e.target.value)}
                  placeholder="e.g., Paid via Telebirr on May 22, Ref: T12098"
                  className="w-full bg-slate-900 border border-slate-800 text-xs p-2.5 rounded-lg text-slate-100"
                />
              </div>

              {payoutSuccessMsg && (
                <p className="text-[11px] text-emerald-400 font-semibold">{payoutSuccessMsg}</p>
              )}

              <button
                id="payout-submit-btn"
                type="submit"
                disabled={!selectedWriterId || !payoutAmount}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs transition uppercase tracking-wide"
              >
                Mark Balance Paid
              </button>
            </form>

            {/* Payout records log */}
            <div className="space-y-2 text-xs">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase">Payout History Ledger</h4>
              {payouts.map((pay) => (
                <div key={pay.id} className="bg-slate-950/45 p-3.5 rounded-xl border border-white/[0.03] flex items-center justify-between">
                  <div>
                    <h5 className="font-bold text-slate-200">{pay.writerName}</h5>
                    <p className="text-[9px] text-slate-500 italic mt-0.5">{pay.notes}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-emerald-400 font-bold font-mono">-{pay.amount} ETB</span>
                    <span className="block text-[8px] font-mono text-slate-600 mt-1">{new Date(pay.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* SECTION 6: CONTENT MODERATION & USER REPORTS */}
      <div className="bg-slate-900/40 border border-white/[0.03] rounded-2xl overflow-hidden shadow-md">
        <button
          id="admin-acc-moderation"
          onClick={() => toggleSection('moderation')}
          className="w-full px-5 py-4 flex items-center justify-between font-bold text-xs uppercase tracking-wider text-slate-200 hover:bg-slate-850/40 transition border-b border-white/[0.02]"
        >
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span>6. Flagged Reports Audit ({pendingReports.length})</span>
          </div>
          {expandedSection === 'moderation' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {expandedSection === 'moderation' && (
          <div className="p-5 space-y-3">
            {pendingReports.length === 0 ? (
              <p className="text-slate-550 text-xs text-center italic py-4">All clear. No user complaints pending review.</p>
            ) : (
              pendingReports.map((rep) => (
                <div key={rep.id} className="bg-slate-950/45 p-4 rounded-xl border border-white/[0.03] space-y-3 text-xs">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-extrabold text-white text-sm">Complaint: {rep.reason}</h4>
                      <p className="text-[10px] text-red-400 uppercase font-semibold">Story: "{rep.storyTitle}"</p>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-450 p-3 rounded bg-slate-900 italic">
                    "{rep.details}"
                  </p>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      id={`moder-resolve-story-${rep.id}`}
                      onClick={() => {
                        if (confirm(`Authorize complete deletion of story "${rep.storyTitle}"?`)) {
                          adminModerateStory(rep.storyId, 'delete');
                          adminResolveReport(rep.id, 'resolved');
                        }
                      }}
                      className="bg-red-900 hover:bg-red-800 text-white font-bold py-2 rounded text-xs flex items-center justify-center gap-1.5 transition"
                    >
                      <Trash className="w-3.5 h-3.5" /> Force Delete
                    </button>
                    <button
                      id={`moder-dismiss-${rep.id}`}
                      onClick={() => adminResolveReport(rep.id, 'reviewed')}
                      className="bg-slate-900 hover:bg-slate-850 text-slate-400 border border-slate-800 py-2 rounded text-xs transition"
                    >
                      Dismiss flag
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* SECTION 7: STORY SUBMISSIONS PENDING APPROVAL */}
      <div className="bg-slate-900/40 border border-white/[0.03] rounded-2xl overflow-hidden shadow-md">
        <button
          id="admin-acc-stories"
          onClick={() => toggleSection('stories')}
          className="w-full px-5 py-4 flex items-center justify-between font-bold text-xs uppercase tracking-wider text-slate-200 hover:bg-slate-850/40 transition border-b border-white/[0.02]"
        >
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-amber-500" />
            <span>7. Stories & Ideas Pending Approval ({stories.filter(s => !s.isApproved).length})</span>
          </div>
          {expandedSection === 'stories' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {expandedSection === 'stories' && (
          <div className="p-5 space-y-3">
            {stories.filter(s => !s.isApproved).length === 0 ? (
              <p className="text-slate-550 text-xs text-center italic py-4">No story ideas or drafts waiting review.</p>
            ) : (
              stories.filter(s => !s.isApproved).map((story) => (
                <div key={story.id} className="bg-slate-950 p-4 rounded-xl border border-white/[0.03] space-y-3 text-xs">
                  <div className="flex gap-3">
                    <img 
                      src={story.coverImage} 
                      alt={story.title} 
                      className="w-16 h-24 object-cover rounded bg-slate-900 border border-white/5" 
                      referrerPolicy="no-referrer"
                    />
                    <div className="space-y-1">
                      <h4 className="font-extrabold text-white text-sm">{story.title}</h4>
                      <p className="text-[10.5px] text-amber-500 font-semibold">Author: {story.authorName}</p>
                      <div className="flex flex-wrap gap-1">
                        {story.genres.map(g => (
                          <span key={g} className="bg-slate-900 text-slate-400 text-[9px] px-1.5 py-0.5 rounded border border-white/[0.02]">{g}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <p className="text-[10.5px] text-slate-400 leading-relaxed bg-slate-900/40 p-2.5 rounded border border-white/[0.01]">
                    {story.description}
                  </p>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      id={`approve-story-${story.id}`}
                      onClick={() => adminModerateStory(story.id, 'approve')}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded text-xs transition animate-pulse"
                    >
                      Approve & Publish Story
                    </button>
                    <button
                      id={`reject-story-${story.id}`}
                      onClick={() => adminModerateStory(story.id, 'reject')}
                      className="bg-slate-900 hover:bg-slate-850 text-slate-400 border border-slate-800 py-2 rounded text-xs transition"
                    >
                      Reject Submission
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

    </div>
  );
}
