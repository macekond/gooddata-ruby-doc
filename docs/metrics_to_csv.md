---
id: metrics_to_csv
author: GoodData
sidebar_label: Write Information about project’s metrics and attributes to CSV
title: Write Information about project’s metrics and attributes to CSV
---

Problem
-------

You would like to store information about all project metrics and
attributes in CSV.

Prerequisites
-------------

You have to have existing project with metric(s) and attribute(s).

Solution
--------

### Metrics


'src/09\_working\_with\_facts\_metrics\_and\_attributes/metrics\_to\_csv.rb'
```ruby
# encoding: UTF-8

require 'gooddata'

# Connect to GoodData platform
GoodData.with_connection do |c|
  GoodData.with_project('project_id') do |project|

    folder_cache = c.get(project.md['query'] + '/folders?type=metric')['query']['entries'].reduce({}) do |a, e|
      a[e['link']] = project.objects(e['link'])
      a
    end


      data = project.metrics.map do |metric|
```ruby
# encoding: UTF-8

require 'gooddata'

# Connect to GoodData platform
GoodData.with_connection do |c|
  GoodData.with_project('project_id') do |project|

    folder_cache = c.get(project.md['query'] + '/folders?type=metric')['query']['entries'].reduce({}) do |a, e|
      a[e['link']] = project.objects(e['link'])
      a
    end

    CSV.open(project.pid + "_metrics.csv", 'wb') do |csv|
```ruby
# encoding: UTF-8

require 'gooddata'

# Connect to GoodData platform
```ruby
# encoding: UTF-8

require 'gooddata'

# Connect to GoodData platform
GoodData.with_connection do |c|
  GoodData.with_project('project_id') do |project|

    folder_cache = c.get(project.md['query'] + '/folders?type=metric')['query']['entries'].reduce({}) do |a, e|
      a[e['link']] = project.objects(e['link'])
      a
    end

    CSV.open(project.pid + "_metrics.csv", 'wb') do |csv|
      data = project.metrics.map do |metric|
        folder = metric.content.key?('folders') && metric.content['folders'].is_a?(Enumerable) && metric.content['folders'].first
        [metric.title, metric.identifier, folder_cache[folder] && folder_cache[folder].title]
      end
      data.each do |m|
        csv << m
      end
      puts 'The CSV is ready!'
    end
  end
end
```
  GoodData.with_project('project_id') do |project|

    folder_cache = c.get(project.md['query'] + '/folders?type=metric')['query']['entries'].reduce({}) do |a, e|
      a[e['link']] = project.objects(e['link'])
      a
    end

    CSV.open(project.pid + "_metrics.csv", 'wb') do |csv|
      data = project.metrics.map do |metric|
        folder = metric.content.key?('folders') && metric.content['folders'].is_a?(Enumerable) && metric.content['folders'].first
        [metric.title, metric.identifier, folder_cache[folder] && folder_cache[folder].title]
      end
      data.each do |m|
        csv << m
      end
      puts 'The CSV is ready!'
    end
  end
end
```
        folder = metric.content.key?('folders') && metric.content['folders'].is_a?(Enumerable) && metric.content['folders'].first
        [metric.title, metric.identifier, folder_cache[folder] && folder_cache[folder].title]
      end
      data.each do |m|
        csv << m
      end
      puts 'The CSV is ready!'
    end
  end
end
```
        [metric.title, metric.identifier, folder_cache[folder] && folder_cache[folder].title]
      end
      data.each do |m|
        csv << m
      end
      puts 'The CSV is ready!'
    end
  end
end
```

It is a simple script that iterates over metrics (remember report
specific metrics are not included in the list) and collects some fields.
In our case it is title and pretty printed metric’s MAQL expression. If
you would like to get more information, just add them to the list. In
the end this list is formatted as a valid CSV so any reasonable CSV
parser should be able to load it.

### Attributes

You also might like to export attributes. The script itself is very
similar.

&lt;%= render\_ruby
'src/09\_working\_with\_facts\_metrics\_and\_attributes/attributes\_to\_csv.rb'
%&gt;

Discussion
----------

### Folders

Many times people want to also include the information about the folder
the metric/attribute is in. While SDK does not provide direct support
for it here is a little workaround to make it possible.

#### Attributes

&lt;%= render\_ruby
'src/09\_working\_with\_facts\_metrics\_and\_attributes/attributes\_with\_folder\_to\_csv.rb'
%&gt;

#### Metrics

&lt;%= render\_ruby
'src/09\_working\_with\_facts\_metrics\_and\_attributes/metrics\_with\_folder\_to\_csv.rb'
%&gt;
