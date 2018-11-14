---
id: building_small_project_on_one_page
author: GoodData
sidebar_label: Creating Project in One Page of Code
title: Creating Project in One Page of Code
---

Goal
-------

You would like to create the whole project from code for whatever
reason.

Before you start
-------------

You have a provisioning token for project creation

Example
--------

What we will do is to create a simple project with 4 datasets. Load
couple of line of data create a simple report and invite 2 other people
to it. All this will fit on one page of code. Let’s get to it.


'src/12\_working\_with\_blueprints/building\_small\_project\_on\_one\_page.rb'
```ruby
# encoding: utf-8

require 'gooddata'

GoodData.with_connection('user', 'password') do |client|
  blueprint = GoodData::Model::ProjectBlueprint.build('Acme project') do |p|
    p.add_date_dimension('committed_on')
    p.add_dataset('devs') do |d|
      d.add_anchor('attr.dev')
      d.add_label('label.dev_id', :reference => 'attr.dev')
      d.add_label('label.dev_email', :reference => 'attr.dev')
    end
    p.add_dataset('commits') do |d|
      d.add_anchor('attr.commits_id')
      d.add_fact('fact.lines_changed')
      d.add_date('committed_on')
      d.add_reference('devs')
    end
  end
  project = GoodData::Project.create_from_blueprint(blueprint, auth_token: '')
  puts "Created project #{project.pid}"

  # Load data
  commits_data = [
    ['fact.lines_changed', 'committed_on', 'devs'],
    [1, '01/01/2014', 1],
    [3, '01/02/2014', 2],
    [5, '05/02/2014', 3]]
  project.upload(commits_data, blueprint, 'commits')

  devs_data = [
    ['label.dev_id', 'label.dev_email'],
    [1, 'tomas@gooddata.com'],
    [2, 'petr@gooddata.com'],
    [3, 'jirka@gooddata.com']]
  project.upload(devs_data, blueprint, 'devs')

  # create a metric
  metric = project.facts('fact.lines_changed').create_metric
  metric.save
  report = project.create_report(title: 'Awesome_report', top: [metric], left: ['label.dev_email'])
  report.save
  ['john@example.com'].each do |email|
    p.invite(email, 'admin', "Guys checkout this report #{report.browser_uri}")
  end
end
```
