---
id: invite_users_from_csv
author: GoodData
sidebar_label: Creating Multiple Users from CSV
title: Creating Multiple Users from CSV
---

Goal
-------

You have CSV containing users, their roles and passwords and you want to
create them in bulk.

Before you start
-------------

You have to have existing project and be admin of it.

Example
--------


```ruby
# encoding: UTF-8

require 'gooddata'

# Project ID
PROJECT_ID = 'we1vvh4il93r0927r809i3agif50d7iz'

GoodData.with_connection do |c|
  GoodData.with_project(PROJECT_ID) do |project|
    path = File.join(File.dirname(__FILE__), '..', 'data', 'users.csv')
    puts "Loading #{path}"
    CSV.foreach(path, :headers => true, :return_headers => false) do |user|
      email = user[0]
      role = user[1]
      project.invite(email, role)
    end
  end
end
```
