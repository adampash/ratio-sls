import puppeteerLambda from 'puppeteer-lambda';

import { errorResponse, runWarm, successResponse } from './utils';
import { getRatios, openPage } from './page-actions';
import { upload } from './s3';

const screenshotTweet = async ({ body }, context, callback) => {
  const { url } = typeof body === 'string' ? JSON.parse(body) : body;
  const browser = await puppeteerLambda.getBrowser({
    headless: true,
  });

  let page;
  try {
    const { page: newPage } = await openPage({
      url,
      closeOnError: false,
      browser,
    });
    page = newPage;
    const ratios = await getRatios(page);
    const screenshot = await screenshotTweet(page);
    const s3File = await upload(screenshot);

    await page.close();
    callback(
      null,
      successResponse({ ratios: await ratios, screenshot: await s3File })
    );
  } catch (e) {
    if (page) await page.close();
    console.log(`There was an ERROR`, e);
    callback(null, errorResponse({ success: false }));
  }
};

// runWarm function handles pings from the scheduler so you don't
// have to put that boilerplate in your function.
export default runWarm(screenshotTweet);
