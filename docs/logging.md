---
id: logging
author: GoodData
sidebar_label: Logging and Testing
title: Logging
---

Logging
------

If your script doesn’t work or throws a weird error, you want to see
detailed logging information to understand what is going on.

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

Testing
------

There is another way how to debug your progress. This is a test that checks
whether reports return exptected results. This is a
basis for delving later into test driven BI projects.

```ruby
# encoding: utf-8

require 'gooddata'

GoodData.with_connection('user', 'password') do |client|
  GoodData.with_project('project_pid') do |project|
    report = project.reports(32)
    result = report.execute
    fail "Report has unexpected result" unless result == [[1, 2, 3]]
  end
end
```