(identifier) @variable

((identifier) @constant
 (#match? @constant "^[A-Z][A-Z\\d_]*$"))

[
  "include"
  "defer"
] @keyword.directive

[
  "if"
  "else"
  "while"  
] @keyword.conditional

[
  "return"
  "break"
  "continue"
] @keywork.control

"func" @keyword
"proto" @keyword
"def" @keyword
"typedef" @keyword
"eval" @keyword
"as" @keyword
"test" @keyword

[
  "and"
  "or"
  "not"
  ":="
  "\\"
  "&"
  "|"
  "^"
  "~"
  "<<"
  ">>"
  "$"
  "->"
  "#"
  "@"
  "+"
  "-"
  "*"
  "/"
  "%"
  "<="
  ">="
  "<>"
  "<"
  ">"
  "="
] @operator

["," "." ":" ";"] @punctuation.delimeter

["(" ")" "[" "]" "{" "}"] @punctuation.bracket

(const_string) @string
(const_integer) @contant.numeric
(const_char) @constant.character

(identifier) @variable

(comment) @comment
