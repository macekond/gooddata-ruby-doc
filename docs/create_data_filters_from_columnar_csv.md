---
id: create_data_filters_from_columnar_csv
author: GoodData
sidebar_label: Setting Data Permissions from CSV (column format)
title: Setting Data Permissions from CSV (column format)
---

Problem
-------

You would like to set data permissions for multiple users. You have a
CSV with two columns that associate user with a single data permission’s
value. We’ll use the same city example from the examples above.

Solution
--------

SDK offers couple of convenience features for doing this. Let’s first
recap what we need to set up a filter.

In this case we will be setting a simple data permission for the city
label in form of following filter

    WHERE city IN ('San Francisco', 'Prague', 'Amsterdam')

-   We need to know the label to filter. In our case this is the *city*
    label

-   We need to know the label’s values. In our case these are (San
    Francisco, Prague, Amsterdam)

-   We also need to know the user assigned with the filter. We’ll use
    your account in the example (you may use any valid user).

Let’s say we want to set up these specific values

    ['john.doe@example.com', 'San Francisco', 'Amsterdam']
    ['jane.doe@example.com', 'San Francisco', 'Prague']

We’ll capture these data permissions in the following CSV (data.csv)

    login,city
    john.doe@example.com,San Francisco
    john.doe@example.com,Amsterdam
    jane.doe@example.com,San Francisco
    jane.doe@example.com,Prague


'src/11\_working\_with\_data\_filters/filters\_from\_columnar\_csv.rb'
```ruby
# encoding: utf-8

require 'gooddata'

GoodData.with_connection do |c|
  GoodData.with_project('project_id') do |project|
    # First let's grab an attribute
    attribute = project.attributes('attr.region.city')
    # to set up a value we need a specific label
    # if the attribute has only one label, you can easily grab it by calling #primary_label
    label = attribute.primary_label
    # if a label has multiple labels, you can select the correct one like this
    # label = attribute.label_by_name('City name')
    filters = GoodData::UserFilterBuilder::get_filters('data.csv', { 
      :type => :filter, 
      :labels => [{:label => label, :column => 'city'}]
      })      
    project.add_data_permissions(filters)
  end
end
```

### Preconditions

Several things has to be true for this code to work correctly

-   All the users are members of the target project

-   All the label’s (city) values are present in the data loaded in the
    project
