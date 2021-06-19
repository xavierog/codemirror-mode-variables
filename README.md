# CodeMirror variables mode

This is a [CodeMirror](https://codemirror.net/) mode that provides syntax highlighting for variables in arbitrary contexts (e.g. variables that appear in a string for later interpolation).

## How to use
### Basic use
Load `variables.js` at an adequate location in your HTML structure.
Mention `mode: 'variables'` when creating your CodeMirror instance.

### Configuration
By default, codemirror-mode-variables highlights basic shell-like variables like `$foo` and `${bar}`.
It supports custom variable patterns and the CodeMirror tokens it returns can be customised too. Refer to the demo page for further explanations.

### Theming
Unless customised, this mode leverages CodeMirror's default tokens and should therefore fit in with all CodeMirror themes.

### Nesting
codemirror-mode-variables can be nested within another mode, i.e. it can highlight variables for another mode.
This requires adjusting the other mode though.
See the demo page for an example of such nesting.

## License
This mode is released under the 3-clause BSD license.
