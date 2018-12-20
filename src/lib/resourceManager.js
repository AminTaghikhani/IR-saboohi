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

const fs = require('fs');
const path = require('path');
const ResourceNode = require('../models/resourceNode');

class ResourceManager {
  constructor() {
    this.fetchResources();
    this.resources = [];
  }

  getResources() {
    this.fetchResources();
    this.resources = [];
    this.resourcesPath.forEach((filePath, index) => {
      const content = this.resourceFile(filePath);
      const resourceNode = new ResourceNode(index + 1, filePath, content);
      this.resources.push(resourceNode);
    });
    return this.resources;
  }

  resourceFile(fileName) {
    const filePath = path.join(__dirname, '..', 'resources', fileName);
    return fs.readFileSync(filePath, 'utf8');
  }

  resourcePath(fileName) {
    return path.join(__dirname, '..', 'resources', fileName);
  }

  fetchResources() {
    this.resourcesPath = [];
    fs.readdirSync(path.join(__dirname, '..', 'resources'))
      .filter(file => (file.indexOf('.') !== 0)
              && (file.includes('.txt')))
      .forEach((file) => {
        this.resourcesPath.push(file);
      });
  }
}

module.exports = new ResourceManager();
