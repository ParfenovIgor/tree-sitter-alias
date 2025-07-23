/**
 * @file Alias grammar for tree-sitter
 * @author Igor Parfenov
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "alias",

  extras: $ => [
    /\s|\\\r?\n/,
    $.comment,
  ],

  rules: {
    source_file: $ => repeat($.top_level),

    block: $ => seq('{', repeat(choice($.statement, seq('defer', $.statement))), '}'),

    top_level: $ => choice(
      ';',
      $.include,
      $.test,
      $.function_definition,
      $.prototype,
      $.definition,
      $.typedef,
    ),

    eval: $ => seq('eval', $.expression),

    include: $ => choice(
      seq('include', '.', $.filename),
      seq('include', $.identifier, '.', $.filename),
    ),

    test: $ => seq('test', $.identifier, $.expression),

    function_argument: $ => seq($.identifier, $.type),

    function_arguments: $ => choice(
      seq('(', ')', '->', $.type),
      seq('(', $.function_argument, ')', '->', $.type),
      seq('(', $.function_argument, repeat(seq(',', $.function_argument)), ')', '->', $.type),
    ),

    function_definition: $ => choice(
      seq('func', '.', $.identifier, $.function_arguments, $.expression),
      seq('func', $.identifier, '.', $.identifier, $.function_arguments, $.expression),
      seq('func', '^', '.', $.identifier, $.function_arguments, $.expression),
      seq('func', '^', $.identifier, '.', $.identifier, $.function_arguments, $.expression),
      seq('func', '.', $.identifier, '@', $.function_arguments, $.expression),
      seq('func', $.identifier, '.', $.identifier, '@', $.function_arguments, $.expression),
      seq('func', '^', '.', $.identifier, '@', $.function_arguments, $.expression),
      seq('func', '^', $.identifier, '.', $.identifier, '@', $.function_arguments, $.expression),
    ),

    prototype: $ => seq('proto', $.identifier, $.function_arguments),

    definition: $ => choice(
      seq('def', $.identifier, $.type),
      seq('def', $.identifier, ':=', $.expression),
      seq('def', $.identifier, $.type, ':=', $.expression),
    ),

    typedef: $ => seq('typedef', $.identifier, ':=', $.type),

    statement: $ => choice(
      ';',
      $.eval,
      $.test,
      $.function_definition,
      $.prototype,
      $.definition,
      $.typedef,
      $.return,
      $.break,
      $.continue,
      $.assignment,
      $.movement,
    ),

    return: $ => seq('return', $.expression),

    break: $ => seq('break', $.expression),

    continue: $ => seq('continue', $.expression),

    assignment: $ => choice(
      seq($.identifier, ':=', $.expression),
    ),

    movement: $ => seq($.expression, '<-', $.expression),

    types: $ => choice(
      $.type,
      seq($.type, repeat(seq(',', $.type))),
    ),

    field_type: $ => seq($.identifier, ':', $.type),
    
    field_types: $ => choice(
      $.field_type,
      seq($.field_type, repeat(seq(',', $.field_type))),
    ),
    
    type_internal: $ => choice(
      'V',
      'C',
      'I',
      seq('F', '(', ')', '->', $.type),
      seq('F', '(', $.types, ')', '->', $.type),
      seq('S', '{', '}'),
      seq('S', '{', $.field_types, '}'),
      $.identifier,
    ),
    
    type: $ => choice(
      seq('#', $.type_internal),
      seq('#', $.const_integer, $.type_internal),
    ),

    expression: $ => choice(
      prec.left(-1, $.primary),
      prec(-2, seq('-', $.expression)),
      prec(-2, seq('~', $.expression)),
      prec(-2, seq('not', $.expression)),
      prec.left(-3, seq($.expression, '*', $.expression)),
      prec.left(-3, seq($.expression, '/', $.expression)),
      prec.left(-3, seq($.expression, '%', $.expression)),
      prec.left(-4, seq($.expression, '+', $.expression)),
      prec.left(-4, seq($.expression, '-', $.expression)),
      prec.left(-5, seq($.expression, '<<', $.expression)),
      prec.left(-5, seq($.expression, '>>', $.expression)),
      prec.left(-6, seq($.expression, '<', $.expression)),
      prec.left(-6, seq($.expression, '>', $.expression)),
      prec.left(-6, seq($.expression, '<=', $.expression)),
      prec.left(-6, seq($.expression, '>=', $.expression)),
      prec.left(-7, seq($.expression, '=', $.expression)),
      prec.left(-7, seq($.expression, '<>', $.expression)),
      prec.left(-8, seq($.expression, '&', $.expression)),
      prec.left(-9, seq($.expression, '^', $.expression)),
      prec.left(-10, seq($.expression, '|', $.expression)),
      prec.left(-11, seq($.expression, 'and', $.expression)),
      prec.left(-12, seq($.expression, 'or', $.expression)),
      prec.left(-13, seq('(', $.expression, ')')),
      prec.left(-14, seq($.expression, 'as', $.type)),
    ),

    expressions: $ => choice(
      $.expression,
      seq($.expression, repeat(seq(',', $.expression))),
    ),

    field_value: $ => seq($.identifier, ':=', $.expression),

    field_values: $ => choice(
      $.field_value,
      seq($.field_value, repeat(seq(',', $.field_value))),
    ),
    
    primary: $ => choice(
      $.const_integer,
      $.const_char,
      $.const_string,
      $.struct_instance,
      $.lambda_function,
      $.sizeof,
      $.identifier,
      prec.left(1, seq($.identifier, '&')),
      '@',
      $.block,
      $.if,
      $.while,
      $.method_call,
      $.function_call,
      $.get_field,
      $.index,
      $.dereference,
    ),

    const_integer: $ => /[-]?[0-9]+/,
    
    const_char: $ => seq('\'', /[0-9A-Za-z]/, '\''),
    
    const_string: $ => seq('"', /[0-9A-Za-z]+/, '"'),

    filename: $ => seq('"', /[0-9A-Za-z_.]+/, '"'),
    
    identifier: $ => /[A-Za-z_]+[0-9A-Za-z_]*/,

    struct_instance: $ => choice(
      seq('.', '{', '}'),
      seq('.', '{', $.field_values, '}'),
    ),

    lambda_function: $ => choice(
      seq('\\', '(', ')', '->', $.expression),
      seq('\\', '(', $.types, ')', '->', $.expression),
    ),

    sizeof: $ => seq('$', $.type),

    if: $ => choice(
      prec.left(1, seq('if', '(', $.expression, ')', $.expression)),
      prec.left(1, seq('if', '(', $.expression, ')', $.expression, repeat(seq('else', 'if', '(', $.expression, ')', $.expression)))),
      prec.left(1, seq('if', '(', $.expression, ')', $.expression, 'else', $.expression)),
      prec.left(1, seq('if', '(', $.expression, ')', $.expression, repeat(seq('else', 'if', '(', $.expression, ')', $.expression)), 'else', $.expression)),
    ),

    while: $ => choice(
      prec.left(1, seq('while', '(', $.expression, ')', $.expression)),
      prec.left(1, seq('while', '(', $.expression, ')', $.expression, 'else', $.expression)),
    ),

    method_call: $ => choice(
      prec.left(1, seq($.primary, '.', $.identifier, '(', ')')),
      prec.left(1, seq($.primary, '.', $.identifier, '(', $.expressions, ')')),
    ),

    function_call: $ => choice(
      prec.left(1, seq($.primary, '(', ')')),
      prec.left(1, seq($.primary, '(', $.expressions, ')')),
      prec.left(1, seq($.primary, '(', '@', $.expression, ')')),
      prec.left(1, seq($.primary, '(', '@', $.expression, ',', $.expressions, ')')),
    ),

    get_field: $ => choice(
      prec.left(0, seq($.primary, '->', $.identifier)),
      prec.left(1, seq($.primary, '->', $.identifier, '&')),
    ),

    index: $ => choice(
      prec.left(1, seq($.primary, '[', $.expression, ']')),
    ),

    dereference: $ => choice(
      prec.left(1, seq($.primary, '$')),
    ),

    comment: _ => token(choice(
      seq('//', /(\\+(.|\r?\n)|[^\\\n])*/),
      seq(
        '/*',
        /[^*]*\*+([^/*][^*]*\*+)*/,
        '/',
      ),
    )),
  }

});
