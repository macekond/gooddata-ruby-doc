---
id: resetting_color_mapping
author: GoodData
sidebar_label: Resetting Report Color Map
title: Resetting Report Color Map
---

Goal
-------

You have a report somebody set up a color mapping on. You would like to
remove it.

Example

--------


```ruby
# encoding: utf-8

GoodData.with_connection do |client|
  GoodData.with_project('project_id') do |project|
    ids = [report_id_1, report_id_2, report_id_3]
    ids.each do |id|
      r = project.reports(id)
      d = r.latest_report_definition
      d.reset_color_mapping!
      d.save
    end
  end
end 
```
