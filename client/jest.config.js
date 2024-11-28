// jest.config.js
export default {
  // Your Jest configuration options
  testEnvironment: 'jsdom', // Change from 'node' to 'jsdom'
  // Add other configuration options as needed

  // Add this configuration to mock CSS imports
  moduleNameMapper: {
    '\\.(css|less)$': 'identity-obj-proxy',
  },
};