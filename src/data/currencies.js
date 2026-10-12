export const CURRENCIES = [
  { code: 'EUR', label: 'Euro', symbol: '€', locale: 'fr-FR' },
  { code: 'USD', label: 'Dollar américain', symbol: '$', locale: 'en-US' },
  { code: 'XOF', label: 'Franc CFA (BCEAO)', symbol: 'FCFA', locale: 'fr-FR' },
  { code: 'MAD', label: 'Dirham marocain', symbol: 'DH', locale: 'fr-MA' },
  { code: 'JPY', label: 'Yen japonais', symbol: '¥', locale: 'ja-JP' },
  { code: 'CNY', label: 'Yuan chinois', symbol: '¥', locale: 'zh-CN' },
  { code: 'NGN', label: 'Naira nigérian', symbol: '₦', locale: 'en-NG' },
  { code: 'GBP', label: 'Livre sterling', symbol: '£', locale: 'en-GB' },
  { code: 'XAF', label: 'Franc CFA (BEAC)', symbol: 'FCFA', locale: 'fr-CM' },
  { code: 'DZD', label: 'Dinar algérien', symbol: 'DA', locale: 'fr-DZ' },
];

export const getCurrencyByCode = (code) =>
  CURRENCIES.find((cur) => cur.code === code) || CURRENCIES[0];