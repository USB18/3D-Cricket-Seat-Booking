/** Every URL in the app, in one place. */
export const ROUTES = {
  login: '/login',
  stadiums: '/stadiums',
  /** Route pattern for react-router. */
  stadiumPattern: '/stadium/:venueId',
  /** Link to one stadium. */
  stadium: (venueId: string) => `/stadium/${venueId}`,
} as const
