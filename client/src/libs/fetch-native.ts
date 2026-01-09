import { cookies } from "next/headers";

type FetchOptions = RequestInit & {
  next?: NextFetchRequestConfig;
};

class FetchNative {
  constructor() {}

  public fetchAPI = async (
    path: string,
    withCredentials: boolean = false,
    options: FetchOptions = {}
  ): Promise<Response | null> => {
    const headers = new Headers(options.headers);
    if (!headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }

    if (withCredentials) {
      const cookieStore = await cookies();
      const allCookies = cookieStore.getAll();

      if (allCookies.length > 0) {
        const cookieHeader = allCookies
          .map((c) => `${c.name}=${c.value}`)
          .join("; ");
        headers.set("Cookie", cookieHeader);
      }
    }

    const url = path.startsWith("http")
      ? path
      : `http://server:${process.env.PORT_SERVER}/api${path}`;

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        credentials: withCredentials ? "include" : undefined,
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      return response;
    } catch (error) {
      console.error("Fetch API Error:", error);
    }
    return null;
  };
}

const fetchNative = new FetchNative();

export default fetchNative;
