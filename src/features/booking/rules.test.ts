import { describe, expect, it } from 'vitest'
import { MAX_SEATS_PER_USER } from '@/config/constants'
import { evaluateConfirm, evaluateToggle, findLostSeats, seatsBookedBy } from './rules'

const me = '9876543210'
const someoneElse = '1111111111'

describe('evaluateToggle', () => {
  it('lets a user select a free seat', () => {
    const result = evaluateToggle({ seatId: 'A1-1', userId: me, bookings: {}, selectedSeatIds: [] })
    expect(result).toEqual({ type: 'select' })
  })

  it('deselects a seat that is already selected', () => {
    const result = evaluateToggle({ seatId: 'A1-1', userId: me, bookings: {}, selectedSeatIds: ['A1-1'] })
    expect(result).toEqual({ type: 'deselect' })
  })

  it('blocks a seat booked by someone else', () => {
    const result = evaluateToggle({
      seatId: 'A1-1',
      userId: me,
      bookings: { 'A1-1': someoneElse },
      selectedSeatIds: [],
    })
    expect(result.type).toBe('blocked')
  })

  it('blocks a seat the user already booked', () => {
    const result = evaluateToggle({
      seatId: 'A1-1',
      userId: me,
      bookings: { 'A1-1': me },
      selectedSeatIds: [],
    })
    expect(result.type).toBe('blocked')
  })

  it(`stops at ${MAX_SEATS_PER_USER} seats counting booked and selected together`, () => {
    const result = evaluateToggle({
      seatId: 'C1-1',
      userId: me,
      bookings: { 'A1-1': me },
      selectedSeatIds: ['B1-1', 'B1-2'],
    })
    expect(result.type).toBe('blocked')
  })
})

describe('evaluateConfirm', () => {
  const known = new Set(['A1-1', 'A1-2', 'A1-3', 'A1-4'])

  it('books every selected seat when nothing conflicts', () => {
    const result = evaluateConfirm({
      userId: me,
      bookings: {},
      selectedSeatIds: ['A1-1', 'A1-2'],
      knownSeatIds: known,
    })
    expect(result).toEqual({ toBook: ['A1-1', 'A1-2'], conflicts: [], overLimit: false })
  })

  it('reports seats taken by someone else in the meantime', () => {
    const result = evaluateConfirm({
      userId: me,
      bookings: { 'A1-2': someoneElse },
      selectedSeatIds: ['A1-1', 'A1-2'],
      knownSeatIds: known,
    })
    expect(result.toBook).toEqual(['A1-1'])
    expect(result.conflicts).toEqual(['A1-2'])
  })

  it('flags going over the per-user limit', () => {
    const result = evaluateConfirm({
      userId: me,
      bookings: { 'A1-3': me, 'A1-4': me },
      selectedSeatIds: ['A1-1', 'A1-2'],
      knownSeatIds: known,
    })
    expect(result.overLimit).toBe(true)
  })

  it('ignores seats that do not exist in the stadium', () => {
    const result = evaluateConfirm({
      userId: me,
      bookings: {},
      selectedSeatIds: ['Z9-9'],
      knownSeatIds: known,
    })
    expect(result.toBook).toEqual([])
  })
})

describe('helpers', () => {
  it('lists the seats a user booked', () => {
    expect(seatsBookedBy({ 'A1-1': me, 'A1-2': someoneElse, 'A1-3': me }, me)).toEqual(['A1-1', 'A1-3'])
  })

  it('finds selected seats another user has since booked', () => {
    expect(findLostSeats(['A1-1', 'A1-2'], { 'A1-2': someoneElse }, me)).toEqual(['A1-2'])
  })
})
