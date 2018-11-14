---
id: connecting_to_gooddata_using_sso
author: GoodData
sidebar_label: Connecting to GoodData using Single Sign On (SSO)
title: Connecting to GoodData using Single Sign On (SSO)
---

Problem
-------

You do have SSO enabled and want to use it for logging to GoodData
without using username and password.

Solution
--------

Using the SSO capability you don’t need to maintain just another
password for accessing GoodData application. You can use your existing
infrastructure for user management and connect with GoodData APIs to
allow your users login to GoodData seamlessly.

For more info check this article -
<https://developer.gooddata.com/article/single-sign-on>


```ruby
# encoding: utf-8

require 'gooddata'
require 'pp'

client = GoodData.connect_sso('tomas.korcak@gooddata.com', 'gooddata.tomas.korcak')

pp client.user.json
```

Discussion
----------

Never share the your private key with other people. It is the same thing
as you name and password. You can do almost everything with it.
