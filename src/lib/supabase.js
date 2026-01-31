import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const isMock = !supabaseUrl || !supabaseAnonKey

export const supabase = isMock
  ? createMockClient()
  : createClient(supabaseUrl, supabaseAnonKey)

// Mock Client Implementation
function createMockClient() {
  console.log('Running in Mock Mode (No Supabase Credentials Found)')
  
  // Local Storage Keys
  const KEY_BIDDERS = 'mock_bidders'
  const KEY_SETTINGS = 'mock_settings'
  const KEY_RESULTS = 'mock_results'

  // Initialize Default Data if empty
  if (!localStorage.getItem(KEY_BIDDERS)) {
    const defaultBidders = [
      { id: '1', name: 'MegaCorp', budget: 15000000, priority: 'Low', priority_score: 1 },
      { id: '2', name: 'ScienceLab', budget: 5000000, priority: 'High', priority_score: 3 },
      { id: '3', name: 'GovAgency', budget: 20000000, priority: 'Critical', priority_score: 4 },
    ]
    localStorage.setItem(KEY_BIDDERS, JSON.stringify(defaultBidders))
  }

  if (!localStorage.getItem(KEY_SETTINGS)) {
    const defaultSettings = [{
      id: 'settings-1',
      budget_weight: 0.6,
      priority_weight: 0.4,
      priority_map: { "Low": 1, "Medium": 2, "High": 3, "Critical": 4 }
    }]
    localStorage.setItem(KEY_SETTINGS, JSON.stringify(defaultSettings))
  }
  
  return {
    from: (table) => {
      return {
        select: () => {
          return Promise.resolve({
            data: JSON.parse(localStorage.getItem(`mock_${table}`) || '[]'),
            error: null
          })
        },
        insert: (data) => {
          const key = `mock_${table}`
          const current = JSON.parse(localStorage.getItem(key) || '[]')
          const newItem = { id: crypto.randomUUID(), ...data } // simple mock ID
          if(Array.isArray(data)) { // handle bulk insert
              const newItems = data.map(d => ({ id: crypto.randomUUID(), ...d }))
              localStorage.setItem(key, JSON.stringify([...current, ...newItems]))
          } else {
              localStorage.setItem(key, JSON.stringify([...current, newItem]))
          }
          return Promise.resolve({ error: null })
        },
        update: (data) => {
            return {
                eq: (col, val) => {
                    const key = `mock_${table}`
                    const current = JSON.parse(localStorage.getItem(key) || '[]')
                    const updated = current.map(item => item[col] === val ? { ...item, ...data } : item)
                    localStorage.setItem(key, JSON.stringify(updated))
                    return Promise.resolve({ error: null })
                }
            }
        },
        delete: () => {
            return {
                eq: (col, val) => {
                    const key = `mock_${table}`
                    const current = JSON.parse(localStorage.getItem(key) || '[]')
                    const filtered = current.filter(item => item[col] !== val)
                    localStorage.setItem(key, JSON.stringify(filtered))
                    return Promise.resolve({ error: null })
                }
            }
        },
        upsert: (data) => { // Basic upsert mock (overwrite if exists, else insert) - assuming single row for settings
             const key = `mock_${table}`
             // specific logic for settings (always 1 row in this app usually)
             if (table === 'auction_settings') {
                 localStorage.setItem(key, JSON.stringify([data]))
                 return Promise.resolve({ error: null })
             }
             return Promise.resolve({ error: null })
        }
      }
    }
  }
}
