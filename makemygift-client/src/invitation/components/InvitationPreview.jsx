// Renders a live (static) preview of the selected template with the user's details.
// For now this shows a clean static composition. Real scroll-based animations and
// artwork layers will be added per-template later — the registry below makes that easy.
import RoyalWedding from '../templates/RoyalWedding.jsx';
import FloralWedding from '../templates/FloralWedding.jsx';
import TempleWedding from '../templates/TempleWedding.jsx';
import RoyalPalaceInvitation from '../templates/RoyalPalaceInvitation.jsx';

const REGISTRY = { RoyalWedding, FloralWedding, TempleWedding, RoyalPalace: RoyalPalaceInvitation };

export default function InvitationPreview({ template, data }) {
  const Comp = REGISTRY[template?.component] || RoyalWedding;
  return <Comp data={data} template={template} />;
}
