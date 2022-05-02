import 'prismjs';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-abap';
import 'prismjs/components/prism-arduino';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-basic';
import 'prismjs/components/prism-clojure';
import 'prismjs/components/prism-coffeescript';
import 'prismjs/components/prism-csharp';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-dart';
import 'prismjs/components/prism-diff';
import 'prismjs/components/prism-docker';
import 'prismjs/components/prism-elixir';
import 'prismjs/components/prism-elm';
import 'prismjs/components/prism-erlang';
import 'prismjs/components/prism-flow';
import 'prismjs/components/prism-fortran';
import 'prismjs/components/prism-fsharp';
import 'prismjs/components/prism-gherkin';
import 'prismjs/components/prism-glsl';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-graphql';
import 'prismjs/components/prism-groovy';
import 'prismjs/components/prism-haskell';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-julia';
import 'prismjs/components/prism-kotlin';
import 'prismjs/components/prism-latex';
import 'prismjs/components/prism-less';
import 'prismjs/components/prism-lisp';
import 'prismjs/components/prism-livescript';
import 'prismjs/components/prism-lua';

import 'prismjs/components/prism-makefile';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-matlab';
import 'prismjs/components/prism-mermaid';
import 'prismjs/components/prism-nix';
import 'prismjs/components/prism-objectivec';
import 'prismjs/components/prism-ocaml';
import 'prismjs/components/prism-pascal';
import 'prismjs/components/prism-perl';
import 'prismjs/components/prism-php';
import 'prismjs/components/prism-powershell';
import 'prismjs/components/prism-prolog';
import 'prismjs/components/prism-protobuf';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-r';
import 'prismjs/components/prism-reason';
import 'prismjs/components/prism-ruby';
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-sass';
import 'prismjs/components/prism-scala';
import 'prismjs/components/prism-scheme';
import 'prismjs/components/prism-scss';
import 'prismjs/components/prism-solidity';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-swift';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-vbnet';
import 'prismjs/components/prism-verilog';
import 'prismjs/components/prism-vhdl';
import 'prismjs/components/prism-visual-basic';
import 'prismjs/components/prism-wasm';
import 'prismjs/components/prism-yaml';

import languages from 'prismjs/components.json';

console.log(languages);

const SUPPORTED_LANGUAGES = {
  plain: { name: 'Plain Text', aliases: ['txt', 'text'] },
  abap: { name: 'ABAP', aliases: ['abap'] },
  arduino: { name: 'Arduino', aliases: ['ino'] },
  bash: { name: 'Bash', aliases: ['sh', 'shell'] },
  basic: { name: 'BASIC', aliases: ['bas'] },
  c: { name: 'C', aliases: ['c'] },
  clojure: { name: 'Clojure', aliases: ['clj'] },
  cofeescript: { name: 'CoffeeScript', aliases: ['coffee'] },
  cpp: { name: 'C++', aliases: ['cpp', 'cxx'] },
  csharp: { name: 'C#', aliases: ['cs'] },
  css: { name: 'CSS', aliases: ['css'] },
  dart: { name: 'Dart', aliases: ['dart'] },
  diff: { name: 'Diff', aliases: ['diff', 'patch'] },
  docker: { name: 'Docker', aliases: ['dockerfile'] },
  elixir: { name: 'Elixir', aliases: ['ex', 'exs'] },
  elm: { name: 'Elm', aliases: ['elm'] },
  erlang: { name: 'Erlang', aliases: ['erl'] },
  flow: { name: 'Flow', aliases: ['flow'] },
  fortran: { name: 'Fortran', aliases: ['f', 'for', 'f77', 'f90'] },
  fsharp: { name: 'F#', aliases: ['fsharp'] },
  gherkin: { name: 'Gherkin', aliases: ['feature'] },
  glsl: { name: 'GLSL', aliases: ['glsl'] },
  go: { name: 'Go', aliases: ['go'] },
  graphql: { name: 'GraphQL', aliases: ['graphql'] },
  groovy: { name: 'Groovy', aliases: ['groovy'] },
  haskell: { name: 'Haskell', aliases: ['hs'] },
  java: { name: 'Java', aliases: ['java'] },
  js: { name: 'JavaScript', aliases: ['js', 'jsx'] },
  json: { name: 'JSON', aliases: ['json'] },
  julia: { name: 'Julia', aliases: ['jl'] },
  kotlin: { name: 'Kotlin', aliases: ['kt', 'ktm', 'kts'] },
  latex: { name: 'LaTeX', aliases: ['tex'] },
  less: { name: 'LESS', aliases: ['less'] },
  lisp: { name: 'Lisp', aliases: ['lisp'] },
  livescript: { name: 'LiveScript', aliases: ['ls'] },
  lua: { name: 'Lua', aliases: ['lua'] },
  makefile: { name: 'Makefile', aliases: ['mk', 'mak'] },
  markdown: { name: 'Markdown', aliases: ['md', 'mkdown', 'mkd'] },
  markup: { name: 'HTML / XML', aliases: ['html', 'htm', 'xml', 'xsd', 'xsl', 'xslt', 'wsdl'] },
  matlab: { name: 'MATLAB', aliases: ['matlab'] },
  mermaid: { name: 'Mermaid', aliases: ['mermaid'] },
  nix: { name: 'Nix', aliases: ['nix'] },
  objectivec: { name: 'Objective-C', aliases: ['m', 'mm'] },
  ocaml: { name: 'OCaml', aliases: ['ml'] },
  pascal: { name: 'Pascal', aliases: ['pas'] },
  perl: { name: 'Perl', aliases: ['pl', 'pm'] },
  php: { name: 'PHP', aliases: ['php'] },
  powershell: { name: 'PowerShell', aliases: ['ps', 'ps1'] },
  prolog: { name: 'Prolog', aliases: ['plg'] },
  protobuf: { name: 'Protocol Buffers', aliases: ['proto'] },
  python: { name: 'Python', aliases: ['py'] },
  r: { name: 'R', aliases: ['r'] },
  reason: { name: 'Reason', aliases: ['re', 'rei'] },
  ruby: { name: 'Ruby', aliases: ['rb'] },
  rust: { name: 'Rust', aliases: ['rs'] },
  sass: { name: 'Sass', aliases: ['sass'] },
  scala: { name: 'Scala', aliases: ['scala'] },
  scheme: { name: 'Scheme', aliases: ['scm', 'sm'] },
  scss: { name: 'SCSS', aliases: ['scss'] },
  solidity: { name: 'Solidity', aliases: ['sol'] },
  sql: { name: 'SQL', aliases: ['sql'] },
  swift: { name: 'Swift', aliases: ['swift'] },
  typescript: { name: 'TypeScript', aliases: ['ts', 'tsx'] },
  vbnet: { name: 'VB.Net', aliases: ['vbnet'] },
  verilog: { name: 'Verilog', aliases: ['v'] },
  vhdl: { name: 'VHDL', aliases: ['vhdl'] },
  'visual-basic': { name: 'Visual Basic', aliases: ['vb', 'vba'] },
  wasm: { name: 'WebAssembly', aliases: ['wasm'] },
  yaml: { name: 'YAML', aliases: ['yaml'] },
};

export {
  SUPPORTED_LANGUAGES,
};

export function getLanguageKeyFromAlias(alias: string) {
  const a = alias.toLocaleLowerCase();
  let language = 'plain';
  Object.entries(SUPPORTED_LANGUAGES).forEach(([key, value]) => {
    if (key === a || value.aliases.includes(a) || value.name.toLocaleLowerCase() === a) {
      language = key;
    }
  });
  return language;
}
