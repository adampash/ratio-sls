import puppeteerLambda from 'puppeteer-lambda';

import { errorResponse, runWarm, successResponse } from './utils';
import { getRatios, openPage } from './page-actions';

const ratios = async ({ body }, context, callback) => {
  const browser = await puppeteerLambda.getBrowser({
    headless: true,
  });

  const { url } = typeof body === 'string' ? JSON.parse(body) : body;
  let page;
  try {
    const { page: newPage } = await openPage({
      url,
      closeOnError: false,
      browser,
    });
    page = newPage;
    const tweetRatios = await getRatios(page);
    await page.close();
    callback(null, successResponse(await tweetRatios));
  } catch (e) {
    if (page) await page.close();
    console.log(`There was an ERROR`, e);
    callback(null, errorResponse({ success: false }));
  }
  callback(null, successResponse(await getRatios(url)));
};

// runWarm function handles pings from the scheduler so you don't
// have to put that boilerplate in your function.
export default runWarm(ratios);
