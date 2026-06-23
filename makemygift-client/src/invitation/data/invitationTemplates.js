// Central list of invitation templates. Add new templates here — the gallery and the
// builder both read from this single source, so the module scales cleanly.
export const invitationTemplates = [
  {
    id: 'royal-wedding',
    name: 'Royal Wedding Invitation',
    description: 'Regal jewel tones with ornate gold detailing and Mughal-inspired arches.',
    accent: 'from-amber-500 to-yellow-600',
    bg: 'from-[#2a0e2e] to-[#11030f]',
    emoji: '\u{1F451}',
    hasPhoto: true,
    component: 'RoyalWedding',
  },
  {
    id: 'floral-wedding',
    name: 'Floral Wedding Invitation',
    description: 'Soft pastels and delicate watercolor florals with elegant script.',
    accent: 'from-rose-400 to-pink-500',
    bg: 'from-[#3a1a2a] to-[#160910]',
    emoji: '\u{1F338}',
    hasPhoto: true,
    component: 'FloralWedding',
  },
  {
    id: 'traditional-wedding',
    name: 'Traditional Wedding Invitation',
    description: 'Classic red and gold with diyas, marigold and timeless motifs.',
    accent: 'from-red-500 to-amber-500',
    bg: 'from-[#3a0d0d] to-[#1a0505]',
    emoji: '\u{1FA94}',
    hasPhoto: false,
    component: 'TempleWedding',
  },
  {
    id: 'luxury-gold',
    name: 'Luxury Gold Invitation',
    description: 'Minimal black canvas with fine gold linework and refined typography.',
    accent: 'from-yellow-400 to-amber-600',
    bg: 'from-[#0f0f0f] to-[#000000]',
    emoji: '\u2728',
    hasPhoto: false,
    component: 'RoyalWedding',
  },
  {
    id: 'temple-wedding',
    name: 'Temple Wedding Invitation',
    description: 'South-Indian temple inspired, with gopuram silhouettes and kolam patterns.',
    accent: 'from-amber-500 to-orange-600',
    bg: 'from-[#2a1505] to-[#120800]',
    emoji: '\u{1F6D5}',
    hasPhoto: false,
    component: 'TempleWedding',
  },
];

export function getTemplate(id) {
  return invitationTemplates.find((t) => t.id === id) || null;
}
