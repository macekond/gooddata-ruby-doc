---
id: all_projects
author: GoodData
sidebar_label: Performing Operations on Multiple Projects
title: Performing Operations on Multiple Projects
---

Problem
-------

You already know how to do many things but now you would like to do the
same thing on many projects at once.

Solution
--------

The basis of the solution is pretty simple. We need to iterate over
projects and perform an operation on each of them.

Lets illustrate this on a simple example. We will compile a list of all
reports from user’s projects that have been changed since last week by
somebody from GoodData. If there is more than one revision in a report
we’ll assume that the report is changing frequently and tag it with
'to\_be\_checked' tag for QA to validate the report.

This is a lot to do. Let’s try to break the tasks down to smaller
pieces.

### Work with many projects


```ruby
# encoding: utf-8

require 'gooddata'

GoodData.with_connection do |client|

  projects = [
      client.projects('project_pid_a'),
      client.projects('project_pid_b')
  ]

  results = projects.map do |project|
    reports_to_validate = project.reports
                                .select { |report| report.updated > 2.weeks.ago }
                                .select { |report| report.definitions.count > 1 }

    GoodData::Report.find_by_tag('to_be_checked', :project => project).each do |report|
      report.remove_tag('to_be_checked')
      report.save
    end

    reports_to_validate.each do |report|
      report.add_tag('to_be_checked')
      report.save
    end

    {project: project, reports_to_validate: reports_to_validate.count}
  end

  results.each do |result|
    puts "#{result[:project].pid}: there are #{result[:reports_to_validate]} reports to check"
  end
```

### Select specific reports

&lt;%= render\_ruby 'src/03\_automation\_recipes/select\_reports.rb'
%&gt;

### Remove tag

We’ll first remove the 'to\_be\_checked' tag from all reports

&lt;%= render\_ruby 'src/03\_automation\_recipes/remove\_tag.rb' %&gt;

### Add tag

Then we’ll add the 'to\_be\_checked' tag to all qualifying reports

&lt;%= render\_ruby 'src/03\_automation\_recipes/add\_tag.rb' %&gt;

### Full example - all pieces together

&lt;%= render\_ruby
'src/03\_automation\_recipes/perform\_an\_operation\_on\_multiple\_projects.rb'
%&gt;

Discussion
----------

Please note that the reports in projects are processed sequentially (one
after another).
