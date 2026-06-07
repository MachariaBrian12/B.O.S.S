import { Request, Response } from 'express';
import { stkPush } from './mpesa.service';

/**
 * INITIATE STK PUSH
 */
export async function initiateSTK(req: Request, res: Response) {
  try {
    const { phone, amount } = req.body;

    if (!phone || !amount) {
      return res.status(400).json({
        message: 'phone and amount required',
      });
    }

    const formattedPhone = phone.startsWith('0')
      ? '254' + phone.slice(1)
      : phone;

    const result = await stkPush(formattedPhone, amount);

    return res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

/**
 * CALLBACK (SAFE PLACEHOLDER FOR NOW)
 * Safaricom will hit this after payment
 */
export async function mpesaCallback(req: Request, res: Response) {
  try {
    console.log('MPESA CALLBACK RECEIVED:');
    console.log(JSON.stringify(req.body, null, 2));

    return res.json({
      ResultCode: 0,
      ResultDesc: 'Success',
    });
  } catch (error) {
    return res.status(500).json({
      ResultCode: 1,
      ResultDesc: 'Failed',
    });
  }
}
