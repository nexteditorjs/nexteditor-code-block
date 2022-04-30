import 'prismjs';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-php';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';

const SUPPORTED_LANGUAGES = {
  plain: { name: 'Plain Text', aliases: ['txt', 'text'] },
  c: { name: 'C', aliases: ['c'] },
  cpp: { name: 'C++', aliases: ['cpp', 'cxx'] },
  java: { name: 'Java', aliases: ['java'] },
  sql: { name: 'SQL', aliases: ['sql'] },
  php: { name: 'PHP', aliases: ['php'] },
  py: { name: 'Python', aliases: ['py'] },
  js: { name: 'JavaScript', aliases: ['js', 'jsx'] },
  ts: { name: 'TypeScript', aliases: ['ts', 'tsx'] },
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
