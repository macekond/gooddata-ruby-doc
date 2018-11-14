---
id: automated_data_distribution
author: GoodData
sidebar_label: Automated Data Distribution (ADD)
title: Automated Data Distribution (ADD)
---

Goal
-------

You would like to upload data from the Data Warehouse to a workspace.

Solution
--------

You must have the output stage associated with the workspace you need to
upload data to. An ADD process is created after associating the
workspace with the output stage.


```ruby
# encoding: utf-8

require 'gooddata'

GoodData.with_connection do |client|
  GoodData.with_project('project_id') do |project|
    ads = client.create_datawarehouse(title: 'Test ADS', auth_token: 'ADS_CREATION_TOKEN')
    output_stage = project.create_output_stage(ads)
    puts output_stage.sql_diff
    add_process = project.add.process
  end  
end 
```
