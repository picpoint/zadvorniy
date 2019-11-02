const gulp = require('gulp');
const less = require('gulp-less');
const htmlmin = require('gulp-htmlmin');
const smartgrid = require('smart-grid');
const browserSync = require('browser-sync').create();


const smartGrigConf = {
  outputStyle: 'less',
  colums: 12,
  offset: '30px',   // межклоночник
  mobileFirst: false,
  container: {
    maxWidth: '1280px',
    fields: '30px'   // отступ от края экрана
  },
  breakPoints: {
    mgxl: {
      width: '1800px',
      fields: '30px'
    },
    xxl: {
      width: '1400px',
      fields: '30px'
    },
    xl: {
      width: '1140px',
      fields: '30px'
    },
    lg: {
      width: '960px',
      fields: '30px'
    },
    md: {
      width: '720px',
      fields: '20px'
    },
    sm: {
      width: '540px',
      fields: '10px'
    },
    xs: {
      width: '480px',
      fields: '5px'
    }
  }
};


