export const CURRENCIES = [
  { code: 'EUR', label: 'Euro', symbol: '€', locale: 'fr-FR' },
  { code: 'USD', label: 'Dollar américain', symbol: '$', locale: 'en-US' },
  { code: 'XOF', label: 'Franc CFA (BCEAO)', symbol: 'FCFA', locale: 'fr-FR' },
  { code: 'MAD', label: 'Dirham marocain', symbol: 'DH', locale: 'fr-MA' },
  { code: 'JPY', label: 'Yen japonais', symbol: '¥', locale: 'ja-JP' },
  { code: 'CNY', label: 'Yuan chinois', symbol: '¥', locale: 'zh-CN' },
];

export const getCurrencyByCode = (code) =>
  CURRENCIES.find((cur) => cur.code === code) || CURRENCIES[0];