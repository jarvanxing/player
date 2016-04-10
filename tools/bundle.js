/*
* @Author: xilie
* @Date:   2016-03-20 14:09:13
* @Last Modified by:   xilie
* @Last Modified time: 2016-03-20 14:54:58
*/

import webpack from 'webpack';
import webpackConfig from './webpack.config';

/**
 * Creates application bundles from the source files.
 */
function bundle() {
  return new Promise((resolve, reject) => {
    webpack(webpackConfig).run((err, stats) => {
    	console.log(err)
      if (err) {
        return reject(err);
      }

      console.log(stats.toString(webpackConfig[0].stats));
      return resolve();
    });
  });
}

export default bundle;