---
id: delete_all_data
author: GoodData
sidebar_label: Delete data in project
title: Delete data in project
---

Goal
-------

You need to delete all the data in all datasets in a particular project.

Solution
--------


```ruby
# encoding: utf-8

require 'gooddata'

GoodData.with_connection do |c|
  GoodData.with_project('project_pid') do |project|
    project.delete_all_data(force: true)
  end
end 
```
