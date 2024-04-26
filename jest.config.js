module.exports = {
  moduleFileExtensions: [
    'js',
    'json',
    'jsx',
    'ts',
    'tsx',
  ],
  testEnvironment: 'node',
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.json',
      },
    ],
  },
  preset: 'ts-jest',
}