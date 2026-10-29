import { describe, expect, it } from 'vitest'
import { sanitizePhoneInput, validateLogin } from './validation'

describe('sanitizePhoneInput', () => {
  it('keeps digits only and stops at 10', () => {
    expect(sanitizePhoneInput('+91 98a76-54321099')).toBe('9198765432')
  })
})

describe('validateLogin', () => {
  it('accepts a name and a 10-digit phone number', () => {
    expect(validateLogin('  Umesh   Singh ', '9876543210')).toEqual({
      ok: true,
      displayName: 'Umesh Singh',
      userId: '9876543210',
    })
  })

  it('accepts a valid email in place of a name', () => {
    expect(validateLogin('umesh@mail.com', '9876543210').ok).toBe(true)
  })

  it('rejects a malformed email', () => {
    expect(validateLogin('umesh@mail', '9876543210').ok).toBe(false)
  })

  it('rejects a one-letter name', () => {
    expect(validateLogin('U', '9876543210').ok).toBe(false)
  })

  it('rejects a phone number that is not exactly 10 digits', () => {
    expect(validateLogin('Umesh', '12345').ok).toBe(false)
    expect(validateLogin('Umesh', '12345678901').ok).toBe(false)
  })
})
