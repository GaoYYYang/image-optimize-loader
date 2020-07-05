import {
  compile,
  getCompiler,
  getErrors,
  getWarnings,
  readAsset,
} from './helpers';

test('loader', async () => {
  // it('should work', async () => {
  const compiler = getCompiler('index.js');
  const stats = await compile(compiler);
  expect(readAsset('main.bundle.js', compiler, stats)).toBeTruthy();
  expect(getErrors(stats).length).toBe(0);
  expect(getWarnings(stats).length).toBe(0);
  // });
});
