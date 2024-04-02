module.exports = {
  '**/*.(ts|tsx)': () => 'tsc --noEmit',
  '**/*.(ts|tsx|js|jsx|json)': (/** @type {string[]} */ filenames) => [
    `eslint --format=mo --fix ${filenames.join(' ')}`,
    `prettier --write ${filenames.join(' ')}`,
  ],
  '**/*.(md|css)': (/** @type {string[]} */ filenames) => [`prettier --write ${filenames.join(' ')}`],
};
