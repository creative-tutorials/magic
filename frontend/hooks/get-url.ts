export function useAPIURL() {
  if (process.env.NODE_ENV === "production") return "https://xbrid.vercel.app";

  return "http://localhost:8080";
}
