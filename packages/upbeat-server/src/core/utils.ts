export function parseChannelId(channelId: string) {
  const parts = channelId.split('/');
  return {
    type: parts[0],
    key: parts[1],
  };
}
