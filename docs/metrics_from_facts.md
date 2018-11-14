---
id: metrics_from_facts
author: GoodData
sidebar_label: Creating Metrics from Facts
title: Creating Metrics from Facts
---

Problem
-------

You have several facts in a project. You would like to create some basic
metric out of them.

Prerequisites
-------------

You have to have existing project with model and data loaded.

Solution
--------


'src/09\_working\_with\_facts\_metrics\_and\_attributes/metrics\_from\_facts.rb'
```ruby
# encoding: UTF-8

require 'gooddata'

# Connect to GoodData platform
GoodData.with_connection do |c|
  GoodData.with_project('project_id') do |project|
    fact = project.facts('fact.commits.lines_changed')
    metric = fact.create_metric(:title => "Sum of [#{fact.identifier}]")
    res = metric.execute
    puts res

    # if you like the metric you can save it of course for later usage
    metric.save

    # Default aggregation is SUM but you can also specify a different one
    metric = fact.create_metric(:title => "Min of [#{fact.identifier}]", type: :min)
  end
end 
```
