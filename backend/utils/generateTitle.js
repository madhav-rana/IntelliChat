export const generateTitle = (message) => {
  return message.length > 40
    ? message.substring(0, 40).trim() + "..."
    : message.trim();
};
