---
id: using_api_directly
author: GoodData
sidebar_label: Using APIs
title: Using APIs
---

Goal
-------

You would like to interact with GoodData API directly

How-to
--------

SDK provides you slew of well known methods that make this possible
while shielding you from intricacies of keeping connection alive etc.





SDK provides you slew of well known methods that make this possible 
while shielding you from intricacies of keeping connection alive etc.

```ruby
require 'gooddata'

GoodData.with_connection('user', 'password') do |client|
  client.get("/gdc/md/")
  project_id = 'YOUR_PROJECT_ID'
  client.delete("/gdc/projects/#{project_id}")
end