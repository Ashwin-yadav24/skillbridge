import { IUser, User } from "../models/User";

interface SyncUserPayload {
  clerkId: string;
  name: string;
  email: string;
  profileImage?: string;
}

interface SyncResult {
  user: IUser;
  created: boolean;
}

/**
 * Idempotent user synchronisation service.
 *
 * Creates a MongoDB user record for a verified Clerk identity on
 * first call. Subsequent calls update only allowed identity fields
 * (name, email, profileImage) — the role is NEVER changed by sync.
 *
 * Safe to call on every authenticated request (uses findOneAndUpdate
 * with upsert so it never creates duplicates).
 */
export async function syncUser(payload: SyncUserPayload): Promise<SyncResult> {
  const { clerkId, name, email, profileImage } = payload;

  // Check if user already exists (determines `created` flag)
  const existing = await User.findOne({ clerkId }).lean();

  const user = await User.findOneAndUpdate(
    { clerkId },
    {
      $set: {
        name,
        email: email.toLowerCase().trim(),
        ...(profileImage ? { profileImage } : {}),
      },
      $setOnInsert: {
        clerkId,
        role: "student",
        education: {},
      },
    },
    {
      upsert: true,
      new: true,
      runValidators: true,
    }
  );

  if (!user) {
    throw new Error("User sync failed: could not create or update user record.");
  }

  return { user, created: !existing };
}

