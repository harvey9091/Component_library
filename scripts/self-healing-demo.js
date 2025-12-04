const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { execSync, exec } = require('child_process');

// Configuration
const MAX_ATTEMPTS = 5;
const WAIT_TIME = 5000;

// Diagnostic patterns
const DIAGNOSTIC_PATTERNS = {
  'REACT_NOT_DEFINED': {
    pattern: /React is not defined/,
    diagnosis: 'React is not properly loaded',
    solution: 'Check that React is loaded from CDN before the component bundle'
  },
  'REACTDOM_NOT_DEFINED': {
    pattern: /ReactDOM is not defined/,
    diagnosis: 'ReactDOM is not properly loaded',
    solution: 'Check that ReactDOM is loaded from CDN before the component bundle'
  },
  'DEMOCOMPONENT_NOT_DEFINED': {
    pattern: /DemoComponent is not defined/,
    diagnosis: 'DemoComponent is not properly exported',
    solution: 'Check that the component is properly bundled with globalName: "DemoComponent"'
  },
  'MOUNT_FAILED': {
    pattern: /Mount failed/,
    diagnosis: 'Component mounting failed',
    solution: 'Check that React and ReactDOM are properly initialized'
  },
  'ROOT_ELEMENT_NOT_FOUND': {
    pattern: /Root element not found/,
    diagnosis: 'Root element not found',
    solution: 'Check that the HTML has a div with id="root"'
  }
};

async function runBuildProcess() {
  console.log('Running build process...');
  try {
    execSync('npm run build-demo', { stdio: 'inherit' });
    console.log('Build process completed successfully');
    return true;
  } catch (error) {
    console.error('Build process failed:', error.message);
    return false;
  }
}

async function testComponentPreview() {
  console.log('Starting component preview test...');
  
  // Get the URL of the PremiumNavBar demo
  const demoUrl = `file://${path.resolve(__dirname, '../site/public/demos/PremiumNavBar.html')}`;
  console.log(`Testing demo URL: ${demoUrl}`);
  
  // Launch browser
  const browser = await puppeteer.launch({ 
    headless: true, // Headless for automated testing
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  // Capture console messages
  const consoleMessages = [];
  page.on('console', msg => {
    consoleMessages.push({
      type: msg.type(),
      text: msg.text()
    });
  });
  
  // Capture page errors
  const pageErrors = [];
  page.on('pageerror', error => {
    pageErrors.push(error.message);
  });
  
  // Capture request failures
  const requestFailures = [];
  page.on('requestfailed', request => {
    requestFailures.push({
      url: request.url(),
      error: request.failure().errorText
    });
  });
  
  try {
    // Navigate to the demo page
    console.log('Navigating to demo page...');
    await page.goto(demoUrl, { waitUntil: 'networkidle0', timeout: 30000 });
    
    // Wait for some time to let the component render
    console.log('Waiting for component to render...');
    await new Promise(resolve => setTimeout(resolve, WAIT_TIME));
    
    // Check if the component rendered by looking for specific elements
    const navBar = await page.$('nav.bg-gradient-to-r');
    
    // Close the browser
    await browser.close();
    
    return {
      success: !!navBar,
      consoleMessages,
      pageErrors,
      requestFailures
    };
  } catch (error) {
    await browser.close();
    return {
      success: false,
      error: error.message,
      consoleMessages,
      pageErrors,
      requestFailures
    };
  }
}

function diagnoseIssues(testResult) {
  const issues = [];
  
  // Check console messages
  for (const msg of testResult.consoleMessages) {
    for (const [key, diagnostic] of Object.entries(DIAGNOSTIC_PATTERNS)) {
      if (diagnostic.pattern.test(msg.text)) {
        issues.push({
          type: key,
          message: msg.text,
          diagnosis: diagnostic.diagnosis,
          solution: diagnostic.solution
        });
      }
    }
  }
  
  // Check page errors
  for (const error of testResult.pageErrors) {
    for (const [key, diagnostic] of Object.entries(DIAGNOSTIC_PATTERNS)) {
      if (diagnostic.pattern.test(error)) {
        issues.push({
          type: key,
          message: error,
          diagnosis: diagnostic.diagnosis,
          solution: diagnostic.solution
        });
      }
    }
  }
  
  // Check request failures
  for (const failure of testResult.requestFailures) {
    if (failure.url.includes('react') || failure.url.includes('react-dom')) {
      issues.push({
        type: 'CDN_LOAD_FAILED',
        message: `Failed to load ${failure.url}: ${failure.error}`,
        diagnosis: 'Failed to load React or ReactDOM from CDN',
        solution: 'Check CDN URLs or try alternative sources'
      });
    }
  }
  
  return issues;
}

function applyFixes(issues) {
  console.log('Applying fixes for detected issues...');
  
  // For now, we'll just log the issues and solutions
  // In a more advanced implementation, we could automatically modify files
  for (const issue of issues) {
    console.log(`ISSUE: ${issue.diagnosis}`);
    console.log(`SOLUTION: ${issue.solution}`);
  }
  
  // If we had specific fixes to apply, we would do them here
  // For example, we could modify the HTML template in build-demo.js
  
  return issues.length > 0;
}

async function selfHealingDemo() {
  console.log('Starting self-healing demo system...');
  
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    console.log(`\n=== ATTEMPT ${attempt}/${MAX_ATTEMPTS} ===`);
    
    // Run build process
    const buildSuccess = await runBuildProcess();
    if (!buildSuccess) {
      console.error('Build failed, cannot continue');
      process.exit(1);
    }
    
    // Test component preview
    const testResult = await testComponentPreview();
    
    if (testResult.success) {
      console.log('✅ SUCCESS: Component preview is working correctly!');
      return true;
    }
    
    console.log('❌ ISSUE: Component preview is not working');
    
    // Diagnose issues
    const issues = diagnoseIssues(testResult);
    
    if (issues.length === 0) {
      console.log('⚠️  WARNING: No specific issues diagnosed, but component is not rendering');
    } else {
      console.log(`🔍 DIAGNOSED ${issues.length} ISSUES:`);
      for (const issue of issues) {
        console.log(`  - ${issue.diagnosis}`);
        console.log(`    Solution: ${issue.solution}`);
      }
    }
    
    // Apply fixes
    const fixesApplied = applyFixes(issues);
    
    if (!fixesApplied) {
      console.log('ℹ️  No automatic fixes applied, continuing to next attempt...');
    }
    
    // If this is the last attempt, exit with error
    if (attempt === MAX_ATTEMPTS) {
      console.error('💥 FAILED: Maximum attempts reached without success');
      process.exit(1);
    }
    
    // Wait before next attempt
    console.log(`⏳ Waiting ${WAIT_TIME/1000} seconds before next attempt...`);
    await new Promise(resolve => setTimeout(resolve, WAIT_TIME));
  }
}

// Run the self-healing system
selfHealingDemo().catch(err => {
  console.error('Self-healing system failed:', err);
  process.exit(1);
});