/**
 * 플랫폼 지원 국가별 통화 포맷터 (소수점 자릿수: 0)
 */
export const formatCurrency = (value: number, locale: string): string => {
  const formatterMap: Record<string, { localeStr: string; currency: string }> = {
    ko: { localeStr: 'ko-KR', currency: 'KRW' }, // 대한민국 원
    en: { localeStr: 'en-US', currency: 'USD' }, // 미국 달러
    ja: { localeStr: 'ja-JP', currency: 'JPY' }, // 일본 엔
    zh: { localeStr: 'zh-CN', currency: 'CNY' }, // 중국 위안
    ru: { localeStr: 'ru-RU', currency: 'RUB' }, // 러시아 루블
    vi: { localeStr: 'vi-VN', currency: 'VND' }, // 베트남 동
    ar: { localeStr: 'ar-AE', currency: 'AED' }, // 아랍에미리트 디르함
    es: { localeStr: 'es-ES', currency: 'EUR' }, // 스페인 유로
  };

  const config = formatterMap[locale] || { localeStr: 'en-US', currency: 'USD' };

  return new Intl.NumberFormat(config.localeStr, {
    style: 'currency',
    currency: config.currency,
    maximumFractionDigits: 0, // 소수점 단위 0으로 제한
    minimumFractionDigits: 0,
  }).format(value);
};
