/*
* @Author: xilie
* @Date:   2016-03-20 14:09:24
* @Last Modified by:   xilie
* @Last Modified time: 2016-03-20 14:13:53
*/

import del from 'del';
import fs from './lib/fs';

/**
 * Cleans up the output (build) directory.
 */
async function clean() {
  await del(['.tmp', 'build/*', '!build/.git'], { dot: true });
  await fs.makeDir('build');
}

export default clean;