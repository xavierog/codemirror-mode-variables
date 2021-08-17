CodeMirror.defineMode('variables', function(editor_options, mode_options) {
	// Default settings:
	var default_tokens = { // See DEFAULT THEME section in lib/codemirror.css
		base: 'string',
		escape: 'string',
		error: 'error',
		name: 'variable-2',
		prefix: 'string strong',
		suffix: 'string strong',
	};
	var escape_sequences = '\\$';
	var variable_patterns = [
		{prefix: '${', suffix: '}', name: /\w+/ },
		{prefix: '$',               name: /\w+/ },
	];

	// Override default settings with user-provided settings:
	if (mode_options.base_token) default_tokens.base = mode_options.base_token;
	if (mode_options.escape_token) default_tokens.escape = mode_options.escape_token;
	if (mode_options.escape_sequences) escape_sequences = mode_options.escape_sequences;
	if (mode_options.variable_patterns) variable_patterns = mode_options.variable_patterns;

	// Helper functions:
	function current_pattern(state) {
		if (state.context === -1) return false;
		return variable_patterns[state.context];
	}
	function token(state, token_type) {
		var key, pattern;
		if (pattern = current_pattern(state)) {
			key = token_type + '_token';
			if (key in pattern) return pattern[key];
		}
		return default_tokens[token_type];
	}
	function consume(stream, state, return_token) {
		// Our main use case is being a nested mode. As such, we should not
		// consume too much as it is up to the nesting mode to decide what this
		// mode should tokenize. That said, consuming \w is not expected to
		// hurt:
		if (!stream.match(/\w+/)) stream.next();
		return token(state, return_token);
	}

	function handle_variable_pattern(stream, state, pattern) {
		var rem;
		// Do we expect a name?
		if (!state.name.length) {
			if (rem = stream.match(pattern.name)) {
				state.name = rem[0];
				return token(state, 'name');
			}
			return consume(stream, state, 'error');
		}
		// Do we expect a suffix?
		if ('suffix' in pattern) {
			if (stream.match(pattern.suffix)) {
				state.context = -1;
				return token(state, 'suffix');
			}
			return consume(stream, state, 'error');
		}
		// No? Then we are done here.
		state.context = -1;
		return tokenBase(stream, state);
	}

	function tokenBase(stream, state) {
		var i, pattern;
		if (!stream.peek()) return;

		if (pattern = current_pattern(state)) return handle_variable_pattern(stream, state, pattern);

		if (escape_sequences && stream.match(escape_sequences)) return token(state, 'escape');
		// Try all known patterns in the order they are provided:
		for (i = 0; i < variable_patterns.length; ++ i) {
			if (stream.match(variable_patterns[i].prefix)) {
				state.context = i;
				state.name = '';
				return token(state, 'prefix');
			}
		}
		return consume(stream, state, 'base');
	}

	function startState() {
		return {
			context: -1,
			name: '',
		};
	}

	return {
		startState: startState,
		token: tokenBase,
	};
});

CodeMirror.defineMIME('text/x-variables', 'variables');
