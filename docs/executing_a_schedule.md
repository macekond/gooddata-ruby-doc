---
id: executing_a_schedule
author: GoodData
sidebar_label: Executing Schedule
title: Executing Schedule
---

Goal
-------

You have a process with a schedule. You would like to execute it out of
schedule.

Solution
--------

Since schedule already have information about executable and parameters
stored it is very easy. You just need to find the schedule and execute
it.


```ruby
# encoding: utf-8

require 'gooddata'

GoodData.with_connection do |client|
  project = GoodData.use('project_id')
  project.processes.first.schedules.first.execute
end
```
