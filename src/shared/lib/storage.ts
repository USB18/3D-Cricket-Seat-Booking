/**
 * Browser storage helpers.
 *
 * `persistentStore` is a synchronous key-value store (MMKV-style API): reads come
 * from an in-memory cache, writes go through to `localStorage`, and `storage`
 * events from other tabs keep the cache and subscribers in sync. Every key is
 * namespaced so the app never touches other sites' data on the same origin.
 *
 * `sessionStore` holds the signed-in user for the current tab only.
 */

const PREFIX = 'cricket-seats:'

type Listener = (key: string) => void

const cache = new Map<string, string>()
const listeners = new Set<Listener>()

function loadFromLocalStorage() {
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith(PREFIX)) cache.set(key, localStorage.getItem(key) ?? '')
    }
  } catch {
    // Storage is unavailable (private mode, blocked): fall back to memory only.
  }
}

loadFromLocalStorage()

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (!event.key?.startsWith(PREFIX)) return
    if (event.newValue === null) cache.delete(event.key)
    else cache.set(event.key, event.newValue)
    const shortKey = event.key.slice(PREFIX.length)
    listeners.forEach((listener) => listener(shortKey))
  })
}

export const persistentStore = {
  getString(key: string): string | undefined {
    return cache.get(PREFIX + key)
  },

  set(key: string, value: string) {
    cache.set(PREFIX + key, value)
    try {
      localStorage.setItem(PREFIX + key, value)
    } catch {
      // Ignore quota errors / private mode — the in-memory cache still works.
    }
  },

  delete(key: string) {
    cache.delete(PREFIX + key)
    try {
      localStorage.removeItem(PREFIX + key)
    } catch {
      // Ignore.
    }
  },

  getJSON<T>(key: string, fallback: T): T {
    const raw = this.getString(key)
    if (!raw) return fallback
    try {
      return JSON.parse(raw) as T
    } catch {
      return fallback
    }
  },

  setJSON(key: string, value: unknown) {
    this.set(key, JSON.stringify(value))
  },

  /** Called with the (un-prefixed) key whenever another tab changes a value. */
  subscribe(listener: Listener) {
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  },
}

const USER_ID_KEY = PREFIX + 'user-id'
const DISPLAY_NAME_KEY = PREFIX + 'display-name'

function readSession(key: string): string | null {
  try {
    return sessionStorage.getItem(key)
  } catch {
    return null
  }
}

function writeSession(key: string, value: string | null) {
  try {
    if (value) sessionStorage.setItem(key, value)
    else sessionStorage.removeItem(key)
  } catch {
    // Ignore.
  }
}

/** Who is signed in on this tab. Cleared when the tab closes. */
export const sessionStore = {
  getUserId: () => readSession(USER_ID_KEY),
  setUserId: (value: string | null) => writeSession(USER_ID_KEY, value),
  getDisplayName: () => readSession(DISPLAY_NAME_KEY),
  setDisplayName: (value: string | null) => writeSession(DISPLAY_NAME_KEY, value),
}
