export type Platform =
  | "Reddit"
  | "YouTube"
  | "Facebook"
  | "Twitter"
  | "Instagram";

export interface SocialMediaPost {
  id: number;
  platform: Platform;
  comment: string;
  likes: number;
  shares: number;
  timestamp: number;
}
