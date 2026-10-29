import { useStore } from '@/store'
import { VENUES } from '@/config/venues'
import { getStadiumLayout } from './buildLayout'
import type { StadiumLayout } from './types'

/** Layout of the stadium that is currently open. */
export function useStadiumLayout(): StadiumLayout {
  const venueId = useStore((state) => state.venueId)
  return getStadiumLayout(venueId ?? VENUES[0].id)
}
