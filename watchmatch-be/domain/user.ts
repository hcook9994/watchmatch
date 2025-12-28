import { createUserDB, getUserByName } from "../database/user.js";

async function createUser(input: {
  username: string;
  email: string;
  password: string;
}) {
  await createUserDB(input);
}

async function loginAuthentication(input: {
  username: string;
  password: string;
}): Promise<{ status: false } | { status: true; userId: number }> {
  const user = await getUserByName(input.username);
  if (user) {
    if (user.password === input.password) {
      return { status: true, userId: user.user_id };
    } else {
      return { status: false };
    }
  } else {
    return { status: false };
  }
}

export default {
  createUser,
  loginAuthentication,
};
