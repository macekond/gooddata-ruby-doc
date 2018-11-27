---
id: working_with_permissions
author: GoodData
sidebar_label: Setting Permissions
title: Setting Permissions
---

Setting Up Simple Data Permission
-------

You can set a data permission (user filter or MUF filter) for
one or two users.

SDK offers couple of convenience features for doing this. Let’s first
recap what we need to set up a data permission filter. We’ll be setting
a simple filter along these lines

    WHERE city IN (San Francisco, Prague, Amsterdam)

-   We need to know the label to filter. In our case this is the *city*
    label

-   We need to know the label’s values. In our case these are (San
    Francisco, Prague, Amsterdam)

-   We also need to know the user assigned with the filter. We’ll use
    your account in the example (you may use any valid user).

Although we present this as an executable script this is something that
is often done interactively. So do not fear to jack in to a project and
follow along.

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
    # label = attribute.label_by_name('City Name')
    # Let's construct filters we are going to set up
    # We will do it for two hypothetical users
    filters = [
      ['john.doe@example.com', label.uri, 'San Francisco', 'Amsterdam'],
      ['jane.doe@example.com', label.uri, 'San Francisco', 'Prague']
    ]
    # Obvious question might be how do you know that the values are correct
    # you can find out like this label.value?('Amsterdam')
    # Let's now update the project
    project.add_data_permissions(filters)
  end
end 
```

List Data Permissions
-------

There is no UI that would provide a good overview and API is a little
crude but with help of SDK you can get around that.


```ruby
# encoding: utf-8

require 'gooddata'

GoodData.with_connection do |c|
  GoodData.with_project('project_id') do |project|
    project.data_permissions.pmap {|f| [f.related.login, f.pretty_expression]}
  end
end
```

Setting Data Permissions from CSV (column format)
-------

You can also set data permissions for multiple users. Let's have a
CSV with two columns that associate user with a single data permission’s
value. We’ll use the same city example from the examples above.

The SDK offers couple of convenience features for doing this. Let’s first
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

Several things has to be true for this code to work correctly

-   All the users are members of the target project

-   All the label’s (city) values are present in the data loaded in the
    project

Setting Data Permissions from CSV (row format)
-------

You can also set data permissions for multiple users. Let's have a
CSV with two columns that associate user with a single data permission’s
value. We’ll use the same city example from the examples above.

The SDK offers couple of convenience features for doing this. Let’s first
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

    john.doe@example.com,San Francisco,Amsterdam
    jane.doe@example.com,San Francisco,Prague,Berlin

Please note that the CSV format is different from the previous example.
There are no headers because the file can have a different number of
columns on each line.

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
      :labels => [{:label => label}]
      })
    project.add_data_permissions(filters)
  end
end
  ```

Several things has to be true for this code to work correctly

-   All the users are members of the target project

-   All the label’s (city) values are present in the data loaded in the
    project


List Variable Values
-------

If you have variables in your project, you can see the values in a readable fashion.

The SDK tries to hide the differences from Data Permissions so this recipe
is analogy to [List Data Permissions](working_with_permissions.md#list-data-permissions) recipe.

```ruby
# encoding: utf-8

require 'gooddata'

# fill this in
VARIABLE_IDENTIFIER = 'variable_identifier'
PROJECT_ID = 'project_id'

GoodData.with_connection do |c|
  GoodData.with_project(PROJECT_ID) do |project|
    var = project.variables(VARIABLE_IDENTIFIER)
    var.values.pmap do |var|
      owner = var.related.class == GoodData::Project ? "[PROJECT DEFAULT]" : var.related.login rescue nil
      [owner, var.pretty_expression]
    end
  end
end
```

Unlike the Data Permissions, the Variables have a concept of default value for
the project. If a specific values is not provided for a user the project
default is used. You can noticed these users to have "TRUE" as a value.
The project value is marked as \[PROJECT DEFAULT\] in the output.
