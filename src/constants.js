export const USER_AGENT =
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.50 Safari/537.36';

export const REPLY_SELECTOR =
  '.tweet.permalink-tweet .stream-item-footer [data-tweet-stat-count]';

export const STATS_RE = /(\d+,?\d+) (replies|reply|likes?|retweets?)/;

export const KEY_MAP = {
  likes: 'likes',
  like: 'likes',
  replies: 'replies',
  reply: 'replies',
  retweets: 'retweets',
  retweet: 'retweet',
};

export const ORIGINAL_TWEET = '.permalink-inner.permalink-tweet-container';
