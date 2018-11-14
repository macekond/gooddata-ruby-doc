---
id: export_report
author: GoodData
sidebar_label: Exporting report results
title: Exporting report results
---

Problem
-------

You would like to export the report from GoodData into one of the
typical formats for further processing or presentation.

Solution
--------

There are a simple way how to export a report from gooddata


```ruby
# encoding: utf-8

require 'gooddata'

GoodData.with_connection do |c|
  GoodData.with_project('project_id') do |project|
    report = project.reports('report_identifier')
    File.open('export.csv', 'wb') { |f| f.write(report.export(:csv)) }
  end

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

### Discussion

There are more formats supported and either of
`:csv, :xls, :xlsx or :pdf` should work.

The export returns the actual data so if you would like to have them
stored into a file the responsibility is on you.

&lt;%= render\_ruby
'src/08\_working\_with\_reports/exporting\_a\_report\_to\_file.rb' %&gt;
