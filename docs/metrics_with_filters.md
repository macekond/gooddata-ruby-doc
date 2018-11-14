---
id: metrics_with_filters
author: GoodData
sidebar_label: Creating Metric with filter
title: Creating Metric with filter
---

Goal
-------

You want to create a more complicated metric that has filter on values
included

Solution
--------

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

Let’s have a look how we might write a code that does this


'src/09\_working\_with\_facts\_metrics\_and\_attributes/metric\_with\_filter.rb'
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
