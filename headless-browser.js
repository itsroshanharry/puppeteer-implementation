import puppeteer from 'puppeteer';

async function loginToYouTube(page) {
  // Navigate to YouTube login page
  await page.goto('https://accounts.google.com/signin/v2/identifier?service=youtube', { waitUntil: 'networkidle2' });

  // Enter email
  await page.type('input[type="email"]', 'roshandhoni202@gmail.com');
  await page.click('#identifierNext');
  await page.waitForTimeout(3000); // Wait for transition

  // Enter password
  await page.waitForSelector('input[type="password"]', { visible: true });
  await page.type('input[type="password"]', 'minatoNamikaze4_');
  await page.click('#passwordNext');
  await page.waitForTimeout(5000); // Wait for transition and login

  // Optionally, handle 2FA if enabled
  // await page.waitForSelector('input[type="tel"]', { visible: true });
  // await page.type('input[type="tel"]', 'your-2fa-code');
  // await page.click('#idvPreregisteredPhoneNext');
  // await page.waitForTimeout(5000); // Wait for transition and login
}

async function watchVideoInBackground(videoUrl) {
  const browser = await puppeteer.launch({
    headless: false, // Set to false to see the browser actions
    timeout: 240000, // Increased timeout to 240 seconds
    executablePath: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe', // Adjust the path accordingly
    userDataDir: 'C:\\chrome-user-data' // Adjust the path accordingly
  });

  const page = await browser.newPage();

  try {
    console.log('Logging in to YouTube');
    await loginToYouTube(page);

    console.log(`Navigating to ${videoUrl}`);
    await page.goto(videoUrl, { waitUntil: 'networkidle2' });

    // Play the video
    await page.evaluate(() => {
      const videoElement = document.querySelector('video');
      if (videoElement) {
        videoElement.play();
      }
    });

    // Simulate watching the video for a fixed duration (e.g., 30 seconds)
    console.log('Watching video for 30 seconds');
    await page.waitForTimeout(30000);
    console.log('Finished watching video');
  } catch (error) {
    console.error('Error watching video:', error);
  } finally {
    await page.close();
    await browser.close();
  }
}

const videoUrl = process.argv[2];

if (!videoUrl) {
  console.error('YouTube video URL is required.');
  process.exit(1);
}

watchVideoInBackground(videoUrl);
