module.exports = {
  default: {
    paths: ['features/**/*.feature'],
    import: ['features/steps/**/*.ts'],
    format: ['progress-bar', 'html:cucumber-report.html'],
  },
};