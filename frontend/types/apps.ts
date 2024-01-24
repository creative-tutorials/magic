export type typeApps = {
  appname: string;
  description: string;
  url: string;
  appicon: string;
  creator: string;
  twitterUrl: string;
};
export type filteredApps = Pick<
  typeApps,
  "appicon" | "appname" | "description"
>;
