---
id: working_with_tab
author: GoodData
sidebar_label: Listing Dashboard Tabs
title: Listing Dashboard Tabs
---

Problem
-------

You would like to work with dashboard tab a little. List how many
reports are on the tab, if they are filtered etc.

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

    t = project.dashboards('dashboard_id').tabs.find { |t| t.identifier == 'tab_identifier' }

    # How many items are there on the tab?
    t.items.count

    # The items count also several utility item types. Usually what you are interested in is
    # Reports and filters
    # How many reports are there on the tab?
    t.items.select { |i| i.is_a? GoodData::ReportItem }.count
    # => 6

    # Are there any filters on this tab?
    t.items.any? { |i| i.is_a? GoodData::FilterItem }
    # => false

    # It might be useful to see how many report are on each tab of each dashboard
    project.dashboards.pmapcat { |d| d.tabs.map { |t| [d.title, t.title, t.items.select { |i| i.is_a? GoodData::ReportItem }.count] }}

    # In a similar vein. Which tabs do have any filters on tabs?
    project.dashboards
      .pmapcat { |d| d.tabs.map { |t| [d.title, t.title, t.items.select { |i| i.is_a? GoodData::FilterItem }.count] }}
      .select { |_, _, i| i > 0 }

    # On each item there are properties that you can access.
    # On each type you can access the position and size
    item = tab.items.find { |i| i.is_a? GoodData::ReportItem }
    item.position_y
    # => 130
    item.size_y
    # => 50

    # With this you can for example find the bottom most element on each page. From this you can
    # find out if there are not any tabs that are too "long". Depends on the usage of the dashboard
    # but if it is an operational dashboard if users need to scroll down it might decrease the
    # usefulness of the particular dashboard.
    #
    # Let's say we would like to find tabs that are longer than 500 pixels
    tuple_with_lowest_item = project.dashboards.pmapcat { |d| d.tabs.map do
      # pick an item whose y position + vertical size is the largest (ie it is lowest on the page)
      |t| [d.title, t.title, t.items.max { |a, b| (a.position_y + a.size_y) <=> (b.position_y + b.size_y) }]} # 
    end
    tuple_with_lowest_item
      .map {|d, t, m| [d, t, m.position_y + m.size_y]} # Convert it to actual size
      .select { |_, _, d| d > 800 } # Filter those that are larger than a particular threshold

    # With GoodData::ReportItem you can access the underlying report and do whatever is doable with a report
    # For example executing it. Remeber though that the report on the dashboard is executed with additional
    # context like filters etc so the results are not going to be the same.
    puts tab.items.find { |i| i.is_a? GoodData::ReportItem }.execute
  end
end 
```
