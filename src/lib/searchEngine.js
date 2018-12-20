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

const ResourceManager = require('./resourceManager');
const IndexEngine = require('./indexEngine');

class SearchEngine {
  constructor() {
    this.initial();
  }

  search(search) {
    if (typeof search === 'string') {
      if (search.indexOf(' ') === -1) {
        return this.searchWord(search);
      }
      if (search.includes(' و ')) {
        const words = search.split(' و ');
        if (words.length === 2) {
          return this.findTwoWordsMatchResources(words[0], words[1]);
        }
        let resources = this.findTwoWordsMatchResources(words[0], words[1]);
        let i = 2;
        while (i < words.length) {
          const word = words[i];
          resources = this.findWordResourceMatchResources(word, resources);
          i += 1;
        }
        return resources;
      }
      const words = search.split(' ');
      if (words.length === 2) {
        return this.searchContinuous(words[0], words[1]);
      }
      return this.searchWords(words);
    }
    if (typeof search === 'object') {
      if (search.length === 2) {
        return this.searchContinuous(search[0], search[1]);
      }
      return this.searchWords(search);
    }
    throw new Error('Unknown type');
  }

  searchWord(word) {
    let i = this.indices.length - 1;
    while (i >= 0) {
      const index = this.indices[i];
      if (index.word === word) {
        return index;
      }
      i -= 1;
    }
    return null;
  }

  searchWords(words) {
    let i = 0;
    const targets = [];
    while (i < words.length) {
      targets.push(this.searchWord(words[i]));
      i += 1;
    }
    return targets;
  }

  searchContinuous(word1, word2) {
    const matchResources = this.findTwoWordsMatch(word1, word2);
    const result = [];
    for (let i = 0; i < matchResources.length; i += 1) {
      const matchResource = matchResources[i];
      const positions = SearchEngine.findMatchPositions(matchResource.index1,
        matchResource.index2,
        word1.length);
      if (positions.length > 0) {
        result.push({
          resourceId: matchResource.resourceId,
        });
      }
    }
    return result;
  }

  findTwoWordsMatch(word1, word2) {
    const word1Index = this.searchWord(word1);
    const word2Index = this.searchWord(word2);
    const matchResources = [];
    if (!word1Index || !word2Index) return matchResources;
    for (let i = 0; i < this.resources.length; i += 1) {
      if (word1Index.indices[i].indices.length > 0 && word2Index.indices[i].indices.length > 0) {
        matchResources.push({
          resourceId: word1Index.indices[i].resourceId,
          word1,
          index1: word1Index.indices[i].indices,
          word2,
          index2: word2Index.indices[i].indices,
        });
      }
    }
    return matchResources;
  }

  findTwoWordsMatchResources(word1, word2) {
    const word1Index = this.searchWord(word1);
    const word2Index = this.searchWord(word2);
    const matchResources = [];
    if (!word1Index || !word2Index) return matchResources;
    for (let i = 0; i < this.resources.length; i += 1) {
      if (word1Index.indices[i].indices.length > 0 && word2Index.indices[i].indices.length > 0) {
        matchResources.push({
          resourceId: word1Index.indices[i].resourceId,
        });
      }
    }
    return matchResources;
  }

  findWordResourceMatchResources(word, resources) {
    const wordIndex = this.searchWord(word);
    const matchResources = [];
    if (!wordIndex) return matchResources;
    for (let i = 0; i < this.resources.length; i += 1) {
      // eslint-disable-next-line max-len
      const wordNode = wordIndex.indices.filter(node => node.resourceId === resources[i].resourceId)[0];
      if (wordNode.indices.length > 0) {
        matchResources.push({
          resourceId: resources[i].resourceId,
        });
      }
    }
    return matchResources;
  }

  static findMatchPositions(indices1, indices2, length) {
    let i1 = 0;
    let i2 = 0;
    const matchPos = [];
    while (i1 < indices1.length && i2 < indices2.length) {
      const index1 = indices1[i1];
      const index2 = indices2[i2];
      if (index1 + length + 1 < index2) {
        i1 += 1;
      }
      if (index1 + length + 1 > index2) {
        i2 += 1;
      } else if (index1 + length + 1 === index2) {
        matchPos.push({ index1, index2 });
        i1 += 1;
        i2 += 1;
      }
    }
    return matchPos;
  }

  initial() {
    this.resources = ResourceManager.getResources();
    this.words = IndexEngine.fetchWords(this.resources);
    this.indices = IndexEngine.indexing(this.resources, this.words);
  }
}

module.exports = new SearchEngine();
