import { auth } from "@/lib/auth";

export const DEMO_USER_ID = "demo-user";

export async function getCurrentUserId() {
  try {
    const session = await auth();
    const id = (session?.user as { id?: string } | undefined)?.id;
    return id || DEMO_USER_ID;
  } catch {
    return DEMO_USER_ID;
  }
}
