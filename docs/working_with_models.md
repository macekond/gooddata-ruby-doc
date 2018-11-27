---
id: working_with_models
author: GoodData
sidebar_label: Model Setup
title: Model Setup
---

Changing Object’s Identifier
------

You can change the identifier on any object (e.g. dashboards, reports,
metrics, attributes, facts etc.). Many tools rely on specific LDM object
identifier’s naming convention. So changing the identifier may be very
handy for for enforcing the naming convention. For example when you move
an attribute from one dataset to another, you may want to change its
identifier.

```ruby
# encoding: utf-8

require 'gooddata'

GoodData.with_connection do |c|
  GoodData.with_project('project_pid') do |project|

    # We find the attribute we want to change
    # Lets list all attributes in the project
    # and print its title and identifier
    puts project.attributes.map {|a| [a.identifier, a.title]}

    # Let's pick one
    # Here I just pick the first one
    attribute = project.attributes.first

    # but you can also pick one by identifier. For example
    # attribute = project.attributes('attr.salesmem.country')
    # We have a look at the current value.
    # Let's say it is 'attr.users.region'
    puts attribute.identifier

    # We change the value
    attribute.identifier = 'attr.salesmen.region'
    attribute.save

    # If we refresh the value from server
    # we get a new value 'attr.salesmen.region'
    attribute.reload!
    puts attribute.identifier

  end
end
```

Computing Dataset’s Number of Records
------

This is not so easy to do on UI. You basically have to find the
dataset’s connection point and then create a simple report with COUNT
metric. The SDK makes this a very simple task.

```ruby
# encoding: utf-8

require 'gooddata'

GoodData.with_connection do |c|
  GoodData.with_project('project_pid') do |project|
    blueprint = project.blueprint
    blueprint.datasets.each do |dataset|
      count = dataset.count(project)
      puts "Number of record in a dataset #{dataset.title} is #{count}"
    end
  end
end
```

Enumerating Date Dimensions
------

You can find out how many date dimensions you have in a project.

```ruby
# encoding: utf-8

require 'gooddata'

GoodData.with_connection do |c|
  GoodData.with_project('project_pid') do |project|
    blueprint = project.blueprint
    dds = blueprint.date_dimensions
    puts "You have #{dds.count} date dimensions in your project"
  end
end 
```


Removing Data
------

Sometimes you need to delete all data from a dataset.

The SDK calls the MAQL SYNCHRONIZE command on the dataset

    SYNCHRONIZE {dataset.users};

for each dataset you would like to clear. You can achieve the same like
this:

```ruby
# encoding: utf-8

require 'gooddata'

GoodData.with_connection do |c|
  GoodData.with_project('project_pid') do |project|

    # You can select the dataset in several ways
    dataset = project.datasets.find {|d| d.title == 'Users'}
    dataset = project.datasets('dataset.users')
    dataset = project.datasets(345)
    # dataset.synchronize works as well
    dataset.delete_data

  end
end
```

Exploring Unknown Project
------

You just got invited to this project and just can’t reach the project’s
author. Can’t find any project’s documentation. The following code
snippet may be helpful in such situation

You want to start with a quick introspection. How many datasets, how
much data is there how many processes etc. Doing this manually is fairly
time consuming. You have to find the primary attributes of each dataset
create a count metric and a lot of other stuff. This can be automated
and it is so useful we actually created a command that does just this.

```ruby
GoodData.with_connection do |c|
  GoodData.with_project('project_pid') do |project|
    project.info
  end
end
```

This might be the hypothetical output. For each dataset you have there
the size. Below is a breakdown of how many different types of objects
there are inside the dataset:

    GOODSALES
    ===============

    Datasets - 28

    stage_history
    =============
    Size - 29103.0 rows
    1 attributes, 4 facts, 8 references

    opp_snapshot
    ============
    Size - 2130074.0 rows
    1 attributes, 9 facts, 21 references

    .
    .
    .
    .

    Opp_changes
    ===========
    Size - 472.0 rows
    2 attributes, 6 facts, 10 references

    Opportunity Benchmark
    =====================
    Size - 487117.0 rows
    3 attributes, 2 facts, 2 references

Substitute Date Dimension for Another One
------

You can substitute an existing date dimension in your project for
another date dimension. This is particularly handy when you are
consolidating date dimensions (perhaps you want to have only one date
dimension in your project) or replacing your standard date dimension
with a fiscal date dimension.

The code snippet below substitutes all occurences of a date dimension
objects (attributes and labels) for another date dimension’s objects
(that must obviously exist in the project). The substitution is
performed in following objects:

-   Metrics

-   Report Definitions

-   Reports

-   Report Specific Metrics

-   Dashboards

-   Dashboard Saved Views

-   Mandatory User Filters aka Data Permissions


```ruby
# encoding: utf-8

require 'gooddata'

GoodData.with_connection do |c|
  GoodData.with_project('project_pid') do |project|

    opts = {
      # You can specify name of new and old date dimension...
      # :old => 'Close',
      # :new => 'Completed',

      # Or explicitly specify mapping using identifiers...
      :mapping => {
        'closedate.date' => 'abortdate.date',
        'closedate.day.in.euweek' => 'abortdate.day.in.week',
        'closedate.month' => 'abortdate.month',
        'closedate.month.in.year' => 'abortdate.month.in.year',
        'closedate.euweek.in.year' => 'abortdate.week.in.year',
        'closedate.euweek' => 'abortdate.week',
        'closedate.quarter' => 'abortdate.quarter',
        'closedate.day.in.month' => 'abortdate.day.in.month',
        'closedate.week.in.quarter' => 'abortdate.week.in.quarter',
        'closedate.quarter.in.year' => 'abortdate.quarter.in.year',
        'closedate.week' => 'abortdate.week',
        'closedate.day.in.year' => 'abortdate.day.in.year',
        'closedate.day.in.week' => 'abortdate.day.in.week',
        'closedate.week.in.year' => 'abortdate.week.in.year',
        'closedate.euweek.in.quarter' => 'abortdate.week.in.quarter',
        'closedate.day.in.quarter' => 'abortdate.day.in.quarter',
        'closedate.year' => 'closedate.year',
        'closedate.month.in.quarter' => 'abortdate.month.in.quarter'
      },

      :dry_run = false # Optional. Default 'false'
    }

    project.replace_date_dimension(opts)
  end
end
```

You need to specify complete mapping between the current and new date
dimensions attributes. This is straightforward in case when both date
dimensions have the same structure (see the commented out *:old* /
*:new* syntax). Full mapping is necessary when the date dimensions have
different structures. For example the *abortdate* date dimension in the
code above doesn’t have any *EU week* attributes. The existing
*closedate*'s *EU week* attributes are mapped to standard week
attributes of the *abortdate* dimension.
