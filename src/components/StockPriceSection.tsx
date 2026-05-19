import React, { useMemo } from 'react';

// 1. 플랫폼 지원 언어별 통화 포맷 사양 정의 (시니어 가이드: 확장성 확보)
interface LocaleConfig {
  localeStr: string;
  currency: string;
}

const LOCALE_CURRENCY_MAP: Record<string, LocaleConfig> = {
  ko: { localeStr: 'ko-KR', currency: 'KRW' }, // 대한민국 원
  en: { localeStr: 'en-US', currency: 'USD' }, // 미국 달러
  ja: { localeStr: 'ja-JP', currency: 'JPY' }, // 일본 엔
  zh: { localeStr: 'zh-CN', currency: 'CNY' }, // 중국 위안
  ru: { localeStr: 'ru-RU', currency: 'RUB' }, // 러시아 루블
  vi: { localeStr: 'vi-VN', currency: 'VND' }, // 베트남 동
  ar: { localeStr: 'ar-AE', currency: 'AED' }, // 아랍에미리트 디르함
  es: { localeStr: 'es-ES', currency: 'EUR' }, // 스페인 유로
};

interface StockPriceUsdtBrandingProps {
  currentPriceKrw: number; // 현재 원화 주가 (예: 78500)
  usdtKrwRate: number;     // 실시간 USDT 환율 (예: 1365.23)
  priceChangeKrw: number;  // 전일대비 변동 금액 (예: 1200)
  priceChangePercent: number; // 전일대비 변동률 (예: 1.55)
  currentLocale: string;   // 현재 플랫폼 선택 언어 코드 ('ko', 'en' 등)
}

export const StockPriceSection: React.FC<StockPriceUsdtBrandingProps> = ({
  currentPriceKrw,
  usdtKrwRate,
  priceChangeKrw,
  priceChangePercent,
  currentLocale = 'ko',
}) => {
  
  // 2. 핵심 비즈니스 로직: USDT 환산 및 포맷팅 (소수점 0자리, 세자리 콤마)
  const formattedPrices = useMemo(() => {
    // 안전한 예외 처리
    if (!usdtKrwRate || usdtKrwRate <= 0) return { krw: '₩0', usdt: '0 USDT' };

    // 환산 계산 (KRW / 환율)
    const convertedUsdt = Math.round(currentPriceKrw / usdtKrwRate);

    // 각 플랫폼 언어 설정 가져오기 (기본값 ko)
    const config = LOCALE_CURRENCY_MAP[currentLocale] || LOCALE_CURRENCY_MAP['ko'];

    // KRW 원화 포맷터
    const krwFormatter = new Intl.NumberFormat(config.localeStr, {
      style: 'currency',
      currency: 'KRW',
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    });

    // USDT용 숫자 포맷터 (세자리 콤마 및 소수점 0자리 보장)
    const usdtFormatter = new Intl.NumberFormat(config.localeStr, {
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    });

    return {
      krw: krwFormatter.format(currentPriceKrw),
      usdt: `${usdtFormatter.format(convertedUsdt)} USDT`,
    };
  }, [currentPriceKrw, usdtKrwRate, currentLocale]);

  // 변동률 양수/음수 스타일에 따른 UX 분기
  const isPositive = priceChangeKrw >= 0;
  const changeColorClass = isPositive ? 'text-emerald-500' : 'text-rose-500';

  return (
    <div className="flex flex-col items-end justify-center font-sans">
      {/* 주가 표시 컨테이너 */}
      <div className="flex items-baseline gap-3">
        {/* [UX 개선 반영된 영역]: 새로 추가된 테더(USDT) 비교 가격 */}
        <span className="text-xl font-medium text-slate-400 dark:text-slate-500 transition-colors duration-200">
          {formattedPrices.usdt}
        </span>
        
        {/* 구분선 (Visual Divider) */}
        <span className="text-lg text-slate-300 dark:text-slate-700">/</span>

        {/* 메인 KRW 가격 */}
        <span className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
          {formattedPrices.krw}
        </span>
      </div>

      {/* 하단 변동래벨 (기존 대비 레이아웃 유지) */}
      <div className={`mt-1 text-sm font-semibold ${changeColorClass}`}>
        {isPositive ? '+' : ''}
        {Math.abs(priceChangeKrw).toLocaleString()} ({isPositive ? '+' : ''}
        {priceChangePercent.toFixed(2)}%)
      </div>
    </div>
  );
};

export default StockPriceSection;
