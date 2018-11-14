---
id: changing_number_formatting_on_metric
author: GoodData
sidebar_label: Changing Metric’s Number Formatting
title: Changing Metric’s Number Formatting
---

Goal
-------

You have a project and you would like to update formatting of all
metrics programmatically. They are currently formatted for dollar values
but you would like to change all formats to Euro.

Solution
--------


'src/09\_working\_with\_facts\_metrics\_and\_attributes/metric\_number\_formatting.rb'
```ruby
# encoding: utf-8

require 'gooddata'

GoodData.with_connection do |c|
  GoodData.with_project('project_id') do |project|
    project.metrics.pmap do |metric|
      metric.content['format'] = metric.content['format'].gsub('$', '€')
      metric.save
    end
  end
end 
```
