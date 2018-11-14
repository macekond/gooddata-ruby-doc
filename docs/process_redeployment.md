---
id: process_redeployment
author: GoodData
sidebar_label: Redeploying Existing Process
title: Redeploying Existing Process
---

Goal
-------

You would like to redeploy a CloudConnect or Ruby process to GoodData
platform.

Example

--------

SDK provides means for redeploying a process (with a new updated
content). All you have to do is to get a handle on the process. Here we
are using a process id to identify the process that we want to redeploy.
You can use any other way to identify the process to redeploy. Take note
that the same deployment rules as in `project.deploy_process` apply.


```ruby
# encoding: utf-8

require 'gooddata'

GoodData.with_connection do |client|
  GoodData.with_project('project_id') do |project|
    process = project.processes('process_id')
    process.deploy('./path/to_cloud_connect_directory')
  end
end 
```
