/** An IPL home ground. Capacities are approximate real-world figures. */
export interface Venue {
  id: string
  team: string
  shortName: string
  stadiumName: string
  city: string
  /** Approximate real capacity — also the number shown as "seats available". */
  capacity: number
  primaryColor: string
  secondaryColor: string
  /** Half-length (x) of the playing area in scene units. */
  groundRadiusX: number
  /** Half-width (z) of the playing area in scene units. */
  groundRadiusZ: number
  floodlightTowers: number
}

export const VENUES: readonly Venue[] = [
  {
    id: 'csk',
    team: 'Chennai Super Kings',
    shortName: 'CSK',
    stadiumName: 'M. A. Chidambaram Stadium',
    city: 'Chennai',
    capacity: 50_000,
    primaryColor: '#fdb913',
    secondaryColor: '#1d4ba3',
    groundRadiusX: 33,
    groundRadiusZ: 28,
    floodlightTowers: 4,
  },
  {
    id: 'mi',
    team: 'Mumbai Indians',
    shortName: 'MI',
    stadiumName: 'Wankhede Stadium',
    city: 'Mumbai',
    capacity: 33_000,
    primaryColor: '#1d6fd6',
    secondaryColor: '#d4a537',
    groundRadiusX: 31,
    groundRadiusZ: 27,
    floodlightTowers: 4,
  },
  {
    id: 'rcb',
    team: 'Royal Challengers Bengaluru',
    shortName: 'RCB',
    stadiumName: 'M. Chinnaswamy Stadium',
    city: 'Bengaluru',
    capacity: 40_000,
    primaryColor: '#e0252b',
    secondaryColor: '#222222',
    groundRadiusX: 32,
    groundRadiusZ: 27,
    floodlightTowers: 4,
  },
  {
    id: 'kkr',
    team: 'Kolkata Knight Riders',
    shortName: 'KKR',
    stadiumName: 'Eden Gardens',
    city: 'Kolkata',
    capacity: 66_000,
    primaryColor: '#7a4fc4',
    secondaryColor: '#e3b448',
    groundRadiusX: 36,
    groundRadiusZ: 31,
    floodlightTowers: 4,
  },
  {
    id: 'dc',
    team: 'Delhi Capitals',
    shortName: 'DC',
    stadiumName: 'Arun Jaitley Stadium',
    city: 'Delhi',
    capacity: 35_000,
    primaryColor: '#2a6fd1',
    secondaryColor: '#e5262b',
    groundRadiusX: 33,
    groundRadiusZ: 28,
    floodlightTowers: 4,
  },
  {
    id: 'pbks',
    team: 'Punjab Kings',
    shortName: 'PBKS',
    stadiumName: 'Maharaja Yadavindra Singh Stadium',
    city: 'Mullanpur',
    capacity: 38_000,
    primaryColor: '#e8262d',
    secondaryColor: '#dcdddf',
    groundRadiusX: 34,
    groundRadiusZ: 29,
    floodlightTowers: 6,
  },
  {
    id: 'rr',
    team: 'Rajasthan Royals',
    shortName: 'RR',
    stadiumName: 'Sawai Mansingh Stadium',
    city: 'Jaipur',
    capacity: 30_000,
    primaryColor: '#ea3a95',
    secondaryColor: '#254aa5',
    groundRadiusX: 30,
    groundRadiusZ: 26,
    floodlightTowers: 4,
  },
  {
    id: 'srh',
    team: 'Sunrisers Hyderabad',
    shortName: 'SRH',
    stadiumName: 'Rajiv Gandhi Intl. Stadium',
    city: 'Hyderabad',
    capacity: 39_000,
    primaryColor: '#f7731c',
    secondaryColor: '#222222',
    groundRadiusX: 33,
    groundRadiusZ: 28,
    floodlightTowers: 4,
  },
  {
    id: 'gt',
    team: 'Gujarat Titans',
    shortName: 'GT',
    stadiumName: 'Narendra Modi Stadium',
    city: 'Ahmedabad',
    capacity: 132_000,
    primaryColor: '#c9a44c',
    secondaryColor: '#1b2133',
    groundRadiusX: 40,
    groundRadiusZ: 36,
    floodlightTowers: 8,
  },
  {
    id: 'lsg',
    team: 'Lucknow Super Giants',
    shortName: 'LSG',
    stadiumName: 'BRSABV Ekana Stadium',
    city: 'Lucknow',
    capacity: 50_000,
    primaryColor: '#1fb6f0',
    secondaryColor: '#f7931e',
    groundRadiusX: 34,
    groundRadiusZ: 29,
    floodlightTowers: 6,
  },
]

export function findVenue(id: string | undefined): Venue | undefined {
  return VENUES.find((venue) => venue.id === id)
}
