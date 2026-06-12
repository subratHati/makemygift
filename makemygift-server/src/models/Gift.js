import mongoose from 'mongoose';

const GiftSchema = new mongoose.Schema(
  {
    // public short id used in the shareable link (/g/:publicId)
    publicId: { type: String, required: true, unique: true, index: true },

    // who it's for
    recipientName: { type: String, required: true, trim: true, maxlength: 60 },
    title: { type: String, default: '', trim: true, maxlength: 30 }, // optional, e.g. Princess
    occasion: { type: String, default: 'Birthday', trim: true, maxlength: 40 },

    // who it's from + the heart of the gift
    fromName: { type: String, default: '', trim: true, maxlength: 60 },
    message: { type: String, default: '', maxlength: 1000 },
    closingLine: { type: String, default: '', maxlength: 80 },

    // personalization
    mirrorQuestion: { type: String, default: '', maxlength: 120 },

    // task content (set by the buyer in the studio)
    puzzlePhotoUrl: { type: String, default: '' },      // Task 2 — photo cut into the 3x3 puzzle
    voiceQuestion: { type: String, default: '', maxlength: 160 }, // Task 3 — the question
    voiceAnswer: { type: String, default: '', maxlength: 160 },   // Task 3 — the answer to say
    candles: { type: Number, default: 5, min: 1, max: 12 },        // Finale — number of candles

    // the final reveal
    revealType: { type: String, enum: ['photo', 'video', 'portrait', 'note'], default: 'photo' },
    mediaUrl: { type: String, default: '' }, // object-storage URL, added in a later phase
    revealPhotoUrl: { type: String, default: '' }, // Finale — photo behind the message
    revealVideoUrl: { type: String, default: '' }, // Finale — video, if any
    chakraPhotoUrl: { type: String, default: '' }, // Section 2 — couple photo above the gate
    finalMessage: { type: String, default: '', maxlength: 600 }, // Finale — the message over the reveal

    // presentation
    theme: { type: String, default: 'window-modern', maxlength: 40 },

    // lifecycle — gifts are REPLAYABLE: opening never disables the link
    status: { type: String, enum: ['draft', 'paid'], default: 'draft', index: true },
    openCount: { type: Number, default: 0 }, // analytics only, does not gate playback
    lastOpenedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export const Gift = mongoose.model('Gift', GiftSchema);
