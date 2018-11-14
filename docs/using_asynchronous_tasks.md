---
id: using_asynchronous_tasks
author: GoodData
sidebar_label: Using Asynchronous Tasks with Timeouts
title: Using Asynchronous Tasks with Timeouts
---

Goal
-------

You would like to build on top of the SDK but you would like to have
more control over asynchronous tasks.

How-to

--------

There are numerous tasks on GoodData API which potentially take more
than just couple of seconds to execute. These include report executions,
data loads, exports, clones and others.

The way these tasks are implemented in SDK that they block. The
execution continues only when the task finishes (either success or
error) or the server time limit is reached and the task is killed.

Sometimes it is useful to be able to specify the time limit on the
client side. This might be useful for cases where you need to make sure
that something is either finished under a certain time threshold or you
have to make some other action (notifying a customer). The limit you
would like to use is different then the server side limit of GoodData
APIs.

You can implement it like this


```ruby
# encoding: utf-8

require 'gooddata'

client = GoodData.connect
project = client.projects('project_id')
report = project.reports(1234)
begin
  puts report.execute(time_limit: 10)
rescue GoodData::ExecutionLimitExceeded => e
  puts "Unfortunately #{report.title} execution did not finish in 10 seconds"
  raise e
end
```
