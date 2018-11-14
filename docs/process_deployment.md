---
id: process_deployment
author: GoodData
sidebar_label: Deploying Process
title: Deploying Process
---

Goal
-------

You would like to deploy a CloudConnect or Ruby SDK process to GoodData
platform.

Solution
--------

SDK allows you to deploy a process. Just point it to a directory or a
zipped archive that you want to deploy. Below is an example of
CloudConnect process deployment. When deploying CloudConnect processes
you typically want to take the whole folder structure of a CloudConnect
project and deploy it. So you will want to pass either path to the root
folder of the structure or you can zip it first and pass just a path to
the zip archive. The below example points to the root folder of a
CloudConnect project.


```ruby
# encoding: utf-8

require 'gooddata'

GoodData.with_connection do |client|
  GoodData.with_project('project_id') do |project|
    project.deploy_process('./path/to_cloud_connect_directory',
      name: 'Test ETL Process')
  end
end 
```
