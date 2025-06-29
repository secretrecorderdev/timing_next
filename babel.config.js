module.exports = {
  presets: [
    ['next/babel', {
      'preset-react': {
        runtime: 'automatic' // ✅ Modern JSX Transform
      }
    }]
  ]
};