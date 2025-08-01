'use server';

import { getSession, Session } from './utlis/getSession';
import { FormState } from './form.types';
import { ApiError } from './api/ApiError';

/**
 * Ensures the user is authenticated before executing the provided callback.
 * Any error thrown inside the callback is caught and returned as a
 * standard FormState error object.
 */
export async function guardAction<Args extends any[], R = unknown>(
  callback: (session: Session, ...args: Args) => Promise<R>,
  errorMessage = 'Action failed'
): Promise<R | FormState> {
  let session: Session;
  try {
    session = await getSession();
  } catch {
    return {
      success: false,
      errors: { title: ['Not authenticated'] },
    } satisfies FormState as FormState;
  }

  try {
    // eslint-disable-next-line @typescript-eslint/return-await
    const result = await callback(session, ...([] as unknown as Args));
    return {
      success: true,
      data: result as any,
    };
  } catch (e) {
    console.error(e);
    let message = errorMessage;
    if (e instanceof ApiError) {
      message = e.message;
    } else if (e && typeof e === 'object' && 'message' in e) {
      message = (e as Error).message;
    }
    return {
      success: false,
      errors: { title: [message] },
      message,
    } satisfies FormState as FormState;
  }
}
