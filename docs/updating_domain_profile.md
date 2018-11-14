---
id: updating_domain_profile
author: GoodData
sidebar_label: Updating a User in Organization
title: Updating a User in Organization
---

Goal
-------

You have users in your organization but some of those have incorrect or
outdated information and need update

Before you start

-------------

You have to have a user who is an admin of an organization. If you don’t
have the organization admin account, please contact your primary
GoodData contact person or GoodData support (e-mail
<support@gooddata.com>). You have an organization populated with user.
If you don’t take a look at the recipe above (Adding user to
organization)

Example

--------

Here we are updating an sso provider but you can update almost any
property of a user.


```ruby
# encoding: utf-8

require 'gooddata'

client = GoodData.connect
domain = client.domain 'organization_name'
u = domain.find_user_by_login('john@gooddata.com')
u.sso_provider = 'a_provider'
domain.update_user(u)
```
