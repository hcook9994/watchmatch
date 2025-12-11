//TODO: reformat these functions
export async function loginApi(yourName: string) {
  console.log("fetchApi called");
  try {
    const response = await fetch("http://localhost:3000/login/", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ name: yourName }),
    });

    if (response.status === 200) {
      response.json().then((data) => {
        console.log("data from API: ", data);
        return data;
      });
    } else {
      return { message: "The server denied our request." };
    }
  } catch (e) {
    return { message: "Failed fetching from the API" };
  }
}
