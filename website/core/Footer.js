/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

class Footer extends React.Component {
  render() {
    return (
      <footer className="nav-footer" id="footer">
        <section className="copyright">Copyright © 2007–2018 GoodData Corporation. All Rights Reserved. Code licensed under an <a href="https://github.com/gooddata/gooddata-ruby/blob/master/LICENSE">BSD License</a>.</section>
      </footer>
    );
  }
}

module.exports = Footer;
