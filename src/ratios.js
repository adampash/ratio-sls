import { Chromeless } from 'chromeless';

import { KEY_MAP, REPLY_SELECTOR, STATS_RE, USER_AGENT } from './constants';
import { errorResponse, runWarm, successResponse } from './utils';

const ratios = async ({ body }, context, callback) => {
  const { url } = typeof body === 'string' ? JSON.parse(body) : body;
  try {
    const chromeless = new Chromeless({ launchChrome: false });
    // const chromeless = new Chromeless();
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

    callback(null, successResponse(result));
  } catch (e) {
    console.log(`There was an ERROR`, e);
    callback(null, errorResponse({ success: false }));
  }
};

// runWarm function handles pings from the scheduler so you don't
// have to put that boilerplate in your function.
export default runWarm(ratios);
