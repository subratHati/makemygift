import { useEffect, useState } from 'react';
import { fetchInvitation } from '../lib/invitationApi.js';
import { getTemplate } from '../data/invitationTemplates.js';
import InvitationPreview from '../components/InvitationPreview.jsx';

// Public viewer at /invitation/:publicId — loads the saved invitation and plays
// the full scroll experience. The link is only handed out after payment, so a
// draft (unpaid) id shows a gentle "not active" message.
export default function InvitationViewer({ publicId }) {
  const [state, setState] = useState({ loading: true, invitation: null, error: '' });

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const invitation = await fetchInvitation(publicId);
        if (!alive) return;
        if (!invitation) { setState({ loading: false, invitation: null, error: 'notfound' }); return; }
        setState({ loading: false, invitation, error: '' });
      } catch {
        if (alive) setState({ loading: false, invitation: null, error: 'failed' });
      }
    })();
    return () => { alive = false; };
  }, [publicId]);

  if (state.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1a0820] text-amber-100/80">
        <p className="text-sm tracking-widest">Loading invitation…</p>
      </div>
    );
  }

  if (state.error === 'notfound' || !state.invitation) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-[#1a0820] text-amber-100">
        <p className="text-lg">This invitation link doesn&apos;t exist.</p>
        <a href="/" className="mt-4 text-amber-300 underline">Go home</a>
      </div>
    );
  }

  if (state.error === 'failed') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-[#1a0820] text-amber-100">
        <p className="text-lg">Couldn&apos;t load this invitation. Please try again.</p>
      </div>
    );
  }

  const inv = state.invitation;
  if (inv.status !== 'paid') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-[#1a0820] text-amber-100">
        <p className="text-lg">This invitation isn&apos;t active yet 💛</p>
        <p className="mt-2 text-amber-200/70 text-sm">Once the couple activates it, this link will come alive.</p>
      </div>
    );
  }

  const template = getTemplate(inv.template) || getTemplate('royal-wedding');
  return <InvitationPreview template={template} data={inv} />;
}
