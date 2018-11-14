---
id: checking_user_in_project
author: GoodData
sidebar_label: Checking User Membership in Project
title: Checking User Membership in Project
---

Goal
-------

You would like to see if a user is part of a project.

Prerequisites
-------------

You have to have a user who is an admin of an organization. If you don’t
have the organization admin account, please contact your primary
GoodData contact person or GoodData support (e-mail
<support@gooddata.com>).

Solution
--------


```ruby
# encoding: utf-8

require 'gooddata'

GoodData.with_connection('user', 'password') do |client|
  GoodData.with_project('project_pid') do |project|
    project.member?('jane.doe@example.com')
  end
end 
```

Discussion
----------

You can ask on membership not just by login but also check an object.
This might be useful especially if you check a user from several
projects.
