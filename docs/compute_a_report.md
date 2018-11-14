---
id: compute_a_report
author: GoodData
sidebar_label: Computing Ad Hoc Report
title: Computing Ad Hoc Report
---

Goal
-------

You would like to make some ad hoc computation

Example
--------

We are using the recipe [???](#Working with HR Demo project) here so
spin it up if you want to follow the code.


```ruby
# encoding: utf-8

require 'gooddata'

GoodData.with_connection do |c|
  GoodData.with_project('project_id') do |project|

    # first let's create a metric and give it a reasonable identifier so we can read the examples
    m = project.facts('fact.salary.amount').create_metric
    m.identifier = "metrics.my_metric"
    m.save

    # metric can be referenced directly
    project.compute_report(left: ['metrics.my_metric'],
                           top: ['label.department.region'])

    # or you can pass by reference if you already hold it
    m1 = project.metrics('metrics.my_metric')
    project.compute_report(left: [m1],
                           top: ['label.department.region'])

    # report can take attributes and in that case it will use the default label
    project.compute_report(left: [m1],
                           top: ['attr.department.region', 'dataset.payment.quarter.in.year'])

    # for readability you might shuffle those labels to different section of report
    project.compute_report(left: [m1, 'dataset.payment.quarter.in.year'],
                            top: ['attr.department.region'])


    # there can be more than 1 metric in the group and the metric even does not have to be saved (if it is not it will be saved for you and removed after the computation)
    m2 = project.attributes('attr.salary.id').create_metric
    result = project.compute_report(left: [m1, m2],
                           top: ['attr.department.region'])
    # you can print out the results into console
    puts result
  end
end
```
