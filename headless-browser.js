import puppeteer from 'puppeteer';
import dotenv from 'dotenv';

dotenv.config();

async function loginToYouTube(page) {
  const email = process.env.YOUTUBE_EMAIL;
  const password = process.env.YOUTUBE_PASSWORD;

  if (!email || !password) {
    throw new Error('YouTube credentials not found in environment variables');
  }

  // Navigate to YouTube login page
  await page.goto('https://accounts.google.com/signin/v2/identifier?service=youtube', { waitUntil: 'networkidle2' });

  // Enter email
  await page.type('input[type="email"]', email);
  await page.click('#identifierNext');
  await page.waitForNavigation({ waitUntil: 'networkidle2' });

  // Enter password
  await page.waitForSelector('input[type="password"]', { visible: true });
  await page.type('input[type="password"]', password);
  await page.click('#passwordNext');
  await page.waitForNavigation({ waitUntil: 'networkidle2' });

  // Optionally, handle 2FA if enabled
  // await page.waitForSelector('input[type="tel"]', { visible: true });
  // await page.type('input[type="tel"]', 'your-2fa-code');
  // await page.click('#idvPreregisteredPhoneNext');
  // await page.waitForNavigation({ waitUntil: 'networkidle2' }); // Replace waitForTimeout
}

async function watchVideoInBackground(videoUrl) {
  const browser = await puppeteer.launch({
    headless: false,
    timeout: 240000,
    executablePath: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    userDataDir: 'C:\\chrome-user-data'
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
    await new Promise(resolve => setTimeout(resolve, 30000)); // Replace waitForTimeout
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