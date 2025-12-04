const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function testComponentPreview() {
  console.log('Starting component preview test...');
  
  // Get the URL of the PremiumNavBar demo
  const demoUrl = `file://${path.resolve(__dirname, '../site/public/demos/PremiumNavBar.html')}`;
  console.log(`Testing demo URL: ${demoUrl}`);
  
  // Launch browser
  const browser = await puppeteer.launch({ 
    headless: false, // We want to see the browser for debugging
    devtools: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    // Create a new page
    const page = await browser.newPage();
    
    // Listen for console messages
    page.on('console', msg => {
      console.log(`Browser console [${msg.type()}]: ${msg.text()}`);
      
      // Check for specific error patterns
      const text = msg.text();
      if (text.includes('ReactDOM is not defined')) {
        console.error('DIAGNOSIS: ReactDOM is not properly loaded');
        console.log('SOLUTION: Check that React and ReactDOM are loaded from CDN before the component bundle');
      } else if (text.includes('React is not defined')) {
        console.error('DIAGNOSIS: React is not properly loaded');
        console.log('SOLUTION: Check that React is loaded from CDN before the component bundle');
      } else if (text.includes('DemoComponent is not defined')) {
        console.error('DIAGNOSIS: DemoComponent is not properly exported');
        console.log('SOLUTION: Check that the component is properly bundled with globalName: "DemoComponent"');
      } else if (text.includes('Mount failed')) {
        console.error('DIAGNOSIS: Component mounting failed');
        console.log('SOLUTION: Check that React and ReactDOM are properly initialized');
      }
    });
    
    // Listen for page errors
    page.on('pageerror', error => {
      console.error('Page error:', error.message);
    });
    
    // Listen for request failures
    page.on('requestfailed', request => {
      console.error('Request failed:', request.url(), request.failure().errorText);
    });
    
    // Navigate to the demo page
    console.log('Navigating to demo page...');
    await page.goto(demoUrl, { waitUntil: 'networkidle0', timeout: 30000 });
    
    // Wait for some time to let the component render
    console.log('Waiting for component to render...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Check if the component rendered by looking for specific elements
    try {
      // Look for the PremiumNavBar component
      const navBar = await page.$('nav.bg-gradient-to-r');
      if (navBar) {
        console.log('SUCCESS: PremiumNavBar component rendered successfully!');
        
        // Take a screenshot for verification
        const screenshotPath = path.resolve(__dirname, '../site/public/demos/PremiumNavBar-test.png');
        await page.screenshot({ path: screenshotPath, fullPage: true });
        console.log(`Screenshot saved to: ${screenshotPath}`);
      } else {
        console.error('ISSUE: PremiumNavBar component not found in DOM');
        console.log('Taking screenshot for debugging...');
        
        // Take a screenshot to see what's actually rendered
        const screenshotPath = path.resolve(__dirname, '../site/public/demos/PremiumNavBar-error.png');
        await page.screenshot({ path: screenshotPath, fullPage: true });
        console.log(`Screenshot saved to: ${screenshotPath}`);
      }
    } catch (error) {
      console.error('Error checking component rendering:', error.message);
    }
    
    // Get all console messages
    console.log('Getting all console messages...');
    const logs = await page.evaluate(() => {
      return JSON.stringify(window.consoleLogs || []);
    });
    
    console.log('Console logs:', logs);
    
    // Close the browser
    await browser.close();
    console.log('Test completed.');
  } catch (error) {
    console.error('Test failed:', error.message);
    await browser.close();
    process.exit(1);
  }
}

// Run the test
testComponentPreview().catch(err => {
  console.error('Test script failed:', err);
  process.exit(1);
});