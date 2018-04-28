import { Chromeless } from 'chromeless';

import { USER_AGENT } from './constants';
import { errorResponse, runWarm, successResponse } from './utils';

const screenshotTweet = async ({ body }, context, callback) => {
  const { url } = typeof body === 'string' ? JSON.parse(body) : body;
  try {
    const ORIGINAL_TWEET = '.tweet.permalink-tweet';
    const chromeless = new Chromeless({ launchChrome: false });
    const screenshot = await chromeless
      .setUserAgent(USER_AGENT)
      .goto(url)
      .wait(ORIGINAL_TWEET)
      .screenshot(ORIGINAL_TWEET);
    await chromeless.end();

    callback(null, successResponse(screenshot));
  } catch (e) {
    console.log(`There was an ERROR`, e);
    callback(null, errorResponse({ success: false }));
  }
};

// runWarm function handles pings from the scheduler so you don't
// have to put that boilerplate in your function.
export default runWarm(screenshotTweet);
