---
id: listing_dashboard_tabs
author: GoodData
sidebar_label: Listing Dashboard Tabs
title: Listing Dashboard Tabs
---

Goal
-------

You would like to list dashboards and their tabs programmatically.

Prerequisites
-------------

You have to have existing project with dashboard(s).

Solution
--------


```ruby
# encoding: UTF-8

require 'gooddata'

GoodData.with_connection do |c|
  GoodData.with_project('project_id') do |project|
    # You can list tabs of a specific dashoard and print their titles
    pp project.dashboards(123).tabs.map(&:title)

    # Sometimes it is very useful to get a sense on what tabs are where
    # We will print dashboard title, tab title tuples
    pp project.dashboards.flat_map { |d| d.tabs.map { |t| [d.title, t.title] } }
    # ....
    #  ["Sales Reports", "Damage"],
    #  ["Sales Reports", "Storage"],
    #  ["Sales Reports", "Assignment"]
    # ....

    # Another thing that might be useful is to compute how many tabs
    # each of the dashboard has
    pp project.dashboards.map { |d| [d.title, d.tabs.count] }
    
    # [["Support Reports", 4],
    #  ["Sales Reports", 10],
    #  ["Insurance Dashboard", 1],
    #  ["Inventory", 10],
    #  ["Email Scheduling ", 1]]
  end
end 
```
