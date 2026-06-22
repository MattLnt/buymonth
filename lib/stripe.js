import Stripe from 'stripe'

export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null

export const PRICE_ABO = process.env.STRIPE_PRICE_ABO
export const PRICE_WIDGET = process.env.STRIPE_PRICE_WIDGET

// URL de base pour les redirections Stripe (success/cancel)
export const BASE_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000'