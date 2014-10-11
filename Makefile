test:
	npm test

test-cov:
	./node_modules/istanbul/lib/cli.js cover -- ./node_modules/mocha/bin/_mocha -R spec

test-browser:
	gulp testscript && ./node_modules/.bin/karma start karma.conf.js --browsers=PhantomJS --single-run=true

compile: 
	gulp build

.PHONY: compile test test-cov test-browser
