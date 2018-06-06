import getBrowser from './utils/get-browser';

const restartChrome = async (props, context, callback) => {
  const browser = await getBrowser();
  await browser.close();
  console.log('closed browser');
  return callback(null, 'browser closed');
};

// runWarm function handles pings from the scheduler so you don't
// have to put that boilerplate in your function.
export default restartChrome;
