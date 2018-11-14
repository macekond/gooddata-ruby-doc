---
id: listing_variables
author: GoodData
sidebar_label: List Variable Values
title: List Variable Values
---

Goal
-------

You have variable in your project and you would like to see the values
in a readable fashion.

How-to

--------

SDK tries to hide the differences from Data Permissions so this recipe
is analogy to [???](#List Data Permissions) recipe.


'src/11\_working\_with\_data\_filters/list\_user\_variable\_values.rb'
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

Unlike the Data Permissions Variables has a concept of default value for
the project. If a specific values is not provided for a user the project
default is used. You can noticed these users to have "TRUE" as a value.
The project value is marked as \[PROJECT DEFAULT\] in the output.
