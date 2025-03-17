export interface Lead {
  name: string
  phone: string
  weeklyOrders: number
  createdAt: Date
}

export interface CreateLeadRequest {
  name: string
  phone: string
  weeklyOrders: number
}
