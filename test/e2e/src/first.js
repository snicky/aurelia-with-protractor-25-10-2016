describe('aurelia app', () => {
  beforeEach(() => {
    browser.loadAndWaitForAureliaPage('http://localhost:9000');
  });

  it('should has the correct page title', () => {
    expect(browser.getTitle()).toBe('Aurelia');
  });
});
