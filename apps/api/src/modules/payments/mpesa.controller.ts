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
        success: false,
        message: 'phone and amount are required',
      });
    }

    const formattedPhone = phone.startsWith('0')
      ? '254' + phone.slice(1)
      : phone;

    const result = await stkPush(formattedPhone, amount);

    // stkPush returns { success: false } on failure without throwing.
    // We must check the result explicitly — never assume success.
    if (!result?.success) {
      return res.status(502).json({
        success: false,
        message:
          result?.message || 'Payment initiation failed. Please try again.',
      });
    }

    return res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error('[M-Pesa] initiateSTK error:', error);
    return res.status(500).json({
      success: false,
      message: 'Payment service error. Please try again.',
    });
  }
}

/**
 * CALLBACK
 * Safaricom hits this endpoint after the user completes or cancels payment.
 */
export async function mpesaCallback(req: Request, res: Response) {
  try {
    console.log(
      '[M-Pesa] Callback received:',
      JSON.stringify(req.body, null, 2),
    );

    // TODO: verify the callback is genuinely from Safaricom,
    // then update your orders/payments table based on ResultCode.
    // ResultCode 0 = success, anything else = failure/cancellation.

    return res.json({
      ResultCode: 0,
      ResultDesc: 'Success',
    });
  } catch (error) {
    console.error('[M-Pesa] Callback error:', error);
    return res.status(500).json({
      ResultCode: 1,
      ResultDesc: 'Failed',
    });
  }
}
