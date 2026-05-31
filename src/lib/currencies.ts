export const CURRENCIES = [
  // African Currencies
  { code: "KES", name: "Kenyan Shilling", flag: "🇰🇪" },
  { code: "UGX", name: "Ugandan Shilling", flag: "🇺🇬" },
  { code: "TZS", name: "Tanzanian Shilling", flag: "🇹🇿" },
  { code: "RWF", name: "Rwandan Franc", flag: "🇷🇼" },
  { code: "ETB", name: "Ethiopian Birr", flag: "🇪🇹" },
  { code: "NGN", name: "Nigerian Naira", flag: "🇳🇬" },
  { code: "GHS", name: "Ghanaian Cedi", flag: "🇬🇭" },
  { code: "ZAR", name: "South African Rand", flag: "🇿🇦" },
  { code: "EGP", name: "Egyptian Pound", flag: "🇪🇬" },
  { code: "MAD", name: "Moroccan Dirham", flag: "🇲🇦" },
  { code: "XOF", name: "West African CFA Franc", flag: "🌍" },
  { code: "ZMW", name: "Zambian Kwacha", flag: "🇿🇲" },
  { code: "BWP", name: "Botswana Pula", flag: "🇧🇼" },
  { code: "MZN", name: "Mozambican Metical", flag: "🇲🇿" },
  { code: "TND", name: "Tunisian Dinar", flag: "🇹🇳" },
  // Major World Currencies
  { code: "USD", name: "US Dollar", flag: "🇺🇸" },
  { code: "EUR", name: "Euro", flag: "🇪🇺" },
  { code: "GBP", name: "British Pound", flag: "🇬🇧" },
  { code: "AED", name: "UAE Dirham", flag: "🇦🇪" },
  { code: "CNY", name: "Chinese Yuan", flag: "🇨🇳" },
  { code: "INR", name: "Indian Rupee", flag: "🇮🇳" },
  { code: "JPY", name: "Japanese Yen", flag: "🇯🇵" },
  { code: "CAD", name: "Canadian Dollar", flag: "🇨🇦" },
  { code: "AUD", name: "Australian Dollar", flag: "🇦🇺" },
  { code: "SAR", name: "Saudi Riyal", flag: "🇸🇦" },
  { code: "CHF", name: "Swiss Franc", flag: "🇨🇭" },
];

export type CurrencyCode = typeof CURRENCIES[number]["code"];
