import { errorResponse, runWarm, successResponse } from './utils';
import { getRatios, openPage, screenshotTweet } from './page-actions';
import { upload } from './s3';
import getBrowser from './utils/get-browser';

const screenshot = async ({ body }, context, callback) => {
  // For keeping the browser launch b/w runs?
  context.callbackWaitsForEmptyEventLoop = false; // eslint-disable-line
  console.log('getting browser for screenshot');
  const browser = await getBrowser();
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
    const ratios = await getRatios(page);
    console.log('got ratios', ratios);
    const screenshotPath = await screenshotTweet(page);
    console.log('got screenshot', screenshotPath);
    const s3File = await upload(screenshotPath);
    console.log('got s3File', s3File);

    await page.close();
    console.log('closed page');
    return callback(
      null,
      successResponse({ ratios: await ratios, screenshot: await s3File })
    );
  } catch (e) {
    if (page) await page.close();
    console.log(`There was an ERROR`, e);
    return callback(null, errorResponse({ success: false, error: true }));
  }
};

// runWarm function handles pings from the scheduler so you don't
// have to put that boilerplate in your function.
export default runWarm(screenshot);
