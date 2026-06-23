import mongoose from 'mongoose';

// One sub-document per event (Haldi, Mehendi, etc.)
const EventSchema = new mongoose.Schema(
  {
    name: { type: String, default: '', trim: true, maxlength: 40 },
    date: { type: String, default: '', maxlength: 20 },  // ISO "YYYY-MM-DD"
    time: { type: String, default: '', maxlength: 10 },  // "HH:MM"
    venue: { type: String, default: '', trim: true, maxlength: 120 },
  },
  { _id: false }
);

const InvitationSchema = new mongoose.Schema(
  {
    // public id used in the shareable link (/invitation/:publicId)
    publicId: { type: String, required: true, unique: true, index: true },

    // which template + whose side
    template: { type: String, default: 'royal-wedding', trim: true, maxlength: 40 },
    side: { type: String, enum: ['bride', 'groom'], default: 'bride' },

    // couple
    groomName: { type: String, default: '', trim: true, maxlength: 60 },
    brideName: { type: String, default: '', trim: true, maxlength: 60 },

    // parents (per side)
    groomFather: { type: String, default: '', trim: true, maxlength: 60 },
    groomMother: { type: String, default: '', trim: true, maxlength: 60 },
    brideFather: { type: String, default: '', trim: true, maxlength: 60 },
    brideMother: { type: String, default: '', trim: true, maxlength: 60 },

    // main details
    weddingDate: { type: String, default: '', maxlength: 20 }, // ISO "YYYY-MM-DD"
    venue: { type: String, default: '', trim: true, maxlength: 120 },
    city: { type: String, default: '', trim: true, maxlength: 80 },

    // events + family
    events: { type: [EventSchema], default: [] },
    familyMembers: { type: String, default: '', maxlength: 600 },

    // lifecycle — link only works once paid
    status: { type: String, enum: ['draft', 'paid'], default: 'draft', index: true },
    razorpayOrderId: { type: String, default: '' },
    razorpayPaymentId: { type: String, default: '' },
    cardImageUrl: { type: String, default: '' }, // Cloudinary URL for WhatsApp OG preview
    openCount: { type: Number, default: 0 },
    lastOpenedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export const Invitation = mongoose.model('Invitation', InvitationSchema);
