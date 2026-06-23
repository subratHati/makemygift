import InvitationHero from '../components/InvitationHero.jsx';
import TemplateCard from '../components/TemplateCard.jsx';
import { invitationTemplates } from '../data/invitationTemplates.js';

// The template gallery at /invitations
export default function InvitationTemplates() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-stone-50 to-rose-50/50 text-stone-800">
      <div className="mx-auto max-w-6xl px-5 py-12 sm:py-16">
        <InvitationHero
          title="Choose Your Invitation Template"
          subtitle="Select a design and personalize it with your event details."
          back={{ href: '/', label: 'Home' }}
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {invitationTemplates.map((t) => (
            <TemplateCard key={t.id} template={t} />
          ))}
        </div>
      </div>
    </div>
  );
}
