import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatDateShort(date: string | Date) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function getStatusColor(status: string) {
  switch (status) {
    case 'approved':
      return 'bg-green-500/10 text-green-400 border-green-500/20'
    case 'pending':
      return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
    case 'rejected':
      return 'bg-red-500/10 text-red-400 border-red-500/20'
    case 'registered':
      return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
    case 'cancelled':
      return 'bg-gray-500/10 text-gray-400 border-gray-500/20'
    default:
      return 'bg-gray-500/10 text-gray-400 border-gray-500/20'
  }
}