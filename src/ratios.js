import { Chromeless } from 'chromeless';

import { errorResponse, runWarm, successResponse } from './utils';

const USER_AGENT =
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.50 Safari/537.36';
const ratios = async ({ body }, context, callback) => {
  const { url } = typeof body === 'string' ? JSON.parse(body) : body;
  try {
    const REPLY_SELECTOR =
      '.js-original-tweet .stream-item-footer .ProfileTweet-actionCountForPresentation';
    const chromeless = new Chromeless({ launchChrome: false });
    const result = await chromeless
      .setUserAgent(USER_AGENT)
      .goto(url)
      .wait(REPLY_SELECTOR)
      .evaluate(() => {
        const SELECTOR =
          '.js-original-tweet .stream-item-footer .ProfileTweet-actionCountForPresentation';
        // eslint-disable-next-line
        const ratioBits = $(SELECTOR);
        return {
          replies: ratioBits[0].innerHTML,
          retweets: ratioBits[1].innerHTML,
          likes: ratioBits[3].innerHTML,
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
