import axios from 'axios';
import 'dotenv/config';

/**
 * =========================
 * JUST FILL YOUR .ENV FILE
 * =========================
 * MPESA_CONSUMER_KEY=tCcvvsA0NKZ4gnzfKBD39kv0ZlB7S6glBEM3Rn3VUGaG89dW
 * MPESA_CONSUMER_SECRET=AUITH0VZRdYFS2GuuJpwQJXcSJaOsEVXVaUGteREDolpNS8Chx3ZkI8zJdtGov3f
 * MPESA_SHORTCODE=
 * MPESA_PASSKEY=
 * MPESA_CALLBACK_URL=
 * MPESA_ENV=sandbox
 */

/**
 * =========================
 * CONFIG
 * =========================
 */
const BASE_URL =
  process.env.MPESA_ENV === 'production'
    ? 'https://api.safaricom.co.ke'
    : 'https://sandbox.safaricom.co.ke';

/**
 * =========================
 * SIMPLE ENV CHECK
 * =========================
 */
function checkEnv() {
  const required = [
    'MPESA_CONSUMER_KEY',
    'MPESA_CONSUMER_SECRET',
    'MPESA_SHORTCODE',
    'MPESA_PASSKEY',
    'MPESA_CALLBACK_URL',
  ];

  for (const key of required) {
    if (!process.env[key]) {
      throw new Error(`❌ Missing env: ${key}`);
    }
  }
}

/**
 * =========================
 * TOKEN CACHE
 * =========================
 */
let tokenCache: { token: string; expires: number } | null = null;

/**
 * =========================
 * GET ACCESS TOKEN
 * =========================
 */
async function getToken() {
  checkEnv();

  const now = Date.now();

  if (tokenCache && tokenCache.expires > now) {
    return tokenCache.token;
  }

  const auth = Buffer.from(
    `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`,
  ).toString('base64');

  const res = await axios.get(
    `${BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
    {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    },
  );

  tokenCache = {
    token: res.data.access_token,
    expires: now + 50 * 60 * 1000,
  };

  return tokenCache.token;
}

/**
 * =========================
 * FORMAT PHONE
 * =========================
 */
function formatPhone(phone: string) {
  return phone.replace(/^0/, '254').replace('+', '');
}

/**
 * =========================
 * TIMESTAMP
 * =========================
 */
function timestamp() {
  const d = new Date();

  return (
    d.getFullYear() +
    String(d.getMonth() + 1).padStart(2, '0') +
    String(d.getDate()).padStart(2, '0') +
    String(d.getHours()).padStart(2, '0') +
    String(d.getMinutes()).padStart(2, '0') +
    String(d.getSeconds()).padStart(2, '0')
  );
}

/**
 * =========================
 * MAIN STK PUSH (CLEAN)
 * =========================
 */
export async function stkPush(phone: string, amount: number) {
  try {
    checkEnv();

    const token = await getToken();
    const time = timestamp();

    const shortcode = process.env.MPESA_SHORTCODE!;
    const passkey = process.env.MPESA_PASSKEY!;

    const password = Buffer.from(shortcode + passkey + time).toString('base64');

    const msisdn = formatPhone(phone);

    const payload = {
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: time,
      TransactionType: 'CustomerPayBillOnline',
      Amount: amount,
      PartyA: msisdn,
      PartyB: shortcode,
      PhoneNumber: msisdn,
      CallBackURL: process.env.MPESA_CALLBACK_URL!,
      AccountReference: 'BOSS',
      TransactionDesc: 'Payment',
    };

    const res = await axios.post(
      `${BASE_URL}/mpesa/stkpush/v1/processrequest`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    );

    return {
      success: true,
      checkoutRequestID: res.data.CheckoutRequestID,
      merchantRequestID: res.data.MerchantRequestID,
      message: res.data.CustomerMessage,
    };
  } catch (err: any) {
    console.log('STK ERROR:', err.response?.data || err.message);

    return {
      success: false,
      error: 'Payment failed',
    };
  }
}
