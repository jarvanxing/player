/*
* @Author: xilie
* @Date:   2016-03-20 14:09:34
* @Last Modified by:   xilie
* @Last Modified time: 2016-03-20 14:14:35
*/

import run from './run';
import clean from './clean';
import bundle from './bundle';

/**
 * Compiles the project from source files into a distributable
 * format and copies it to the output (build) folder.
 */
async function build() {
  await run(clean);
  await run(bundle);
}

export default build;