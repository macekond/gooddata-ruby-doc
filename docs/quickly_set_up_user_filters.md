---
id: quickly_set_up_user_filters
author: GoodData
sidebar_label: Setting Up Simple Data Permission
title: Setting Up Simple Data Permission
---

Goal
-------

You would like to set a data permission (user filter or MUF filter) for
one or two users.

How-to

--------

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


'src/11\_working\_with\_data\_filters/create\_filters\_interactively.rb'
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
