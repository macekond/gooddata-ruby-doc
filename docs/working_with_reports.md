---
id: working_with_reports
author: GoodData
sidebar_label: Working with Reports
title: Working with Reports
---

Computing Report
------

You can execute an existing report programmatically.

```ruby
# encoding: utf-8

require 'gooddata'

GoodData.with_connection do |c|
  GoodData.with_project('project_id') do |project|
    puts project.reports(1234).execute
  end
end
```

Comparing Reports across Projects
------

You created a new version of a project. You made some changes to the
reports and you would like to verify that the report is still computing
the same numbers.

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

If there is more reports this can obviously take a lot of time so it
would be nice if you could do computation or reports in parallel and not
sequentially. Imagine we have a list of reports that should be checked
tagged by tag `to_check`. Let’s rewrite previous code snippet to be
parallel friendly.

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

Updating report definition
------

You can update report definition in your report in an easy way.
You can also modify multiple reports in one or more projects.

Use the Report\#update\_definition with block argument in following way.


```ruby
require 'gooddata'
require 'pp'

PID = 'rq3enqarynvkt7q11u0stev65qdwpow8'
REPORT = '/gdc/md/rq3enqarynvkt7q11u0stev65qdwpow8/obj/1323'

GoodData.with_connection do |c|
  GoodData.with_project(PID) do |project|
    report = project.reports(REPORT)

    new_def = report.update_definition do |rdef|
      rdef.title = "Test TITLE: #{DateTime.now.strftime}"
    end

    pp new_def
  end
end
```

Specify :new\_definition ⇒ false if you do want to update the latest
report definition instead of creating new one. New definition flag is
true by default.

```ruby
require 'gooddata'
require 'pp'

PID = 'rq3enqarynvkt7q11u0stev65qdwpow8'
REPORT = '/gdc/md/rq3enqarynvkt7q11u0stev65qdwpow8/obj/1323'

GoodData.with_connection do |c|
  GoodData.with_project(PID) do |project|
    report = project.reports(REPORT)

    new_def = report.update_definition(:new_definition => false) do |rdef|
      rdef.title = "Test TITLE: #{DateTime.now.strftime}"
    end

    pp new_def
  end
end
```

Creating Report that Counts Records in All Datasets
------

Occasionally you need to know how many rows there are in each dataset.

This is surprisingly difficult to do in GoodData UI but it is simple
with the SDK. Here we are going to create the necessary metrics on the fly
through inspection of a blueprint. Then we will create a report that
will contain those metrics and compute it.

```ruby
# encoding: utf-8

require 'gooddata'

GoodData.with_connection do |c|
  GoodData.with_project('project_id') do |project|
    blueprint = project.blueprint

    # let's grab anchor on each dataset. Anchor is a special attribute on each dataset
    # this attribute defines the grain of the dataset if we "count" it we will get the number of lines
    # in the dataset
    anchors = blueprint.datasets.map(&:anchor)

    # As is explained in Blueprint section. Objects in blueprint are project agnostic.
    # Let's find corresponding attribute object in specific project
    attributes = anchors.pmap { |anchor| anchor.in_project(project) }

    # Lets create a report on the fly that is going to have the metrics in the rows
    # Take note that this is a real report on the platform that could be saved and alter reused
    puts project.compute_report(left: attributes.map(&:create_metric))

    # This might result into something like this
    #
    # [                                                            |   Values   ]
    # [count of Records of timeline                                | 0.7306E4   ]
    # [count of Activity                                           | 0.61496E6  ]
    # [count of Opportunity                                        | 0.85171E6  ]
    # [count of Product                                            | 0.5E1      ]
  end
end
```

Resetting Report Color Map
------

You can remove a color mapping out of a report.


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

Computing Ad Hoc Report
------

You can also make some ad hoc computation.

We are using the recipe [Working with HR Demo project](playing_with_toy_model.md) here so
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

Working with report results
------

You have computed a report now you would like to get dirty with the data:


```ruby
# encoding: utf-8

require 'gooddata'

GoodData.with_connection do |c|
  GoodData.with_project('project_id') do |project|

    # first let's create a metric and give it a reasonable identifier so we can read the examples
    m1 = project.facts('fact.salary.amount').create_metric
    result = project.compute_report(left: [m1, 'dataset.payment.quarter.in.year'],
                            top: ['attr.department.region'])

    # You can print the result
    puts result
    # [   |               | Europe | North America]
    # [Q1 | sum of Amount | 29490  | 62010        ]
    # [Q2 | sum of Amount | 29490  | 62010        ]
    # [Q3 | sum of Amount | 29490  | 62010        ]
    # [Q4 | sum of Amount | 29490  | 62010        ]

    # You can get size of report
    result.size # => [5, 4]

    # this gives you the overall size but you probably want to also know the
    # size of the data portion
    result.data_size # => [4, 2]

    # you can learn if it is empty which comes handy for reports without data
    result.empty? # => false

    # You can access data as you would with matrix
    result[0][3] # => "North America"
    result[2] # ["Q2", "sum of Amount", "29490", "62010"]

    # You can ask questions about contents
    result.include_row? ["Q4", "sum of Amount", "29490", "62010"] # => true
    result.include_column? ["Europe", "29490", "29490", "29490", "29490"] # => false

    # this is fine but there is a lot fo clutter caused byt the headers. The library provides you with methods to get only slice of the result and creates a new result
    # Let's say I would like to get just data
    puts result.slice(1, 2)
    # [29490 | 62010]
    # [29490 | 62010]
    # [29490 | 62010]
    # [29490 | 62010]

    # This is a worker method that is used to implement several helpers
    # Previous example is equivalent with this
    puts result.data

    puts result.without_top_headers
    # [Q1 | sum of Amount | 29490 | 62010]
    # [Q2 | sum of Amount | 29490 | 62010]
    # [Q3 | sum of Amount | 29490 | 62010]
    # [Q4 | sum of Amount | 29490 | 62010]

    puts result.without_left_headers
    # [Europe | North America]
    # [29490  | 62010        ]
    # [29490  | 62010        ]
    # [29490  | 62010        ]
    # [29490  | 62010        ]

    # All of those are again results so everything above works as expected
    result.data.include_row? ["29490", "62010"] # => true

    # There are several other methods that might make your life easier. Consider the following
    result.diff result.without_top_headers
    # {
    #   :added => [],
    #    :removed => [[nil, nil, "Europe", "North America"]],
    #    :same => [["Q1", "sum of Amount", "29490", "62010"],
    #              ["Q2", "sum of Amount", "29490", "62010"],
    #              ["Q3", "sum of Amount", "29490", "62010"],
    #              ["Q4", "sum of Amount", "29490", "62010"]]
    # }

  end
end
```

Exporting report results
------

You can export the report from GoodData into one of the
typical formats for further processing or presentation.

```ruby
# encoding: utf-8

require 'gooddata'

GoodData.with_connection do |c|
  GoodData.with_project('project_id') do |project|
    result = project.reports('report_identifier').export(:csv)
    puts result
  end
end
```

There are more formats supported and either of
`:csv, :xls, :xlsx or :pdf` should work as an argument.

The export returns the actual data so if you would like to have them
stored into a file the responsibility is on you.

```ruby
# encoding: utf-8

require 'gooddata'

GoodData.with_connection do |c|
  GoodData.with_project('project_id') do |project|
    report = project.reports('report_identifier')
    File.open('export.csv', 'wb') { |f| f.write(report.export(:csv)) }
  end
end
```

Removing old versions from report
------

Occasionally you would like to clean up your project. The simplest way
to do it is to get rid of the old version of reports.

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

Computing/creating reports with filters
------

While SDK does not provide full support for all types of filters. There
are couple of useful wrappers that make it easier. If you need something
special you can always go to the raw APIs. Currently there are two types
of filters supported directly.

The general shape of the solution looks like this. For project computation 
on the fly (no report is saved):

```ruby
project.compute_report(:left => project.metrics.first, :filters => [])
```

or like this:

```ruby
project.create_report(title: 'best report ever with filter',
                      left: project.metrics.first,
                      filters: [])
```

You can also create a persisted report. Variable filter is very simple, you 
just provide the variable into the filter:

```ruby
var = project.variables('my_variable_identifier')
puts project.compute_report(left: project.metrics.first,
                            filters: [var])
```

Attribute name filter is probably the most commonly used filter type and it filters
certain attribute on certain values. Imagine "WHERE City IN \[San
Francisco, Prague\]". You can set it up easily like this.

```ruby
label = project.labels('label.regions.city.name')
puts project.compute_report(left: project.metrics.first,
                            filters: [[label, 'San Francisco', 'Prague']])

# You can also use a variation of NOT equal

label = project.labels('label.regions.city.name')
puts project.compute_report(left: project.metrics.first,
                            filters: [[label, :not, 'San Francisco', 'Prague']])

```

Testing Reports
------

We used testing reports as en example in the basic chapter [Logging and Testing](logging.md#testing).