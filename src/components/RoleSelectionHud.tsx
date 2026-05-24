import React, { useState } from 'react';
import { useAppContext } from '../AppContext';
import { Shield, BookOpen, PenTool, Flame, RefreshCw, Smartphone, Database } from 'lucide-react';
import firebaseConfig from '../../firebase-applet-config.json';

export default function RoleSelectionHud() {
  const { currentUser, changeUserRole, currentLanguage, clearAllState } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);

  if (!currentUser) return null;

  const isMockFirebase = firebaseConfig.apiKey.includes('MockAPIKeyPlaceHolder');

  return (
    <div id="role-selector-hud" className="bg-slate-900 border-b border-amber-500/30 text-white shadow-md z-50 sticky top-0">
      <div className="max-w-md mx-auto px-4 py-2 flex items-center justify-between">
        
        {/* Active Badge Info & Firebase Synced status */}
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] text-slate-300 font-medium whitespace-nowrap">
              {currentLanguage === 'amh' ? 'ገባሪ ሚና' : 'Active Duty'}:
            </span>
            <span className="text-[9px] px-1.5 py-0.2 rounded-full font-bold uppercase tracking-wider flex items-center gap-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20">
              {currentUser.role === 'admin' && <Shield className="w-2.5 h-2.5 text-amber-400" />}
              {currentUser.role === 'writer' && <PenTool className="w-2.5 h-2.5 text-amber-400" />}
              {currentUser.role === 'reader' && <BookOpen className="w-2.5 h-2.5 text-amber-400" />}
              {currentUser.role}
            </span>
          </div>

          {/* Secure Firebase Synchronization Status Indicator */}
          <div className="flex items-center gap-1 mt-0.5">
            <Database className="w-2.5 h-2.5 text-orange-500" />
            <span className="text-[8px] text-slate-400 font-mono tracking-tight font-semibold uppercase">
              {isMockFirebase 
                ? '🔥 Firebase Local Sandbox Sync' 
                : `🔥 Firestore Live [${firebaseConfig.projectId}]`}
            </span>
          </div>
        </div>

        {/* HUD control switcher */}
        <div className="flex items-center gap-2">
          {isOpen ? (
            <button
              id="hud-close-btn"
              onClick={() => setIsOpen(false)}
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 transition"
            >
              [ {currentLanguage === 'amh' ? 'ዝጋ' : 'Hide Controls'} ]
            </button>
          ) : (
            <button
              id="hud-open-btn"
              onClick={() => setIsOpen(true)}
              className="text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/35 hover:bg-amber-500/20 px-2.5 py-1 rounded-md transition flex items-center gap-1"
            >
              <Smartphone className="w-3 h-3" />
              {currentLanguage === 'amh' ? 'ሚና ቀይር (ቀለል ያለ)' : 'Role Switcher'}
            </button>
          )}

          <button
            id="hud-reset-btn"
            onClick={() => {
              if (window.confirm("Reset all local sandbox databases to defaults?")) {
                clearAllState();
                window.location.reload();
              }
            }}
            title="Reset DB"
            className="text-slate-400 hover:text-red-400 p-1 rounded hover:bg-slate-800 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {isOpen && (
        <div id="hud-options-drawer" className="bg-slate-950 border-t border-slate-900 p-3 max-w-md mx-auto">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide mb-2 text-center">
            {currentLanguage === 'amh' ? 'ለመፈተሽ የሚፈልጉትን ሁኔታ ይምረጡ' : 'Select a persona to explore corresponding views'}
          </p>
          
          <div className="grid grid-cols-3 gap-2">
            <button
              id="role-hud-reader"
              onClick={() => {
                changeUserRole('reader');
                setIsOpen(false);
              }}
              className={`py-2 px-1 text-center rounded-lg text-xs font-bold transition flex flex-col items-center gap-1 ${
                currentUser.role === 'reader'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-850 border border-slate-800'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Reader 👓</span>
            </button>

            <button
              id="role-hud-writer"
              onClick={() => {
                changeUserRole('writer');
                setIsOpen(false);
              }}
              className={`py-2 px-1 text-center rounded-lg text-xs font-bold transition flex flex-col items-center gap-1 ${
                currentUser.role === 'writer'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-850 border border-slate-800'
              }`}
            >
              <PenTool className="w-4 h-4" />
              <span>Author ✍️</span>
            </button>

            <button
              id="role-hud-admin"
              onClick={() => {
                changeUserRole('admin');
                setIsOpen(false);
              }}
              className={`py-2 px-1 text-center rounded-lg text-xs font-bold transition flex flex-col items-center gap-1 ${
                currentUser.role === 'admin'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-850 border border-slate-800'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Admin 🛡️</span>
            </button>
          </div>
          
          <p className="text-[9px] text-slate-500 mt-2 text-center italic">
            * Administrators can view premium stories for free and manage transactions, monetizations, and fraud detections.
          </p>
        </div>
      )}
    </div>
  );
}
