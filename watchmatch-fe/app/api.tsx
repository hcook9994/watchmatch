//TODO: reformat these functions
// TODO: add proper return types

export async function createUser(
  username: string,
  email: string,
  password: string
) {
  try {
    const response = await fetch("http://localhost:3000/create_user/", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ username, email, password }),
    });

    if (response.status === 200) {
      return { status: 200, data: await response.json() };
    } else {
      return { message: "The server denied our request." };
    }
  } catch (e) {
    return { message: "Failed fetching from the API" };
  }
}

export async function login(username: string, password: string) {
  try {
    const response = await fetch("http://localhost:3000/login/", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ username, password }),
    });

    if (response.status === 200) {
      const responseData = await response.json();
      return { data: responseData, status: 200 };
    } else {
      return { message: "The server denied our request.", status: 500 };
    }
  } catch (e) {
    return { message: "Failed fetching from the API", status: 500 };
  }
}
