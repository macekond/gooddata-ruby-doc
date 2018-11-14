---
id: executing_process
author: GoodData
sidebar_label: Executing Process
title: Executing Process
---

Goal
-------

You would like to execute a process without a schedule.

How-to

--------

SDK allows you to execute a process. This is not something that you
should do regularly since you have to specify the parameters during
execution and logs are not kept for individual executions but it might
be occasionally useful.


```ruby
# encoding: utf-8

require 'gooddata'

GoodData.with_connection do |client|
  GoodData.with_project('project_id') do |project|
    project = GoodData.use('project_id')
    process = project.processes.find { |p| p.name == 'Test ETL Process' }
    process.execute('graph/my_graph.grf', params: { param1: 'a', param2: 'b' })
  end
end 
```

Discussion
----------

There are also couple of other useful tricks. You might execute
arbitrary process that is already deployed. You just need to get the
process by its id.

&lt;%= render\_ruby
'src/07\_deployment\_recipes/executing\_arbitrary\_process.rb' %&gt;

Or you can get a process by it’s name too.

&lt;%= render\_ruby
'src/07\_deployment\_recipes/executing\_named\_process.rb' %&gt;

If you do not know what the executable is you can look it up by using
`process.executables`. We recommend using the same for all processes
like `main.grf` (for CloudConnect) or `main.rb`.
