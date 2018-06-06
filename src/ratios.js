import { errorResponse, runWarm, successResponse } from './utils';
import { getRatios, openPage } from './page-actions';
import getBrowser from './utils/get-browser';
// import puppeteer from 'puppeteer'

const ratios = async ({ body }, context, callback) => {
  // For keeping the browser launch b/w runs?
  context.callbackWaitsForEmptyEventLoop = false; // eslint-disable-line
  const browser = await getBrowser();
  // const browser = puppeteer.launch()
  console.log('got browser');

  const { url } = typeof body === 'string' ? JSON.parse(body) : body;
  let page;
  try {
    const { page: newPage } = await openPage({
      url,
      closeOnError: false,
      browser,
    });
    page = newPage;
    console.log('got page');
    const tweetRatios = await getRatios(page);
    console.log('got ratios', tweetRatios);
    await page.close();
    console.log('closed page');
    return callback(null, successResponse(tweetRatios));
  } catch (e) {
    if (page) await page.close();
    console.log(`There was an ERROR`, e);
    return callback(null, errorResponse({ success: false, error: true }));
  }
};

// runWarm function handles pings from the scheduler so you don't
// have to put that boilerplate in your function.
export default runWarm(ratios);
