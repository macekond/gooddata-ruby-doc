---
id: remove_old_versions_from_report
author: GoodData
sidebar_label: Removing old versions from report
title: Removing old versions from report
---

Problem
-------

Occasionally you would like to clean up your project. The simplest way
to do it is to get rid of the old version of reports.

Solution
--------

There are a simple way how to export a report from gooddata


```ruby
# encoding: utf-8

require 'gooddata'

GoodData.with_connection do |c|
  GoodData.with_project('project_id') do |project|
    project.reports.peach do |report|
      r.report.purge_report_of_unused_definitions!
    end
  end
end
```
