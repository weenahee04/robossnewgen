import { randomUUID } from 'crypto';

export function generateUserId(): string {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `ROBOSS-${randomNum}`;
}

export function generateId(): string {
  return randomUUID();
}

export function calculateMemberTier(points: number): 'Silver' | 'Gold' | 'Platinum' {
  if (points >= 5000) return 'Platinum';
  if (points >= 2000) return 'Gold';
  return 'Silver';
}

export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}
