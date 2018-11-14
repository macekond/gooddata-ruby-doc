---
id: delete_project
author: GoodData
sidebar_label: Delete a project
title: Delete a project
---

Goal
-------

You must delete a project programmatically.

Solution
--------


```ruby
# encoding: utf-8

require 'gooddata'

GoodData.with_connection do |c|
  GoodData.with_project('project_pid') do |project|
    project.delete
  end
end 
```
