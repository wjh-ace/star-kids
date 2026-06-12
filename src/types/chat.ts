/* ============================================================
   P4-T1: Chat Types
   REQ-001 Phase 4 | 小星 Star Kids
   ============================================================ */

export interface Message {
  id: string
  role: 'star' | 'user'
  text: string
  timestamp: number
}
