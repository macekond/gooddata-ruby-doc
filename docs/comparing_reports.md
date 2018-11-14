---
id: comparing_reports
author: GoodData
sidebar_label: Comparing Reports across Projects
title: Comparing Reports across Projects
---

Goal
-------

You created a new version of a project. You made some changes to the
reports and you would like to verify that the report is still computing
the same numbers.

Example

--------


```ruby
# encoding: utf-8

require 'gooddata'

GoodData.with_connection do |c|
  original_project = c.projects('project_id_1')
  new_project = c.projects('project_id_2')

  # We assume that reports have unique name inside a project
  orig_reports = GoodData::Report.find_by_tag('to_check', client: c, project: original_project).sort_by(&:title)
  new_reports = GoodData::Report.find_by_tag('to_check', client: c, project: new_project).sort_by(&:title)

  results = orig_reports.zip(new_reports).pmap do |reports|
    # compute both reports and add the report at the end for being able to print a report later
    reports.map(&:execute) + [reports.last]
  end

  results.map do |res|
    orig_result, new_result, new_report = res
    puts "#{new_report.title}, #{orig_result == new_result}"
  end
end 
```

Discussion
----------

If there is more reports this can obviously take a lot of time so it
would be nice if you could do computation or reports in parallel and not
sequentially. Imagine we have a list of reports that should be checked
tagged by tag `to_check`. Let’s rewrite previous code snippet to be
parallel friendly.

&lt;%= render\_ruby
'src/08\_working\_with\_reports/comparing\_reports\_parallel.rb' %&gt;
