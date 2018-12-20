/*
 * Copyright (c) 12/8/18 7:10 PM.  Amin Taghikhani
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

const IndexNode = require('../models/IndexNode');
const WordNode = require('../models/wordNode');

class IndexEngine {
  removeUnUsedCharacters(content) {
    let newContent = content;
    newContent = newContent.replace(/\[(.+?)]/g, '');
    const unUsed = ['\n', '\r', ')', '(', '.', '،', '(', ')', '.', ',', '»', '«', ':', '[', ']'];
    let res = '';
    for (let str = 0; str < newContent.length; str += 1) {
      let index = unUsed.length - 1;
      let isReplace = false;
      while (index >= 0 && !isReplace) {
        if (newContent[str] === unUsed[index]) isReplace = true;
        index -= 1;
      }
      if (isReplace) res += '';
      else res += newContent[str];
    }
    return res;
  }

  shrinkToWords(content) {
    let words = content.split(' ');
    words = this.removeSpaces(words);
    return this.removeRepeatedWords(words);
  }

  removeSpaces(words) {
    return words.filter(word => word !== ' ');
  }

  removeRepeatedWords(words) {
    return words.filter((word, pos) => words.indexOf(word) === pos);
  }

  indexing(resources, words) {
    const indexNodes = [];
    for (let index = 0; index < words.length; index += 1) {
      const wordNodes = [];
      let count = 0;
      let i = 0;
      while (i < resources.length) {
        const resource = resources[i];
        const indices = this.allIndexOf(resource.content, words[index]);
        count += indices.length;
        const wordNode = new WordNode(resource.id, indices);
        wordNodes.push(wordNode);
        i += 1;
      }
      const indexNode = new IndexNode(words[index], count, wordNodes);
      indexNodes.push(indexNode);
    }
    return indexNodes;
  }

  allIndexOf(content, str) {
    let start = 0;
    const indices = [];
    let index = content.indexOf(str, start);
    while (index > -1) {
      indices.push(index);
      start = index + str.length;
      index = content.indexOf(str, start);
    }
    return indices;
  }

  fetchWords(resources) {
    let words = [];
    let index = resources.length - 1;
    while (index >= 0) {
      const { content } = resources[index];
      const pureContent = this.removeUnUsedCharacters(content);
      words = words.concat(this.shrinkToWords(pureContent));
      index -= 1;
    }
    words = this.removeSpaces(words);
    words = this.removeRepeatedWords(words);
    return words;
  }
}

module.exports = new IndexEngine();
