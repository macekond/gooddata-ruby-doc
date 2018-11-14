---
id: adding_user_to_organization
author: GoodData
sidebar_label: Adding User to Organization
title: Adding User to Organization
---

Goal
-------

You would like to add a user to organization programmatically

Before you start

-------------

You have to have a user who is an admin of an organization. If you don’t
have the organization admin account, please contact your primary
GoodData contact person or GoodData support (e-mail
<support@gooddata.com>).

Example
--------

```ruby
# encoding: utf-8

require 'gooddata'

client = GoodData.connect

# Get your domain ..
domain = client.domain('domain_name')

# Generate random password
pass = (0...10).map { ('a'..'z').to_a[rand(26)] }.join

new_user = domain.add_user(
  :login => 'new.user@gooddata.com',
  :password => pass,
  :first_name => 'First',
  :last_name => 'Last',
  :email => 'test@gooddata.com',
  :sso_provider => 'some_sso'
)

pp new_user
```
