export const COLORS = ["#30bced", "#6eeb83", "#ffbc42", "#ee6352", "#9ac2c9"];

export function getColorFromString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return COLORS[Math.abs(hash) % COLORS.length];
}

export function getInitials(email: string): string {
  const name = email.split("@")[0];
  return name.slice(0, 2).toUpperCase();
}
