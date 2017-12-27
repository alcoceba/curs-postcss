var gulp = require('gulp');
var postcss = require('gulp-postcss');
var sass = require('gulp-sass');

// Permet refrescar a tots els navegadors oberts
var browserSync = require('browser-sync');


// ----------------
// POST CSS Plugins
// ----------------

// Per fer bonic un CSS per una guia d'estils o el que sigui
var perfectionist = require('perfectionist');

// Per prefixar el codi CSS antic per a X versions del navegador
var autoprefixer = require('autoprefixer');

// Ens connecta directament a caniuse.com
var doiuse = require('doiuse');

// Lint CSS
var stylelint = require('stylelint');

// És un minifier
var csswring = require('csswring');

// Per debugar post css
var debug = require('postcss-debug').createDebugger();

// MY CUSTOM PLUGINS
var fontStackPostCss = require('./post-css-plugins/font-stack');
var colorInverter = require('./post-css-plugins/color-inverter');



// Per veure els canvis tant a l'HTML com al CSS
// Fem servir el browserSync per refrescar arreu
gulp.task('serve', ['styles'], function() {

  browserSync.init({
    server: "./"
  });

  gulp.watch("**/*.scss", ['styles', browserSync.reload]);
  gulp.watch("*.html").on('change', browserSync.reload);

});

// Tasca gulp pels styles
gulp.task('styles', function() {

  var processorsPostCSS = [
    autoprefixer({
      browsers: ['last 2 versions']
    }),
    fontStackPostCss,
    colorInverter,
    // perfectionist,
    // csswring,
		// stylelint({}) // Falta completar amb els paràmetres per inicialitzar
  ];

  // On són el fitxers sass, a partir d'aquí, retorna un stream que
  // pipegem a una altra funció sass(), postcss(), etc. Finalment
  // guardem el resultat a la carpeta dist
  return gulp.src('styles.scss')
    .pipe(sass())
		// Sense debug
		// .pipe(postcss(processorsPostCSS))
		// EN cas que volguem fer debug
		.pipe(postcss(debug(processorsPostCSS)))
    .pipe(gulp.dest('./dist'));

});

// Per fer un watch dels canvis que fem al fitxer metre desenvolupem
gulp.task('watch:styles', function() {
  gulp.watch('**/*.scss', ['styles']);
});

// Tasca per fer debug, això ens fa de TRIGGER pel debug que tenim a la pestanya styles
// Si volem debugar la tasca que hem de llençar és aquesta
gulp.task('css-debug', ['styles'], function() {
  // 3rd change: open the web inspector
  debug.inspect();
});
