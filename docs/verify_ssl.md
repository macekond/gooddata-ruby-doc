---
id: verify_ssl
author: GoodData
sidebar_label: Disabling SSL Verification
title: Disabling SSL Verification
---

Connecting without SSL
-------

You would like to disable SSL verification when using SDK against a
server that does not have proper certificates

You can switch of SSL validating like this. This is especially useful
when you are using SDK against testing or development servers.

```ruby
# encoding: utf-8

require 'gooddata'

# Traditionally with login and pass
client = GoodData.connect(login: 'user', password: 'password', verify_ssl: false)

# You can also use it with SST token
client = GoodData.connect(sst_token: 'sst_token', verify_ssl: false)
```
