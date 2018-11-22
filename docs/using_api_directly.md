---
id: using_api_directly
author: GoodData
sidebar_label: Using APIs
title: Using APIs
---


How-to
--------

SDK provides you slew of well known methods that make this possible
while shielding you from intricacies of keeping connection alive etc.

```ruby
# encoding: utf-8

require 'gooddata'

GoodData.with_connection('user', 'password') do |client|
  client.get("/gdc/md/")
  project_id = 'YOUR_PROJECT_ID'
  client.delete("/gdc/projects/#{project_id}")
end
```