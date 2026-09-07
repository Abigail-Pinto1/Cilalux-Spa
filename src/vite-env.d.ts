export {};

// 2. Extend the global Window interface
declare global {
  interface Window {
    // Add whatever properties are throwing errors in your app here.
    // Examples:
    config?: any;
    env?: any;
    ethereum?: any; 
  }
}