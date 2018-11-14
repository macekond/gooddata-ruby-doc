---
id: list_project_users
author: GoodData
sidebar_label: Listing Project’s Users
title: Listing Project’s Users
---

Goal
-------

You would like to list users in project

Before you start

-------------

You have to have a user who is a project admin.

Example

--------


```ruby
# encoding: utf-8

require 'gooddata'

GoodData.with_connection('user', 'password') do |client|
  GoodData.with_project('project_pid') do |project|
    pp project.users
    # You might want to see just name and login
    pp project.users.map {|u| [u.login, u.name]}
  end
end 
```
