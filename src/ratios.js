import { Chromeless } from 'chromeless';

import { errorResponse, runWarm, successResponse } from './utils';

const ratios = async ({ body }, context, callback) => {
  const { url } = typeof body === 'string' ? JSON.parse(body) : body;
  try {
    const REPLY_SELECTOR =
      '.js-original-tweet .stream-item-footer .ProfileTweet-actionCountForPresentation';
    const chromeless = new Chromeless();
    const result = await chromeless
      .goto(url)
      .wait(REPLY_SELECTOR)
      .evaluate(() => {
        const SELECTOR =
          '.js-original-tweet .stream-item-footer .ProfileTweet-actionCountForPresentation';
        // eslint-disable-next-line
        const ratioBits = $(SELECTOR);
        return {
          likes: ratioBits[0].innerHTML,
          retweets: ratioBits[1].innerHTML,
          replies: ratioBits[3].innerHTML,
        };
      });

    console.log(`result`, result);
    // const response = await result.json();

    // console.log(`response`, response);

    callback(
      null,
      successResponse({
        success: true,
      })
    );
  } catch (e) {
    console.log(`There was an ERROR`, e);
    callback(null, errorResponse({ success: false }));
  }

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
};

// runWarm function handles pings from the scheduler so you don't
// have to put that boilerplate in your function.
export default runWarm(ratios);
