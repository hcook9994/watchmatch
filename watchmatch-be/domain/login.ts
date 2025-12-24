import { getUserByName } from "../database/user.js";

export async function loginAuthentication(
  username: string,
  password: string
): Promise<{ status: false } | { status: true; userId: number }> {
  const user = await getUserByName(username);
  if (user) {
    if (user.password === password) {
      return { status: true, userId: user.id };
    } else {
      return { status: false };
    }
  } else {
    return { status: false };
  }
}
