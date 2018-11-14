---
id: finding_out_date_dimensions
author: GoodData
sidebar_label: Enumerating Date Dimensions
title: Enumerating Date Dimensions
---

Problem
-------

You would like to know how many date dimensions you have in a project.

Solution
--------


```ruby
# encoding: utf-8

require 'gooddata'

GoodData.with_connection do |c|
  GoodData.with_project('project_pid') do |project|
    blueprint = project.blueprint
    dds = blueprint.date_dimensions
    puts "You have #{dds.count} date dimensions in your project"
  end
end 
```
