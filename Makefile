test:
	npm test

test-cov:
	./node_modules/istanbul/lib/cli.js cover -- ./node_modules/mocha/bin/_mocha -R spec

compile: 
	gulp build

.PHONY: compile test test-cov
