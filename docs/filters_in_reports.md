---
id: filters_in_reports
author: GoodData
sidebar_label: Computing/creating reports with filters
title: Computing/creating reports with filters
---

Goal
-------

Computing report is great but without filter it is not that great.

How-to
--------

While SDK does not provide full support for all types of filters. There
are couple of useful wrappers that make it easier. If you need something
special you can always go to the raw APIs. Currently there are two types
of filters supported directly.

The general shape of the solution looks like this

    project.compute_report(:left => project.metrics.first, :filters => [])

for project computation on the fly (no report is saved) or like this

    project.create_report(title: 'best report ever with filter',
                          left: project.metrics.first,
                          filters: [])

For creating and persisting a report.

### Variable filter

Variable filter is very simple. You just provide the variable into the
filter.


```ruby
label = project.labels('label.regions.city.name')
puts project.compute_report(left: project.metrics.first,
                            filters: [[label, 'San Francisco', 'Prague']])

# You can also use a variation of NOT equal

label = project.labels('label.regions.city.name')

```ruby
label = project.labels('label.regions.city.name')
puts project.compute_report(left: project.metrics.first,
                            filters: [[label, 'San Francisco', 'Prague']])

# You can also use a variation of NOT equal

label = project.labels('label.regions.city.name')
puts project.compute_report(left: project.metrics.first,
                            filters: [[label, :not, 'San Francisco', 'Prague']])

```

```

### Attribute value filter

This is probably the most commonly used filter type and it filters
certain attribute on certain values. Imagine "WHERE City IN \[San
Francisco, Prague\]". You can set it up easily like this.

&lt;%= render\_ruby
'src/08\_working\_with\_reports/filters\_in\_reports.rb' %&gt;
