export interface UserProfileProps {
  user: { id: string; name: string; };
  permissions: { id: number; name: string; }[];
}
