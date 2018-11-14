---
id: listing_dashboards
author: GoodData
sidebar_label: Listing Dashboards
title: Listing Dashboards
---

Goal
-------

You would like to list dashboards programmatically.

Before you start
-------------

You have to have existing project with dashboard(s).

Example
--------


```ruby
# encoding: UTF-8

require 'gooddata'

GoodData.with_connection do |c|
  GoodData.with_project('project_id') do |project|
    # List all dashboards and their names
    pp project.dashboards.map(&:title)
  end
end
```
