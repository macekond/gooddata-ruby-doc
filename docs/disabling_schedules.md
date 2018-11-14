---
id: disabling_schedules
author: GoodData
sidebar_label: Disabling Schedules in All Projects
title: Disabling Schedules in All Projects
---

Problem
-------

You would like to disable all schedules on all processes on all the
projects you have access to and have sufficient privileges to do so.

Solution
--------


```ruby
# encoding: utf-8

require 'gooddata'

client = GoodData.connect
GoodData.with_connection do |client|
  schedules = client.projects.pselect(&:am_i_admin?).pmapcat(&:schedules)
  schedules.pmap do |schedule|
    schedule.disable
    schedule.save
  end
end
```
