export const CURRENCIES = [
  // African Currencies
  { code: 'KES', name: 'Kenyan Shilling', flag: '🇰🇪', symbol: 'KSh' },
  { code: 'UGX', name: 'Ugandan Shilling', flag: '🇺🇬', symbol: 'USh' },
  { code: 'TZS', name: 'Tanzanian Shilling', flag: '🇹🇿', symbol: 'TSh' },
  { code: 'RWF', name: 'Rwandan Franc', flag: '🇷🇼', symbol: 'RF' },
  { code: 'ETB', name: 'Ethiopian Birr', flag: '🇪🇹', symbol: 'Br' },
  { code: 'NGN', name: 'Nigerian Naira', flag: '🇳🇬', symbol: '₦' },
  { code: 'GHS', name: 'Ghanaian Cedi', flag: '🇬🇭', symbol: '₵' },
  { code: 'ZAR', name: 'South African Rand', flag: '🇿🇦', symbol: 'R' },
  { code: 'EGP', name: 'Egyptian Pound', flag: '🇪🇬', symbol: 'E£' },
  { code: 'MAD', name: 'Moroccan Dirham', flag: '🇲🇦', symbol: 'د.م' },
  { code: 'XOF', name: 'West African CFA Franc', flag: '🌍', symbol: 'CFA' },
  { code: 'ZMW', name: 'Zambian Kwacha', flag: '🇿🇲', symbol: 'ZK' },
  { code: 'BWP', name: 'Botswana Pula', flag: '🇧🇼', symbol: 'P' },
  { code: 'MZN', name: 'Mozambican Metical', flag: '🇲🇿', symbol: 'MT' },
  { code: 'TND', name: 'Tunisian Dinar', flag: '🇹🇳', symbol: 'د.ت' },
  // Major World Currencies
  { code: 'USD', name: 'US Dollar', flag: '🇺🇸', symbol: '$' },
  { code: 'EUR', name: 'Euro', flag: '🇪🇺', symbol: '€' },
  { code: 'GBP', name: 'British Pound', flag: '🇬🇧', symbol: '£' },
  { code: 'AED', name: 'UAE Dirham', flag: '🇦🇪', symbol: 'د.إ' },
  { code: 'CNY', name: 'Chinese Yuan', flag: '🇨🇳', symbol: '¥' },
  { code: 'INR', name: 'Indian Rupee', flag: '🇮🇳', symbol: '₹' },
  { code: 'JPY', name: 'Japanese Yen', flag: '🇯🇵', symbol: '¥' },
  { code: 'CAD', name: 'Canadian Dollar', flag: '🇨🇦', symbol: 'C$' },
  { code: 'AUD', name: 'Australian Dollar', flag: '🇦🇺', symbol: 'A$' },
  { code: 'SAR', name: 'Saudi Riyal', flag: '🇸🇦', symbol: '﷼' },
  { code: 'CHF', name: 'Swiss Franc', flag: '🇨🇭', symbol: 'Fr' },
];

export type CurrencyCode = (typeof CURRENCIES)[number]['code'];
