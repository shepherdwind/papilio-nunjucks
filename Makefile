BIN := ./node_modules/.bin
cov:
	@node --harmony $(BIN)/istanbul cover \
	  $(BIN)/_mocha -- \
	    --reporter mocha-lcov-reporter \
	    --timeout 5s \
			test \
			&& cat ./coverage/lcov.info | \
			$(BIN)/coveralls --verbose
