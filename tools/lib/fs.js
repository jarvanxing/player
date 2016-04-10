/*
* @Author: xilie
* @Date:   2016-03-20 14:11:54
* @Last Modified by:   xilie
* @Last Modified time: 2016-03-20 14:11:59
*/

import fs from 'fs';
import mkdirp from 'mkdirp';

const writeFile = (file, contents) => new Promise((resolve, reject) => {
  fs.writeFile(file, contents, 'utf8', err => err ? reject(err) : resolve());
});

const makeDir = (name) => new Promise((resolve, reject) => {
  mkdirp(name, err => err ? reject(err) : resolve());
});

export default { writeFile, makeDir };