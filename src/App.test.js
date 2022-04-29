describe('something truthy and falsy', () => {
  test('true to be true', () => {
    expect(true).toBe(true);
  });

  test('expect false to be false', () => {
    expect(false).toBe(false);
  });
});