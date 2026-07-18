import { Game } from './types';

// Let's establish relative timestamps based on 2026-07-18T08:41:40-07:00
const now = 1784389300000; // approx Jul 18 2026 UTC
const hour = 3600000;
const day = 86400000;

export const games: Game[] = [
  { 
    id: '1', 
    name: 'Cyber Realms', 
    coverGradient: 'from-blue-600 to-purple-800',
    isFavorite: true,
    playtime: 1420, // 23h 40m
    lastPlayed: now - 2 * hour,
    dateAdded: now - 30 * day,
    genre: 'Action RPG',
    developer: 'Neon Dream Studios',
    description: 'A neon-drenched futuristic role-playing game featuring dense verticality, cybernetic augmentation trees, and an immersive branching narrative.'
  },
  { 
    id: '2', 
    name: 'Neon Drift', 
    coverGradient: 'from-pink-500 to-orange-500',
    isFavorite: false,
    playtime: 680, // 11h 20m
    lastPlayed: now - 1 * day,
    dateAdded: now - 15 * day,
    genre: 'Racing',
    developer: 'Veloce Games',
    description: 'Defy gravity on hyper-velocity synthwave highways. Features a pulse-pounding electronic soundtrack and realistic drift physics.'
  },
  { 
    id: '3', 
    name: 'Void Runner', 
    coverGradient: 'from-gray-800 to-black',
    isFavorite: true,
    playtime: 2150, // 35h 50m
    lastPlayed: now - 3 * hour,
    dateAdded: now - 45 * day,
    genre: 'Sci-Fi Roguelike',
    developer: 'Event Horizon Corp',
    description: 'Navigate unstable black hole corridors. Every run is procedurally warped, challenging your reflexes and tactical item synergy.'
  },
  { 
    id: '4', 
    name: 'Shadow Protocol', 
    coverGradient: 'from-green-600 to-emerald-900',
    isFavorite: false,
    playtime: 320, // 5h 20m
    lastPlayed: now - 4 * day,
    dateAdded: now - 10 * day,
    genre: 'Stealth / Tactics',
    developer: 'Silent Rogue',
    description: 'Infiltrate high-security corporate vaults using high-tech gadgets, dynamic light-and-shadow manipulation, and tactical pre-planning.'
  },
  { 
    id: '5', 
    name: 'Solaris', 
    coverGradient: 'from-yellow-500 to-red-600',
    isFavorite: true,
    playtime: 4890, // 81h 30m
    lastPlayed: now - 10 * hour,
    dateAdded: now - 60 * day,
    genre: 'Space Exploration',
    developer: 'Astro Games',
    description: 'A vast, open-world space adventure. Chart solar systems, extract resources, trade across orbital stations, and upgrade your stellar cruiser.'
  },
  { 
    id: '6', 
    name: 'Deep Sea X', 
    coverGradient: 'from-blue-400 to-blue-900',
    isFavorite: false,
    playtime: 90, // 1h 30m
    lastPlayed: now - 12 * day,
    dateAdded: now - 20 * day,
    genre: 'Adventure / Survival',
    developer: 'Abyssal Deep',
    description: 'Submerge into uncharted oceanic trenches. Manage oxygen reserves, pilot a specialized mini-sub, and encounter bio-luminescent behemoths.'
  },
  { 
    id: '7', 
    name: 'Quantum Leap', 
    coverGradient: 'from-cyan-400 to-blue-600',
    isFavorite: false,
    playtime: 0, // Unplayed
    lastPlayed: 0,
    dateAdded: now - 1 * day,
    genre: 'Puzzle Platformer',
    developer: 'Paradox Labs',
    description: 'Bend space and time to solve intricate environmental conundrums. Swap states between alternate quantum dimensions in real-time.'
  },
  { 
    id: '8', 
    name: 'Night City', 
    coverGradient: 'from-indigo-900 to-purple-900',
    isFavorite: true,
    playtime: 310, // 5h 10m
    lastPlayed: now - 8 * hour,
    dateAdded: now - 5 * day,
    genre: 'Action / Adventure',
    developer: 'Midnight Projects',
    description: 'Uncover the dark secrets of a multi-tiered metropolis ruled by rogue AI gangs and megacorporation enforcers.'
  }
];

