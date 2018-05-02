import { Chromeless } from 'chromeless';

import { USER_AGENT } from './constants';
import { errorResponse, runWarm, successResponse } from './utils';
import { upload } from './s3';

const screenshotTweet = async ({ body }, context, callback) => {
  const { url } = typeof body === 'string' ? JSON.parse(body) : body;
  try {
    const ORIGINAL_TWEET = '.permalink-inner.permalink-tweet-container';
    const chromeless = new Chromeless({ launchChrome: false });
    // const chromeless = new Chromeless();
    const screenshot = await chromeless
      .setUserAgent(USER_AGENT)
      .goto(url)
      .wait(ORIGINAL_TWEET)
      .screenshot(ORIGINAL_TWEET);
    await chromeless.end();

    const s3File = await upload(screenshot);

    callback(null, successResponse({ screenshot: s3File }));
  } catch (e) {
    console.log(`There was an ERROR`, e);
    callback(null, errorResponse({ success: false }));
  }
};

// runWarm function handles pings from the scheduler so you don't
// have to put that boilerplate in your function.
export default runWarm(screenshotTweet);
