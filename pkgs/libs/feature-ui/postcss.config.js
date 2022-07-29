// order matters: postcss-import -> tailwind -> everything else
module.exports = {
  plugins: [
    require('postcss-import'),
    require('tailwindcss'),
    require('precss'),
    require('postcss-extend'),
    require('autoprefixer'),
  ],
}
