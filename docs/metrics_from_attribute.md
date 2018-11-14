---
id: metrics_from_attribute
author: GoodData
sidebar_label: Creating Metrics from Attributes
title: Creating Metrics from Attributes
---

Problem
-------

You have several attributes in a project. You would like to create some
basic metric out of them.

Prerequisites
-------------

You have to have existing project with model and data loaded.

Solution
--------


'src/09\_working\_with\_facts\_metrics\_and\_attributes/metrics\_from\_attribute.rb'
```ruby
# encoding: UTF-8

require 'gooddata'

# Connect to GoodData platform
GoodData.with_connection do |c|
  GoodData.with_project('project_id') do |project|
    attribute = project.attributes('attr.devs.dev_id')
    metric = attribute.create_metric(:title => "Count of [#{attribute.identifier}]")
    metric.save
    metric.execute
  end
end
```
