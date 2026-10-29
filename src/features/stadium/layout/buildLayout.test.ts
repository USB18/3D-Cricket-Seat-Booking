import { describe, expect, it } from 'vitest'
import { SPECTATORS_PER_SEAT } from '@/config/constants'
import { VENUES } from '@/config/venues'
import { getStadiumLayout } from './buildLayout'

describe('getStadiumLayout', () => {
  it.each(VENUES.map((venue) => [venue.id, venue.capacity] as const))(
    'draws roughly capacity / %s seats for %s',
    (venueId, capacity) => {
      const { seats } = getStadiumLayout(venueId)
      const target = capacity / SPECTATORS_PER_SEAT
      expect(seats.length).toBeGreaterThan(target * 0.9)
      expect(seats.length).toBeLessThan(target * 1.1)
    },
  )

  it('gives bigger stadiums more seats', () => {
    expect(getStadiumLayout('gt').seats.length).toBeGreaterThan(getStadiumLayout('kkr').seats.length)
    expect(getStadiumLayout('kkr').seats.length).toBeGreaterThan(getStadiumLayout('rr').seats.length)
  })

  it('gives every seat a unique id that can be looked up', () => {
    for (const venue of VENUES) {
      const { seats, seatIndexById } = getStadiumLayout(venue.id)
      expect(new Set(seats.map((seat) => seat.id)).size).toBe(seats.length)
      expect(seats[seatIndexById.get(seats[0].id)!].id).toBe(seats[0].id)
    }
  })

  it('prices front rows above back rows', () => {
    const { seats } = getStadiumLayout('dc')
    const front = seats.find((seat) => seat.row === 1)!
    const back = seats[seats.length - 1]
    expect(front.price).toBeGreaterThan(back.price)
  })

  it('falls back to the first stadium for an unknown id', () => {
    expect(getStadiumLayout('nope').venue.id).toBe(VENUES[0].id)
  })
})
