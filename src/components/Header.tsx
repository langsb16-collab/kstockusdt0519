import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Moon, Sun, Monitor, CreditCard, ChevronDown } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { useAccount } from '@/src/services/accountService';
import { cn } from '@/src/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export function Header() {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { account } = useAccount();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  const exchangeRate = 1365.20; // Shared rate baseline
  const krwTotal = account.usdtBalance * exchangeRate;

  const languages = [
    { code: 'ko', label: '한국어' },
    { code: 'en', label: 'English' },
    { code: 'ja', label: '日本語' },
    { code: 'zh', label: '中文' },
    { code: 'ru', label: 'Русский' },
    { code: 'vi', label: 'Tiếng Việt' },
    { code: 'ar', label: 'العربية' },
    { code: 'es', label: 'Español' },
  ];

  const currentLang = languages.find(l => l.code === i18n.language) || languages[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="glass-header sticky top-0 z-40 w-full h-16 flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-button-primary rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg">
          K
        </div>
        <div>
          <h1 className="font-bold text-lg tracking-tight leading-none text-text-primary">K-STOCK USDT</h1>
          <p className="text-[10px] text-text-muted mt-1 font-medium">{t('common.free_trial')}</p>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-6 premium-card px-4 py-2 border-border-soft/50 bg-bg-secondary/20">
         <div className="flex flex-col">
            <span className="text-[9px] font-black text-text-muted uppercase tracking-widest">{t('common.usdt_balance')}</span>
            <span className="text-sm font-black text-button-primary font-mono">{account.usdtBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
         </div>
         <div className="w-px h-6 bg-border-soft"></div>
         <div className="flex flex-col">
            <span className="text-[9px] font-black text-text-muted uppercase tracking-widest">{t('common.krw_equivalent')}</span>
            <span className="text-sm font-black text-text-primary font-mono">₩{krwTotal.toLocaleString()}</span>
         </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Language Selection Dropdown */}
        <div className="relative" ref={langRef}>
          <button
            onClick={() => setIsLangOpen(!isLangOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-bg-secondary/50 border border-border-soft rounded-xl text-xs font-bold text-text-primary hover:bg-bg-panel transition-all min-w-[120px] justify-between"
          >
            <div className="flex items-center gap-2">
              <Globe size={14} className="text-button-primary" />
              <span>{currentLang.label}</span>
            </div>
            <ChevronDown size={14} className={cn("transition-transform", isLangOpen && "rotate-180")} />
          </button>

          <AnimatePresence>
            {isLangOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-2 w-48 bg-bg-card border border-border-soft rounded-2xl shadow-xl overflow-hidden z-50 backdrop-blur-xl"
              >
                <div className="py-2 max-h-[300px] overflow-y-auto scrollbar-hide">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        i18n.changeLanguage(lang.code);
                        setIsLangOpen(false);
                      }}
                      className={cn(
                        "w-full text-left px-4 py-2.5 text-xs font-bold transition-colors flex items-center justify-between",
                        i18n.language === lang.code 
                          ? "bg-button-primary text-white" 
                          : "text-text-muted hover:text-text-primary hover:bg-bg-secondary"
                      )}
                    >
                      {lang.label}
                      {i18n.language === lang.code && <div className="w-1.5 h-1.5 rounded-full bg-white shadow-sm" />}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl bg-bg-secondary text-text-primary border border-border-soft hover:bg-bg-panel transition-all"
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </div>
    </header>
  );
}
