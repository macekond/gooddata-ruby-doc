---
id: deleting_users_from_all_projects
author: GoodData
sidebar_label: Deleting users from all projects
title: Deleting users from all projects
---

Problem
-------

You would like to remove one user from all projects.

Solution
--------

This script should remove user from all projects. There are couple of
things you need to keep in mind though.

-   This deletes user only from projects where you have access to

-   If you are not admin in particular project the user will not be
    deleted from that particular project


```ruby
# encoding: utf-8

require 'gooddata'

login = 'john.doe@gooddata.com'

# Connect to platform using credentials
GoodData.with_connection do |client|
  # first select only projects where you are admin
  # which means you can read users and disable them
  projects = client.projects.pselect(&:am_i_admin?)
  projects.peach do |project|
    project.member(login).disable
  end
end
```
