---
id: list_organization_users
author: GoodData
sidebar_label: Listing Organization’s Users
title: Listing Organization’s Users
---

Goal
-------

You would like to list users in organization

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

# Connect to platform using credentials
client = GoodData.connect

domain = client.domain('domain_name')
users = domain.users
pp users
```
