test-cov:
	./node_modules/istanbul/lib/cli.js cover -- ./node_modules/mocha/bin/_mocha -R spec

compile: 
	gulp inline
	gulp

.PHONY: compile test test-cov
