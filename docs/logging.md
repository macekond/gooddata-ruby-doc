---
id: logging
author: GoodData
sidebar_label: Logging
title: Logging
---

Goal
-------

Your script doesn’t work or throws a weird error. You want to see
detailed logging information to understand what is going on.

How-to
--------

GoodData Ruby SDK uses the standard Ruby logger that you can use in
standard way

```ruby
# encoding: utf-8

require 'gooddata'

logger = Logger.new(STDOUT)
logger.level = Logger::DEBUG
GoodData.logger = logger
```

You can also use following abbreviated syntax for logging to standard
output using DEBUG level

```ruby
# encoding: utf-8

require 'gooddata'

GoodData.logging_http_on
```

or using INFO level

```ruby
# encoding: utf-8

require 'gooddata'

GoodData.logging_on
```

another option is to specify the debug level explicitly

```ruby
# encoding: utf-8

require 'gooddata'

GoodData.logging_on(Logger::DEBUG)
```

There are quite a few options to choose from. Feel free to use whatever
you like the best.
