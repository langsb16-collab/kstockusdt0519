import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  TrendingUp, TrendingDown, Wallet, ArrowUpRight, 
  Search, Bell, Plus, Minus, CreditCard, RefreshCw 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { K_STOCKS, type Stock } from '@/src/services/stockService';
import { useAccount } from '@/src/services/accountService';
import { SimulatedChart } from './SimulatedChart';
import { cn } from '@/src/lib/utils';

import { StockPriceSection } from './StockPriceSection';
import { formatCurrency } from '@/src/services/currencyService';

export function Dashboard() {
  const { t, i18n } = useTranslation();
  const { account, buyStock, sellStock, deposit, withdraw } = useAccount();
  const [selectedStock, setSelectedStock] = useState<Stock>(K_STOCKS[0]);
  const [exchangeRate, setExchangeRate] = useState(1365.20);
  const [stocks, setStocks] = useState(K_STOCKS);
  const [aiAnalysis, setAiAnalysis] = useState('Analyzing market sentiment...');
  const [searchQuery, setSearchQuery] = useState('');
  const [orderQty, setOrderQty] = useState(1);

  useEffect(() => {
    // Simulate periodic AI insights using translation keys
    const analysisOptions = [
      'ai.bullish',
      'ai.bearish',
      'ai.neutral',
      'ai.bullish',
      'ai.neutral'
    ];
    const key = analysisOptions[Math.floor(Math.random() * analysisOptions.length)];
    setAiAnalysis(t(key));
  }, [exchangeRate, i18n.language, t]);

  const filteredStocks = stocks.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.code.includes(searchQuery)
  );

  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [transactionAmount, setTransactionAmount] = useState('100');

  const handleTrade = (type: 'BUY' | 'SELL') => {
    if (type === 'BUY') {
      const res = buyStock(selectedStock, orderQty, exchangeRate);
      if (!res.success) alert(t(res.reason));
    } else {
      const res = sellStock(selectedStock, orderQty, exchangeRate);
      if (!res.success) alert(t(res.reason));
    }
  };

  const handleDeposit = () => {
    const val = parseFloat(transactionAmount);
    if (!isNaN(val) && val > 0) {
      deposit(val);
      setIsDepositModalOpen(false);
      setTransactionAmount('100');
    }
  };

  const handleWithdraw = () => {
    const val = parseFloat(transactionAmount);
    if (!isNaN(val) && val > 0) {
      if (withdraw(val)) {
        setIsWithdrawModalOpen(false);
        setTransactionAmount('100');
      } else {
        alert(t('common.insufficient_balance'));
      }
    }
  };

  // Simulate price changes
  useEffect(() => {
    const interval = setInterval(() => {
      setStocks(prev => prev.map(s => {
        const change = (Math.random() - 0.5) * 500;
        const newPrice = Math.max(100, s.price + change);
        return {
          ...s,
          price: newPrice,
          change: newPrice - K_STOCKS.find(ks => ks.id === s.id)!.price,
          changePercent: ((newPrice - K_STOCKS.find(ks => ks.id === s.id)!.price) / K_STOCKS.find(ks => ks.id === s.id)!.price) * 100
        };
      }));
      setExchangeRate(prev => prev + (Math.random() - 0.5) * 0.1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const [news] = useState([
    "news.item_1",
    "news.item_2",
    "news.item_3"
  ]);

  return (
    <div className="p-4 space-y-4 max-w-full mx-auto h-[calc(100vh-64px)] flex flex-col">
      {/* Top Stats - Compact row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 shrink-0">
        <motion.div 
          whileHover={{ scale: 1.01 }}
          className="premium-card p-4 flex items-center justify-between"
        >
          <div>
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">{t('common.balance')}</p>
            <h2 className="text-xl font-black text-text-primary kpi-number">
              {account.usdtBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })} <span className="text-[10px] text-text-muted">USDT</span>
            </h2>
          </div>
          <Wallet size={20} className="text-button-primary" />
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.01 }}
          className="premium-card p-4 flex items-center justify-between"
        >
          <div>
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">{t('common.realtime_exchange')}</p>
            <h2 className="text-xl font-black text-text-primary kpi-number">
              {exchangeRate.toFixed(2)}
            </h2>
          </div>
          <TrendingUp size={20} className="text-tiffany-blue" />
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.01 }}
          className="premium-card p-4 col-span-2 flex items-center justify-between"
        >
           <div className="flex-1 pr-4 border-r border-border-soft">
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">{t('common.ai_recommend')}</p>
              <h3 className="text-sm font-bold text-text-primary truncate">
                {t('stocks.' + selectedStock.code, selectedStock.name)} <span className="text-[10px] text-text-muted">({selectedStock.code})</span>
              </h3>
              <p className="text-[10px] text-green-500 font-bold mt-0.5">{t('ai.accuracy_label')}: 94.2%</p>
           </div>
           <div className="flex-1 pl-4 h-8 flex flex-col justify-center">
              <SimulatedChart h={30} />
           </div>
        </motion.div>
      </div>

      {/* Main 3-Column Grid */}
      <div className="flex-1 grid grid-cols-1 xl:grid-cols-[280px_1fr_320px] gap-4 min-h-0">
        
        {/* Left Sidebar: Ranking & News */}
        <aside className="hidden xl:flex flex-col gap-4 min-h-0">
          <div className="premium-card flex-1 flex flex-col min-h-0">
            <div className="p-3 border-b border-border-soft flex items-center justify-between bg-bg-secondary/20">
              <h3 className="text-xs font-bold flex items-center gap-2">
                <RefreshCw size={14} className="text-button-primary" />
                {t('common.stock_ranking')}
              </h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={12} />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('common.search')}
                  className="pl-8 pr-3 py-1 bg-bg-input border border-border-soft rounded-full text-[10px] focus:ring-1 focus:ring-button-primary outline-none text-text-primary w-32"
                />
              </div>
            </div>
            <div className="overflow-y-auto flex-1 scrollbar-hide py-2">
              {filteredStocks.map((stock) => (
                <div 
                  key={stock.id}
                  onClick={() => setSelectedStock(stock)}
                  className={cn(
                    "px-4 py-2 flex items-center justify-between cursor-pointer hover:bg-button-primary/5 transition-colors border-b border-border-soft/30 last:border-0",
                    selectedStock.id === stock.id && "bg-button-primary/5 border-l-2 border-l-button-primary"
                  )}
                >
                  <div className="flex flex-col">
                    <span className="text-xs font-bold truncate w-24">{t('stocks.' + stock.code, stock.name)}</span>
                    <span className="text-[9px] text-text-muted">{stock.code}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-mono font-bold">{formatCurrency(stock.price, i18n.language)}</div>
                    <div className={cn("text-[9px] font-bold", stock.change >= 0 ? "text-green-500" : "text-red-500")}>
                      {stock.change >= 0 ? "+" : ""}{stock.changePercent.toFixed(2)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="premium-card h-48 p-4 flex flex-col gap-2">
            <h3 className="text-xs font-bold border-b border-border-soft pb-2">{t('common.news')}</h3>
            <div className="flex-1 overflow-y-auto scrollbar-hide space-y-3">
              {news.map((n, i) => (
                <div key={i} className="text-[11px] leading-relaxed text-text-secondary border-b border-border-soft/20 pb-1 last:border-0 italic">
                  • {t(n)}
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Center Panel: Active Stock & Chart/History */}
        <main className="flex flex-col gap-4 min-h-0">
          <section className="premium-card flex-1 p-6 flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-black tracking-tighter">{t('stocks.' + selectedStock.code, selectedStock.name)}</h2>
                <p className="text-xs font-bold text-text-muted">{selectedStock.code}.KS</p>
                <div className="mt-2 text-[11px] text-text-muted italic bg-bg-secondary/50 p-2 rounded-lg border border-border-soft/50 max-w-md">
                  {t('ai.title')}: "{aiAnalysis}"
                </div>
              </div>
              <StockPriceSection 
                currentPriceKrw={selectedStock.price}
                usdtKrwRate={exchangeRate}
                priceChangeKrw={selectedStock.change}
                priceChangePercent={selectedStock.changePercent}
                currentLocale={i18n.language}
              />
            </div>
            
            <div className="flex-1 min-h-[200px] mb-4 bg-bg-secondary/10 rounded-2xl border border-border-soft/30 overflow-hidden relative">
              <SimulatedChart h={300} />
            </div>

            <div className="h-32 premium-card bg-bg-secondary/20 p-4 scrollbar-hide overflow-y-auto">
              <h4 className="text-[10px] font-black uppercase text-text-muted mb-3 tracking-widest">{t('common.execution_history')}</h4>
              <div className="space-y-2">
                {account.history.length > 0 ? account.history.map((h, i) => (
                  <div key={h.id} className="flex justify-between items-center text-[10px] font-bold text-text-primary border-b border-border-soft/30 pb-1">
                    <span className={cn(h.type === 'BUY' || h.type === 'DEPOSIT' ? "text-green-500" : "text-red-500")}>
                      {h.type === 'BUY' ? t('common.buy') : h.type === 'SELL' ? t('common.sell') : h.type === 'DEPOSIT' ? t('common.deposit') : t('common.withdraw')}
                    </span>
                    <span className="font-mono text-text-secondary">{t('stocks.' + h.symbol, h.symbol)}</span>
                    <span className="font-mono">{formatCurrency(h.price, i18n.language)}</span>
                    <span className="text-text-muted">{h.quantity} {t('common.qty')}</span>
                    <span className="text-[8px] opacity-50 font-medium">{new Date(h.timestamp).toLocaleTimeString()}</span>
                  </div>
                )) : (
                  <div className="text-[10px] text-text-muted text-center py-4 italic">{t('common.no_history')}</div>
                )}
              </div>
            </div>
          </section>
        </main>

        {/* Right Panel: Order Book & Trading */}
        <aside className="flex flex-col gap-4 min-h-0">
          <div className="premium-card h-[320px] flex flex-col min-h-0">
             <div className="p-3 border-b border-border-soft bg-bg-secondary/20 shrink-0">
               <h3 className="text-xs font-bold">{t('common.order_book')}</h3>
             </div>
             <div className="flex-1 overflow-y-auto scrollbar-hide">
               {[...Array(10)].map((_, i) => (
                 <div key={i} className={cn(
                   "relative h-7 flex items-center px-3 border-b border-border-soft/10",
                   i < 5 ? "bg-red-500/[0.03]" : "bg-blue-500/[0.03]"
                 )}>
                   <div className={cn(
                     "absolute right-0 top-0 bottom-0 opacity-10",
                     i < 5 ? "bg-red-400" : "bg-blue-400"
                   )} style={{ width: `${Math.random() * 100}%` }}></div>
                   <span className="text-[10px] font-mono font-bold w-full flex justify-between z-10">
                     <span className={i < 5 ? "text-red-500/80" : "text-blue-500/80"}>{formatCurrency(selectedStock.price - (i-5)*100, i18n.language)}</span>
                     <span className="text-text-primary">{Math.floor(Math.random() * 2000)}</span>
                   </span>
                 </div>
               ))}
             </div>
          </div>

          <div className="premium-card flex-1 p-5 flex flex-col gap-4">
             <div className="flex gap-1 bg-bg-secondary/50 p-1 rounded-xl">
               <button className="flex-1 py-1.5 text-[10px] font-black bg-button-primary text-white rounded-lg transition-all">{t('common.buy')}</button>
               <button className="flex-1 py-1.5 text-[10px] font-black text-text-muted hover:text-text-primary transition-all">{t('common.sell')}</button>
             </div>

             <div className="space-y-3">
               <div>
                 <label className="text-[9px] font-bold text-text-muted uppercase mb-1 block">
                   {t('common.qty')} 
                   <span className="float-right lowercase">{t('common.holding')} {account.holdings.find(h => h.code === selectedStock.code)?.quantity || 0}</span>
                 </label>
                 <div className="flex items-center bg-bg-input border border-border-soft rounded-xl px-3 py-2">
                   <button 
                    onClick={() => setOrderQty(q => Math.max(1, q - 1))}
                    className="p-1 hover:text-button-primary"><Minus size={14} /></button>
                   <input 
                    type="number" 
                    value={orderQty}
                    onChange={(e) => setOrderQty(Math.max(1, parseInt(e.target.value) || 1))}
                    className="flex-1 text-center font-bold text-sm bg-transparent outline-none text-text-primary" 
                   />
                   <button 
                    onClick={() => setOrderQty(q => q + 1)}
                    className="p-1 hover:text-button-primary"><Plus size={14} /></button>
                 </div>
               </div>

               <div className="pt-4 border-t border-border-soft">
                  <div className="flex justify-between text-[11px] font-bold mb-1">
                     <span className="text-text-muted">{t('common.est_total_krw')}</span>
                     <span className="text-text-primary">{formatCurrency(selectedStock.price * orderQty, i18n.language)}</span>
                  </div>
                  <div className="flex justify-between text-[11px] font-bold mb-4">
                     <span className="text-text-muted">{t('common.est_cost_usdt')}</span>
                     <span className="text-button-primary font-black">{(selectedStock.price * orderQty / exchangeRate).toFixed(2)} USDT</span>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleTrade('BUY')}
                      className="flex-1 py-3 bg-green-500 text-white text-[10px] font-black rounded-xl shadow-lg shadow-green-500/20 hover:scale-[1.02] active:scale-95 transition-all">
                      {t('common.buy').toUpperCase()}
                    </button>
                    <button 
                      onClick={() => handleTrade('SELL')}
                     className="flex-1 py-3 bg-red-500 text-white text-[10px] font-black rounded-xl shadow-lg shadow-red-500/20 hover:scale-[1.02] active:scale-95 transition-all">
                     {t('common.sell').toUpperCase()}
                    </button>
                  </div>
               </div>
             </div>

             <div className="mt-auto grid grid-cols-2 gap-3">
                <button 
                  onClick={() => setIsDepositModalOpen(true)}
                  className="bg-bg-panel p-2 rounded-xl flex flex-col items-center gap-1 border border-border-soft/50 hover:bg-bg-secondary transition-colors"
                >
                  <Plus size={16} className="text-button-primary" />
                  <span className="text-[9px] font-bold">{t('common.deposit')}</span>
                </button>
                <button 
                  onClick={() => setIsWithdrawModalOpen(true)}
                  className="bg-bg-panel p-2 rounded-xl flex flex-col items-center gap-1 border border-border-soft/50 hover:bg-bg-secondary transition-colors"
                >
                  <Minus size={16} className="text-red-500" />
                  <span className="text-[9px] font-bold">{t('common.withdraw')}</span>
                </button>
             </div>
          </div>
        </aside>
      </div>
      {/* Transaction Modals */}
      <AnimatePresence>
        {(isDepositModalOpen || isWithdrawModalOpen) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsDepositModalOpen(false);
                setIsWithdrawModalOpen(false);
              }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm premium-card p-6 bg-bg-card border-button-primary/20"
            >
              <h3 className="text-xl font-black mb-4">
                {isDepositModalOpen ? t('common.deposit') : t('common.withdraw')} USDT
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-text-muted uppercase mb-1 block">{t('common.balance')} (USDT)</label>
                  <input
                    type="number"
                    value={transactionAmount}
                    onChange={(e) => setTransactionAmount(e.target.value)}
                    className="w-full bg-bg-input border border-border-soft rounded-xl px-4 py-3 font-mono font-bold text-lg focus:ring-2 focus:ring-button-primary outline-none"
                    autoFocus
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => {
                      setIsDepositModalOpen(false);
                      setIsWithdrawModalOpen(false);
                    }}
                    className="flex-1 py-3 px-4 bg-bg-secondary text-text-muted font-bold rounded-xl hover:bg-bg-panel transition-all"
                  >
                    {t('common.cancel')}
                  </button>
                  <button
                    onClick={isDepositModalOpen ? handleDeposit : handleWithdraw}
                    className={cn(
                      "flex-1 py-3 px-4 text-white font-black rounded-xl shadow-lg transition-all",
                      isDepositModalOpen ? "bg-button-primary shadow-button-primary/20" : "bg-red-500 shadow-red-500/20"
                    )}
                  >
                    {isDepositModalOpen ? t('common.deposit').toUpperCase() : t('common.withdraw').toUpperCase()}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
