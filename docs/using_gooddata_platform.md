---
id: using_gooddata_platform
author: GoodData
sidebar_label: Using GoodData Platform
title: Using GoodData Platform
---

Using a Project
-------

You can use couple of ways to do this. Our favorite is this:

```ruby
# encoding: utf-8

require 'gooddata'

GoodData.with_connection('user', 'password') do |client|
  GoodData.with_project('project_pid') do |project|
    puts project.title
  end
end
```

This has a benefit that you have access to project only inside the
block. Once the block is left you are 'disconnected to the project. If
you are using several projects in one script this is a way to go to be
sure you are not reaching somewhere you do not want to.

There are other more conventional ways to do the same thing: 

```ruby
# encoding: utf-8

require 'gooddata'

GoodData.with_connection('user', 'password') do |client|
  project = GoodData.use('project_pid')
  puts project.title
end
```

Using API directly
-------

SDK provides you slew of well known methods that make this possible
while shielding you from intricacies of keeping connection alive etc.

```ruby
# encoding: utf-8

require 'gooddata'

GoodData.with_connection('user', 'password') do |client|
  client.get("/gdc/md/")
  project_id = 'YOUR_PROJECT_ID'
  client.delete("/gdc/projects/#{project_id}")
end
```

Using Asynchronous Tasks with Timeouts
-------

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
