import { Badge, Scenario } from '../types';

export const INITIAL_METRICS = {
  stability: 50,
  openness: 50,
  trust: 50,
  equity: 50,
  innovation: 50,
};

export const BADGES: Badge[] = [
  {
    id: 'stability_guardian',
    name: 'Root Guardian',
    description: 'Maintained high internet stability (80+) despite attacks.',
    icon: 'ShieldCheck',
    condition: (m) => m.stability >= 80,
  },
  {
    id: 'innovation_catalyst',
    name: 'Innovation Catalyst',
    description: 'Driven significant innovation (80+) through technical upgrades.',
    icon: 'Cpu',
    condition: (m) => m.innovation >= 80,
  },
  {
    id: 'diplomat',
    name: 'Global Diplomat',
    description: 'High trust from all stakeholders (80+).',
    icon: 'Handshake',
    condition: (m) => m.trust >= 80,
  },
  {
    id: 'open_web',
    name: 'Open Web Hero',
    description: 'Defended free speech and open access (80+).',
    icon: 'Globe2',
    condition: (m) => m.openness >= 80,
  },
  {
    id: 'digital_bridge',
    name: 'Digital Bridge',
    description: 'Ensured fair access for all regions (Equity 80+).',
    icon: 'Scale',
    condition: (m) => m.equity >= 80,
  },
  {
    id: 'master_balancer',
    name: 'Master Balancer',
    description: 'Kept all global indices healthy (All 60+).',
    icon: 'Layout',
    condition: (m) => Object.values(m).every(val => val >= 60),
  },
  {
    id: 'peoples_champion',
    name: 'People\'s Champion',
    description: 'Prioritized rights and transparency (Trust & Openness 75+).',
    icon: 'Heart',
    condition: (m) => m.trust >= 75 && m.openness >= 75,
  },
  {
    id: 'technocrat',
    name: 'Benevolent Technocrat',
    description: 'Advanced technology while keeping it safe (Innovation & Stability 75+).',
    icon: 'Zap',
    condition: (m) => m.innovation >= 75 && m.stability >= 75,
  },
  {
    id: 'digital_humanist',
    name: 'Digital Humanist',
    description: 'Championed human rights and fair access (Openness & Equity 75+).',
    icon: 'UserCheck',
    condition: (m) => m.openness >= 75 && m.equity >= 75,
  },
  {
    id: 'trusted_innovator',
    name: 'Trusted Innovator',
    description: 'Built cutting-edge tech that people believe in (Innovation & Trust 75+).',
    icon: 'Lightbulb',
    condition: (m) => m.innovation >= 75 && m.trust >= 75,
  },
  {
    id: 'inclusive_guardian',
    name: 'Inclusive Guardian',
    description: 'Maintained a stable internet accessible to all (Stability & Equity 75+).',
    icon: 'Umbrella',
    condition: (m) => m.stability >= 75 && m.equity >= 75,
  },
  {
    id: 'legendary_steward',
    name: 'Legendary Steward',
    description: 'Achieved perfection in at least one metric (100).',
    icon: 'Star',
    condition: (m) => Object.values(m).some(val => val >= 100),
  },
  {
    id: 'digital_divide_bridge',
    name: 'Digital Divide Bridge',
    description: 'Successfully closed the gap in internet access between regions (Equity 80+)',
    icon: 'Link',
    condition: (m) => m.equity >= 80,
  },
];

export const SCENARIOS: Scenario[] = [
  // --- PHASE 1: Technical Coordination (Turns 1-2) ---
  {
    id: 'ipv4_exhaustion',
    phase: 'technical',
    orgContext: 'APNIC',
    title: 'The Address Shortage',
    description: 'Regional registries (RIRs) report that free pools of IPv4 addresses are critically low. New startups in developing Asia-Pacific economies cannot get addresses to go online. A secondary black market is forming.',
    options: [
      {
        id: 'market_forces',
        text: 'Allow Market Trading',
        description: 'Officially sanitize the buying and selling of IP addresses between companies.',
        impacts: [
          { metric: 'innovation', value: 5 },
          { metric: 'equity', value: -15 },
          { metric: 'stability', value: 5 },
        ],
        feedbackTitle: 'Market Efficiency, but at a Cost',
        feedbackText: 'Resources flow to those who can pay. Large incumbents buy up capacity, but smaller players in developing regions are priced out, widening the digital divide.',
      },
      {
        id: 'push_ipv6',
        text: 'Mandate IPv6 Transition',
        description: 'Coordinate with governments to enforce strict IPv6 adoption timelines for ISPs.',
        impacts: [
          { metric: 'innovation', value: 20 },
          { metric: 'stability', value: -10 },
          { metric: 'trust', value: -5 },
        ],
        feedbackTitle: 'Technical Disruption',
        feedbackText: 'The forced march to IPv6 accelerates modernization, but legacy systems break, causing temporary instability and grumbling from ISPs about compliance costs.',
      },
      {
        id: 'cgnat',
        text: 'Deploy Carrier-Grade NAT',
        description: 'Encourage ISPs to share single IP addresses across thousands of users (CGNAT).',
        impacts: [
          { metric: 'stability', value: 10 },
          { metric: 'openness', value: -10 },
          { metric: 'innovation', value: -10 },
        ],
        feedbackTitle: 'A Band-Aid Solution',
        feedbackText: 'It keeps the lights on and saves addresses, but peer-to-peer applications break, and tracking abuse becomes a nightmare for law enforcement.',
      },
    ],
  },
  {
    id: 'dns_root_security',
    phase: 'technical',
    orgContext: 'ICANN',
    title: 'DNSSEC Deployment',
    description: 'Security researchers warn of DNS poisoning attacks redirecting users to fake bank sites. Implementing DNSSEC (security extensions) solves this but adds complexity and latency to the root zone.',
    options: [
      {
        id: 'fast_track',
        text: 'Emergency Deployment',
        description: 'Push updates immediately to all root servers.',
        impacts: [
          { metric: 'stability', value: -15 },
          { metric: 'trust', value: 10 },
        ],
        feedbackTitle: 'Breaking Changes',
        feedbackText: 'The hasty rollout caused older resolvers to fail. Parts of the internet went dark for 6 hours, though the system is now secure.',
      },
      {
        id: 'voluntary',
        text: 'Voluntary Adoption',
        description: 'Launch an awareness campaign but let operators decide.',
        impacts: [
          { metric: 'stability', value: 5 },
          { metric: 'trust', value: -10 },
          { metric: 'openness', value: 5 },
        ],
        feedbackTitle: 'Slow and Steady',
        feedbackText: 'The internet remains stable, but major phishing attacks continue. Stakeholders are losing faith in your ability to secure the infrastructure.',
      },
    ],
  },

  // --- PHASE 2: Regional & Policy (Turns 3-5) ---
  {
    id: 'new_gtlds',
    phase: 'regional',
    orgContext: 'ICANN',
    title: 'Expansion of Domain Names',
    description: 'Companies and cities want their own domain endings (like .shop, .nyc, .bank). It opens the namespace but raises concerns about trademark bullying and phishing.',
    options: [
      {
        id: 'restrictive',
        text: 'Limit Expansion',
        description: 'Keep the root zone small. Reject most applications to ensure stability.',
        impacts: [
          { metric: 'stability', value: 10 },
          { metric: 'innovation', value: -15 },
          { metric: 'openness', value: -5 },
        ],
        feedbackTitle: 'Conservative Governance',
        feedbackText: 'The technical community applauds the caution, but innovators accuse the organization of protecting incumbents and stifling competition.',
      },
      {
        id: 'liberal',
        text: 'Open the Floodgates',
        description: 'Allow any valid application with sufficient funding.',
        impacts: [
          { metric: 'innovation', value: 15 },
          { metric: 'trust', value: -10 },
          { metric: 'openness', value: 10 },
        ],
        feedbackTitle: 'A Wild West',
        feedbackText: 'Thousands of new domains launch! Innovation booms, but so does confusion. Users struggle to know which .bank is real.',
      },
    ],
  },
  {
    id: 'digital_divide',
    phase: 'regional',
    orgContext: 'APNIC',
    title: 'Infrastructure in the Pacific',
    description: 'Island nations are lagging in connectivity due to high costs of undersea cables. They demand subsidized resource allocations.',
    options: [
      {
        id: 'subsidize',
        text: 'Fee Reductions',
        description: 'Lower registry fees for developing economies, subsidized by larger tech giants.',
        impacts: [
          { metric: 'equity', value: 20 },
          { metric: 'trust', value: 5 },
          { metric: 'innovation', value: -5 },
        ],
        feedbackTitle: 'Closing the Gap',
        feedbackText: 'Small networks flourish in underserved areas. Large corporations grumble about footing the bill, but the ecosystem is more balanced.',
      },
      {
        id: 'neutrality',
        text: 'Strict Neutrality',
        description: 'Maintain equal fees for all to prevent market distortion.',
        impacts: [
          { metric: 'equity', value: -15 },
          { metric: 'trust', value: -5 },
          { metric: 'stability', value: 5 },
        ],
        feedbackTitle: 'Technically Fair, Socially Unfair',
        feedbackText: 'The playing field remains level technically, but only rich players can afford to play. Regional discontent grows.',
      },
    ],
  },
  {
    id: 'cable_cut_crisis',
    phase: 'regional',
    orgContext: 'APNIC',
    title: 'Submarine Cable Severed',
    description: 'A massive earthquake has severed the primary undersea cables serving Southeast Asia. Bandwidth has dropped by 60%, causing panic in financial markets and healthcare networks.',
    options: [
      {
        id: 'prioritize_traffic',
        text: 'Prioritize Critical Traffic',
        description: 'Instruct ISPs to block video streaming and gaming to save bandwidth for hospitals and banks.',
        impacts: [
          { metric: 'stability', value: 15 },
          { metric: 'openness', value: -20 },
          { metric: 'equity', value: -5 },
        ],
        feedbackTitle: 'Triage Mode',
        feedbackText: 'Essential services stayed online, but the public is furious about censorship. "Net Neutrality" advocates are protesting the precedent.',
      },
      {
        id: 'emergency_reroute',
        text: 'Expensive Satellite Reroute',
        description: 'Coordinate emergency funding to route traffic via expensive low-earth orbit satellites.',
        impacts: [
          { metric: 'equity', value: -10 },
          { metric: 'trust', value: 10 },
          { metric: 'stability', value: 5 },
        ],
        feedbackTitle: 'Costly Connection',
        feedbackText: 'Connectivity is restored, but the registry funds are depleted. Smaller ISPs go bankrupt unable to pay the emergency premiums.',
      },
    ],
  },

  // --- PHASE 3: Global Policy (Turns 6-8) ---
  {
    id: 'internet_shutdowns',
    phase: 'policy',
    orgContext: 'IGF',
    title: 'Government Shutdowns',
    description: 'Several governments are ordering strict internet blackouts during elections. They ask global bodies to technically legitimize "Sovereign Internet" controls.',
    options: [
      {
        id: 'condemn',
        text: 'Issue Strong Condemnation',
        description: 'Publicly state that shutdowns violate internet openness principles.',
        impacts: [
          { metric: 'openness', value: 15 },
          { metric: 'trust', value: -10 },
        ],
        feedbackTitle: 'Political Backlash',
        feedbackText: 'Civil society cheers, but several governments threaten to withdraw from the multi-stakeholder model and form their own UN-controlled internet body.',
      },
      {
        id: 'technical_neutrality',
        text: 'Claim "Out of Scope"',
        description: 'State that your mandate is purely technical, not political.',
        impacts: [
          { metric: 'openness', value: -15 },
          { metric: 'trust', value: 10 },
          { metric: 'stability', value: 5 },
        ],
        feedbackTitle: 'Safe Silence',
        feedbackText: 'Governments are pleased you didn\'t interfere. However, human rights groups argue that technical neutrality is complicity in censorship.',
      },
    ],
  },
  {
    id: 'encryption_wars',
    phase: 'policy',
    orgContext: 'SECURITY',
    title: 'Encryption Backdoors',
    description: 'A coalition of law enforcement agencies demands a mandatory "backdoor" in encryption standards to catch criminals, threatening to arrest developers who refuse.',
    options: [
      {
        id: 'refuse_backdoors',
        text: 'Defend Encryption',
        description: 'Refuse to weaken standards. Mathematics cannot be compromised for politics.',
        impacts: [
          { metric: 'trust', value: 10 },
          { metric: 'openness', value: 10 },
          { metric: 'stability', value: -5 },
        ],
        feedbackTitle: 'Holding the Line',
        feedbackText: 'The tech community rallies behind you. However, governments retaliate by blocking encrypted services in their territories.',
      },
      {
        id: 'compromise_keys',
        text: 'Key Escrow System',
        description: 'Propose a system where keys are held by a "trusted" third party.',
        impacts: [
          { metric: 'trust', value: -20 },
          { metric: 'openness', value: -10 },
          { metric: 'stability', value: 5 },
        ],
        feedbackTitle: 'Trust Broken',
        feedbackText: 'The "secure" keys leaked within a week. Trust in the global internet standard plummeted, and cybercrime actually increased.',
      },
    ],
  },
  {
    id: 'ai_disinformation',
    phase: 'policy',
    orgContext: 'IGF',
    title: 'The Botnet Flood',
    description: 'AI-generated botnets are spamming public forums and DNS queries with billions of fake requests, drowning out human discourse and straining infrastructure.',
    options: [
      {
        id: 'verify_humans',
        text: 'Mandatory Human ID',
        description: 'Implement a "Real ID" token requirement for network traffic.',
        impacts: [
          { metric: 'stability', value: 15 },
          { metric: 'openness', value: -25 },
          { metric: 'trust', value: -5 },
        ],
        feedbackTitle: 'End of Anonymity',
        feedbackText: 'The spam stopped, but so did anonymous dissent. Whistleblowers and activists are silenced by the fear of tracking.',
      },
      {
        id: 'scale_infra',
        text: 'Absorb the Load',
        description: 'Invest massively in capacity to handle the noise without filtering content.',
        impacts: [
          { metric: 'stability', value: -5 },
          { metric: 'equity', value: -10 },
          { metric: 'openness', value: 10 },
        ],
        feedbackTitle: 'Expensive Freedom',
        feedbackText: 'The network is slow and expensive, but it remains free. Smaller networks are struggling to keep up with the hardware costs.',
      },
    ],
  },

  // --- PHASE 4: Global Future (Turns 9-10) ---
  {
    id: 'splinternet',
    phase: 'global',
    orgContext: 'GLOBAL',
    title: 'The Splinternet Threat',
    description: 'A major superpower announces a "New IP" proposal to redesign the internet with built-in tracking and border controls, threatening to split the global network.',
    options: [
      {
        id: 'bridge',
        text: 'Diplomatic Compromise',
        description: 'Integrate some of the tracking features to keep them in the global system.',
        impacts: [
          { metric: 'stability', value: 10 },
          { metric: 'openness', value: -20 },
          { metric: 'trust', value: -10 },
        ],
        feedbackTitle: 'A Broken Mirror',
        feedbackText: 'The internet stays connected physically, but logically it is fractured. Privacy is eroded globally to appease a few powerful actors.',
      },
      {
        id: 'resist',
        text: 'Defend Open Standards',
        description: 'Refuse to adopt the new standards, risking a hard fork of the internet.',
        impacts: [
          { metric: 'openness', value: 15 },
          { metric: 'stability', value: -20 },
          { metric: 'trust', value: 5 },
        ],
        feedbackTitle: 'Drawing a Line',
        feedbackText: 'The global community rallies around the open internet. The superpower isolates its network, causing connectivity issues, but the core principles survive.',
      },
    ],
  },
  {
    id: 'orbital_sovereignty',
    phase: 'global',
    orgContext: 'GLOBAL',
    title: 'Orbital Internet',
    description: 'Private companies have launched thousands of satellites, providing uncensored internet to every corner of the globe. Dictators are threatening to shoot them down if they don\'t comply with local laws.',
    options: [
      {
        id: 'sovereign_respect',
        text: 'Enforce Local Laws',
        description: 'Require satellite providers to geoblock content based on the territory below.',
        impacts: [
          { metric: 'stability', value: 10 },
          { metric: 'openness', value: -15 },
          { metric: 'innovation', value: -5 },
        ],
        feedbackTitle: 'Borders in the Sky',
        feedbackText: 'Conflict is avoided, but the promise of a truly global internet is dead. The "Great Firewall" now extends to space.',
      },
      {
        id: 'free_sky',
        text: 'Declare Space Neutral',
        description: 'Assert that orbital internet is outside national jurisdiction.',
        impacts: [
          { metric: 'openness', value: 20 },
          { metric: 'stability', value: -15 },
          { metric: 'equity', value: 10 },
        ],
        feedbackTitle: 'Star Wars?',
        feedbackText: 'Information flows freely to oppressed citizens. However, diplomatic tensions are at an all-time high, and anti-satellite missile tests have begun.',
      },
    ],
  },
];