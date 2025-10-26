export type TimelineEventType =
  | 'project_created'
  | 'milestone_verified'
  | 'payment_released'
  | 'impact_reported'
  | 'photo_uploaded';

export interface TimelineEvent {
  id: string;
  projectId: number;
  projectName: string;
  timestamp: string;
  type: TimelineEventType;
  actor: string;
  details: string;
  txHash?: string;
}

export const timelineEvents: TimelineEvent[] = [
  {
    id: 'evt-001',
    projectId: 1,
    projectName: 'River Crossing Bridge Rehabilitation',
    timestamp: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
    type: 'payment_released',
    actor: 'CityWorks Escrow Contract',
    details: 'Released 250,000 PROV for Bridge Deck Replacement milestone.',
    txHash: 'd4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3',
  },
  {
    id: 'evt-002',
    projectId: 4,
    projectName: 'Northside Road Resurfacing',
    timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    type: 'milestone_verified',
    actor: 'Lila Chen, P.E.',
    details: 'Verified asphalt curing milestone with on-site inspection upload.',
    txHash: 'c1d2e3f4g5h6i7j8k9l0m1n2o3p4q5r6s7t8u9v0',
  },
  {
    id: 'evt-003',
    projectId: 6,
    projectName: 'Southside Stormwater Management',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    type: 'impact_reported',
    actor: 'Provynce Analytics',
    details: 'Projected 35% reduction in neighborhood flood risk after retention basin activation.',
  },
  {
    id: 'evt-004',
    projectId: 2,
    projectName: 'Solar Community Energy Network',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    type: 'photo_uploaded',
    actor: 'Dr. Emily Rodriguez',
    details: 'Uploaded drone imagery of installed rooftop panels across 12 municipal buildings.',
  },
  {
    id: 'evt-005',
    projectId: 5,
    projectName: 'Central Park Pedestrian Bridge',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    type: 'project_created',
    actor: 'Provynce Public Works',
    details: 'Registered new pedestrian bridge with contract ID 4f3e…ab29 on Stellar testnet.',
    txHash: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0',
  },
];
