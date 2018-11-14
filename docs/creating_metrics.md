---
id: creating_metrics
author: GoodData
sidebar_label: Creating Metrics
title: Creating Metrics
---

Goal
-------

You want to create advanced MAQL metric.

Before you start

-------------

You have to have existing project with model and data loaded.

Example

--------


'src/09\_working\_with\_facts\_metrics\_and\_attributes/metric\_from\_maql.rb'
```ruby
# encoding: UTF-8

require 'gooddata'

# Connect to GoodData platform
GoodData.with_connection do |c|
  GoodData.with_project('project_id') do |project|
    metric = project.add_measure 'SELECT PERCENTILE(#"Amount",0.9)', 
     title: 'Salary Amount [90th Pct]'
    metric.save
    metric.execute
    
    metric = project.add_measure 'SELECT PERCENTILE(![fact.salary.amount],0.9)', 
     title: 'Salary Amount [90th Pct] V2' 
    metric.save
    metric.execute
    
    metric = project.add_measure 'SELECT PERCENTILE([/gdc/md/ptbedvc1841r4obgptywd2mzhbwjsfyr/obj/223],0.9)', 
     title: 'Salary Amount [90th Pct] V3' 
    metric.save
    metric.execute
    
  end
end
```

Discussion
----------

Please note that the MAQL statement uses three ways how to reference the
underlying objects (e.g. facts or metrics that are part of the MAQL
statement)

-   *\#"Amount"* for referencing the fact (or metric) via its name
    (title)

-   *!\[fact.salary.amount\]* for referencing the fact (or metric) via
    its identifier

-   *\[/gdc/md/ptbedvc1841r4obgptywd2mzhbwjsfyr/obj/223\]* for
    referencing the fact (or metric) via its uri
