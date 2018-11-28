---
id: working_with_your_data
author: GoodData
sidebar_label: Working with Your Data
title: Working with Your Data
---

Before we start, you have to have an existing project with model and data loaded.

Creating Metrics from Attributes
------

If you have several attributes in a project, you can create some
basic metric out of them.

```ruby
# encoding: UTF-8

require 'gooddata'

# Connect to GoodData platform
GoodData.with_connection do |c|
  GoodData.with_project('project_id') do |project|
    attribute = project.attributes('attr.devs.dev_id')
    metric = attribute.create_metric(:title => "Count of [#{attribute.identifier}]")
    metric.save
    metric.execute
  end
end
```

Creating Metrics from Facts
------

If you have several facts in a project, you can create some basic
metric out of them.

```ruby
# encoding: UTF-8

require 'gooddata'

# Connect to GoodData platform
GoodData.with_connection do |c|
  GoodData.with_project('project_id') do |project|
    fact = project.facts('fact.commits.lines_changed')
    metric = fact.create_metric(:title => "Sum of [#{fact.identifier}]")
    res = metric.execute
    puts res

    # if you like the metric you can save it of course for later usage
    metric.save

    # Default aggregation is SUM but you can also specify a different one
    metric = fact.create_metric(:title => "Min of [#{fact.identifier}]", type: :min)
  end
end 
```

Write Information about project’s metrics and attributes to CSV
------

You can store information about all project metrics and attributes in a CSV file.


### Metrics

```ruby
# encoding: UTF-8

require 'gooddata'

# Connect to GoodData platform
GoodData.with_connection do |c|
  GoodData.with_project('project_id') do |project|
    CSV.open(project.pid + "_metrics.csv", 'wb') do |csv|
      data = project.metrics.pmap do |metric|
        [metric.title, metric.pretty_expression]
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

```ruby
# encoding: UTF-8

require 'gooddata'

# Connect to GoodData platform
GoodData.with_connection do |c|
  GoodData.with_project('project_id') do |project|
    CSV.open(project.pid + "_attributes.csv", 'wb') do |csv|
      data = project.attributes.pmap do |attribute|
        [attribute.title, attribute.identifier]
      end
      data.each do |m|
        csv << m
      end
      puts 'The CSV is ready!'
    end
  end
end
```

### Folders

Many times people want to also include the information about the folder
the metric/attribute is in. While SDK does not provide direct support
for it here is a little workaround to make it possible.

Attributes:

```ruby
# encoding: UTF-8

require 'gooddata'

# Connect to GoodData platform
GoodData.with_connection do |c|
  GoodData.with_project('project_id') do |project|

    folder_cache = c.get(project.md['query'] + '/dimensions')['query']['entries'].reduce({}) do |a, e|
      a[e['link']] = project.objects(e['link'])
      a
    end

    CSV.open(project.pid + "_attributes.csv", 'wb') do |csv|
      data = project.attributes.pmap do |attribute|
        [attribute.title, attribute.identifier, attribute.content['dimension'] && folder_cache[attribute.content['dimension']].title]
      end
      data.each do |m|
        csv << m
      end
      puts 'The CSV is ready!'
    end
  end
end
```

Metrics:

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


Changing Metric’s Number Formatting
------

You can update formatting of all metrics in your project programmatically. The project below is currently formatted for dollar values but you would like to change all formats to Euro:

```ruby
# encoding: utf-8

require 'gooddata'

GoodData.with_connection do |c|
  GoodData.with_project('project_id') do |project|
    project.metrics.pmap do |metric|
      metric.content['format'] = metric.content['format'].gsub('$', '€')
      metric.save
    end
  end
end 
```

Creating Metrics
------

You can create advanced MAQL metric.

```ruby
# encoding: UTF-8

require 'gooddata'

# Connect to GoodData platform
GoodData.with_connection do |c|
  GoodData.with_project('project_id') do |project|
    metric = project.add_measure 'SELECT PERCENTILE(#"Amount",0.9)', 
     title: 'Salary Amount [90th Pct]'
    metric.save
    metric.execute
    
    metric = project.add_measure 'SELECT PERCENTILE(![fact.salary.amount],0.9)', 
     title: 'Salary Amount [90th Pct] V2' 
    metric.save
    metric.execute
    
    metric = project.add_measure 'SELECT PERCENTILE([/gdc/md/ptbedvc1841r4obgptywd2mzhbwjsfyr/obj/223],0.9)', 
     title: 'Salary Amount [90th Pct] V3' 
    metric.save
    metric.execute
    
  end
end
```

Please note that the MAQL statement uses three ways how to reference the
underlying objects (e.g. facts or metrics that are part of the MAQL
statement)

-   *\#"Amount"* for referencing the fact (or metric) via its name
    (title)

-   *!\[fact.salary.amount\]* for referencing the fact (or metric) via
    its identifier

-   *\[/gdc/md/ptbedvc1841r4obgptywd2mzhbwjsfyr/obj/223\]* for
    referencing the fact (or metric) via its uri


Creating Metric with filter
------

In this case we will actually create the raw MAQL metric along with the
filter values. The main problem is that you have to find out the URLs of
all the objects and values. This is generally tricky but SDK can
simplify this a bit.

We will try to create a metric that looks like this in "human readable"
MAQL.

    SELECT COUNT(City) WHERE Continent IN ('Europe', 'Africa')

This is actually not a MAQL that would be possible to post to the API.
You must translate all the objects into their valid URLs. The MAQL then
might look like this (obviously the URLs will look different in your
particular case)

    SELECT COUNT([/gdc/md/e8pid3efwftbc3pc13nnnau4xymb0198/obj/23]) WHERE [/gdc/md/e8pid3efwftbc3pc13nnnau4xymb0198/obj/72] IN ([/gdc/md/e8pid3efwftbc3pc13nnnau4xymb0198/obj/72/elements?id=0], [/gdc/md/e8pid3efwftbc3pc13nnnau4xymb0198/obj/72/elements?id=1])

Let’s have a look how we might write a code that does this.

```ruby
# encoding: UTF-8

require 'gooddata'

# Connect to GoodData platform
GoodData.with_connection do |c|
  GoodData.with_project('project_id') do |project|

    # Let's find the city attribute - here we assume identifer atttribute.cities.city
    city_attribute = project.attributes('atttribute.cities.city')

    # Let's find the continent label - here we assume identifer label.cities.continent.name
    continent_label = project.labels('label.cities.continent.name')
    filter_values = ['Europe', 'Africa'].map { |val| "[#{continent_label.find_value_uri(val)}]" }.join(', ')

    m = project.create_metric("SELECT COUNT([#{city_attribute.uri}]) WHERE #{continent_label.uri} IN #{filter_values}", extended_notation: false)
    puts m.execute
  end
end
```



