export function useAPIURL() {
  if (process.env.NODE_ENV === "production") return "https://api.magic.link";

  return "http://localhost:8080";
}
