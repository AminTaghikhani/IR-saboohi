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
const SearchEngine = require('./lib/searchEngine');
const Output = require('./helpers/output');

const result = SearchEngine.search(['برنامه', 'جاوا']);
Output.printLine(JSON.stringify(result));

const result2 = SearchEngine.search('جاوا و حلقه');
Output.printLine(JSON.stringify(result2));

const result3 = SearchEngine.search('جاوا و حلقه و نهایت');
Output.printLine(JSON.stringify(result3));

const result4 = SearchEngine.search('ویکی‌پدیا');
Output.printLine(JSON.stringify(result4));

const result5 = SearchEngine.search('ویکی‌پدیا و دانشنامهٔ');
Output.printLine(JSON.stringify(result5));

const result6 = SearchEngine.search('ویکی‌پدیا و دانشنامهٔ و آزاد');
Output.printLine(JSON.stringify(result6));
