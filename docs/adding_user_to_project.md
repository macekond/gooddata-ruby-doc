---
id: adding_user_to_project
author: GoodData
sidebar_label: Adding User from Organization to Project
title: Adding User from Organization to Project
---

Goal
-------

You have users added in organization (domain). You would like to add
them into the project.

Before you start
-------------

You have to have a user who is an admin of an organization. If you don’t
have the organization admin account, please contact your primary
GoodData contact person or GoodData support (e-mail
<support@gooddata.com>).

Example
--------

```ruby
require 'gooddata'

GoodData.with_connection do |client|
  # Get your domain ..
  domain = client.domain('domain_name')
  GoodData.with_project('project_id') do |project|
    # Let's get all users except of ourselves
    users_to_add = domain.users.reject { |u| u.login == client.user.login }
    # Let's add all as viewer
    users_to_add.each { |u| project.add_user(u, 'Viewer', domain: domain) }
  end
end
```
