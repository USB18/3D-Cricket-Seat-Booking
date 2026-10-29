const PHONE_LENGTH = 10
const MAX_NAME_LENGTH = 60
const MIN_NAME_LENGTH = 2
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/** Keeps digits only and caps the length, so the phone field can never hold anything else. */
export const sanitizePhoneInput = (raw: string) => raw.replace(/\D/g, '').slice(0, PHONE_LENGTH)

export type LoginValidation =
  { ok: true; displayName: string; userId: string } | { ok: false; message: string }

/**
 * Checks the login form. The phone number becomes the user's id, so the same
 * number is the same person no matter which name or email they type.
 */
export function validateLogin(nameOrEmail: string, phone: string): LoginValidation {
  const displayName = nameOrEmail.trim().replace(/\s+/g, ' ')

  if (displayName.includes('@')) {
    if (!EMAIL_PATTERN.test(displayName)) return { ok: false, message: 'Enter a valid email address.' }
  } else if (displayName.length < MIN_NAME_LENGTH) {
    return { ok: false, message: 'Enter your name or email.' }
  }
  if (displayName.length > MAX_NAME_LENGTH) {
    return { ok: false, message: 'Name / email is too long.' }
  }
  if (!new RegExp(`^\\d{${PHONE_LENGTH}}$`).test(phone)) {
    return { ok: false, message: `Phone number must be exactly ${PHONE_LENGTH} digits.` }
  }
  return { ok: true, displayName, userId: phone }
}
