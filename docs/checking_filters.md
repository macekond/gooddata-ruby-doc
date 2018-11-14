---
id: checking_filters
author: GoodData
sidebar_label: List Data Permissions
title: List Data Permissions
---

Problem
-------

You have a project that has the data permissions set up. You would like
to review them.

Solution
--------

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
