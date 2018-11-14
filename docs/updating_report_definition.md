---
id: updating_report_definition
author: GoodData
sidebar_label: Updating report definition
title: Updating report definition
---

Goal
-------

You have report and you want to update report definition in easy way.
Perhaps you need to modify multiple reports in one or more projects.

Solution
--------

Use the Report\#update\_definition with block argument in following way.


'src/08\_working\_with\_reports/update\_report\_definition\_immutable.rb'
```ruby
require 'gooddata'
require 'pp'

PID = 'rq3enqarynvkt7q11u0stev65qdwpow8'
REPORT = '/gdc/md/rq3enqarynvkt7q11u0stev65qdwpow8/obj/1323'

GoodData.with_connection do |c|
  GoodData.with_project(PID) do |project|

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
    new_def = report.update_definition(:new_definition => false) do |rdef|
      rdef.title = "Test TITLE: #{DateTime.now.strftime}"
    end

    pp new_def
  end
end
```

Discussion
----------

Specify :new\_definition ⇒ false if you do want to update the latest
report definition instead of creating new one. New definition flag is
true by default.

&lt;%= render\_ruby
'src/08\_working\_with\_reports/update\_report\_definition.rb' %&gt;
