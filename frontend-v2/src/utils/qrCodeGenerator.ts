// Helper function to generate WiFi QR code content string
export const generateWiFiQRContent = (
  ssid: string,
  password: string,
  encryption: 'WPA' | 'WEP' | 'nopass',
  hidden: boolean
): string => {
  return `WIFI:S:${ssid};T:${encryption};P:${password};H:${hidden ? 'true' : 'false'};;`;
};

// Format date for display
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

// Helper to check if a string is empty
export const isEmpty = (str: string | undefined): boolean => {
  return !str || str.trim().length === 0;
};