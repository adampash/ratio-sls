import { Chromeless } from 'chromeless';

import { REPLY_SELECTOR, USER_AGENT } from './constants';
import { errorResponse, runWarm, successResponse } from './utils';

const ratios = async ({ body }, context, callback) => {
  const { url } = typeof body === 'string' ? JSON.parse(body) : body;
  try {
    const chromeless = new Chromeless({ launchChrome: false });
    const result = await chromeless
      .setUserAgent(USER_AGENT)
      .goto(url)
      .wait(REPLY_SELECTOR)
      .evaluate(() => {
        const SELECTOR =
          '.tweet.permalink-tweet .stream-item-footer .ProfileTweet-actionCountForPresentation';
        // eslint-disable-next-line
        const ratioBits = $(SELECTOR);
        return {
          replies: parseInt(ratioBits[0].innerHTML, 10) || 0,
          retweets: parseInt(ratioBits[1].innerHTML, 10) || 0,
          likes: parseInt(ratioBits[3].innerHTML, 10) || 0,
        };
      });
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
