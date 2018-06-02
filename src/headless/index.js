import { Chromeless } from 'chromeless';

import { KEY_MAP, REPLY_SELECTOR, STATS_RE, USER_AGENT } from '../constants';
import { upload } from '../s3';

const newChromeless = () => new Chromeless({ launchChrome: true });

export const getRatios = async (url, { browser } = {}) => {
  const chromeless = browser || newChromeless();
  const statsStrings = await chromeless
    .setUserAgent(USER_AGENT)
    .goto(url)
    .wait(REPLY_SELECTOR)
    .evaluate(() => {
      const SELECTOR =
        '.tweet.permalink-tweet .stream-item-footer [data-tweet-stat-count]';
      // eslint-disable-next-line
      const result = $(SELECTOR)
        .toArray()
        .map(s => s.innerText);
      return result;
    });
  const result = statsStrings.reduce((acc, text) => {
    if (STATS_RE.test(text)) {
      // eslint-disable-next-line no-unused-vars
      const [_, val, key] = text.match(STATS_RE);
      return {
        ...acc,
        [KEY_MAP[key]]: parseInt(val.replace(/\D/g, ''), 10),
      };
    }
    return acc;
  }, {});
  await chromeless.end();

  return result;
};

export const getScreenshot = async (
  url,
  { browser, returnRatios = false } = {}
) => {
  const chromeless = browser || newChromeless();
  const ORIGINAL_TWEET = '.permalink-inner.permalink-tweet-container';
  const screenshotPath = chromeless
    .setUserAgent(USER_AGENT)
    .goto(url)
    .wait(ORIGINAL_TWEET)
    .wait(1000)
    .screenshot(ORIGINAL_TWEET);

  const ratiosPromise = returnRatios ? getRatios(url, { browser }) : {};

  const s3File = upload(await screenshotPath);

  const [screenshot, ratios] = await Promise.all([s3File, ratiosPromise]);

  return { screenshot, ratios };
};
