---
id: working_with_automation
author: GoodData
sidebar_label: Automation and Performance
title: Automation and Performance
---

Performing Operations on Multiple Projects
------

Let's iterate over projects and perform an operation on each of them.

We will illustrate this on a simple example and compile a list of all
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

```ruby
reports_to_tag = project.reports
                   .select { |report| report.updated > 2.weeks.ago }
                   .select { |report| report.definitions.count > 1 }
```

### Remove tag

We’ll first remove the 'to\_be\_checked' tag from all reports

```ruby
GoodData::Report.find_by_tag('to_be_checked', :project => project).each do |report|
  report.remove_tag('to_be_checked')
  report.save
end
```

### Add tag

Then we’ll add the 'to\_be\_checked' tag to all qualifying reports

```ruby
reports_to_tag.each do |report|
  report.add_tag('to_be_checked')
  report.save
end
```

### Full example - all pieces together

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

end
```

Please note that the reports in projects are processed sequentially (one
after another).


Parallel Processing
------

You created the script, it works but it is slow. Let’s have at one trick
how to possibly make it faster.

Often if you look at the API the structure is orthogonal to your use
case. For example you might need to invite user to many projects but the
API has only an endpoint to invite a user to a single project. If you do
something like

```ruby
projects.map do |project|
  project.invite_user('john@example.com')
end
```

It will work but it will create as many requests as there are projects.
The requests will be processed sequentially and this takes time. You can
estimate this easily. Let’s say we have 1000 projects and invitation
request takes 500ms (half a second). This means it will take 500 seconds
therefore almost 10 minutes.

The nice thing is that the requests for inviting user to each project
are totally independent. You don’t need a project invitation to finish
before you invite the user to another project. So you can invoke
multiple invitations at the same time. The following code invokes
multiple invitations in parallel

```ruby
projects.pmap do |project|
  project.invite_user('john@example.com')
end
```

We’ve just changed a single letter. We are using pmap which stands for
parallel map. It behaves exactly the same as map with one difference.
The block for each item of the array runs in a separate thread. You do
not need to think about it, it just happens faster. We have currently 20
threads reserved so it will run 20 times faster. In this case under 0.5
minutes.
