import puppeteer from 'puppeteer';

async function watchVideoInBackground(videoUrl) {
  const browser = await puppeteer.launch({
    headless: true,
    timeout: 240000, // Increased timeout to 240 seconds
    executablePath: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe', // Adjust the path accordingly
    userDataDir: 'C:\\chrome-user-data' // Adjust the path accordingly
  });

  const page = await browser.newPage();

  try {
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
    await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 30000)));
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