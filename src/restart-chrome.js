import getBrowser from './utils/get-browser';

const restartChrome = async (props, context, callback) => {
  const browser = await getBrowser();
  await browser.close();
  await getBrowser();
  return callback(null, 'browser restarted');
};

// runWarm function handles pings from the scheduler so you don't
// have to put that boilerplate in your function.
export default restartChrome;
