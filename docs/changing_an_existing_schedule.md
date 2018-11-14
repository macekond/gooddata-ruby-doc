---
id: changing_an_existing_schedule
author: GoodData
sidebar_label: Changing an existing schedule
title: Changing an existing schedule
---

Goal
-------

You have a schedule but would like to change it

Solution
--------

You can retrieve a schedule in the same way as any other object, use
it’s methods to change it and save it.


```ruby
# encoding: utf-8

require 'gooddata'

schedule_id = 'fill_in'

GoodData.with_connection do |client|
  project = client.projects('project_id')
  schedule = project.schedules(schedule_id)
  # you can change pretty much anything

  # executable
  schedule.executable = 'graph/new_graph.grf'

  # params
  schedule.params
  # {
  #   "PROCESS_ID"=>"c42c1b82-7d6f-433a-b008-9cdb1d454e01",
  #   "EXECUTABLE"=>"new_main.rb",
  #   :a=>:b
  # }
  schedule.set_param(:a, :c)
  schedule.params
  # {
  #   "PROCESS_ID"=>"c42c1b82-7d6f-433a-b008-9cdb1d454e01",
  #   "EXECUTABLE"=>"new_main.rb",
  #   :a=>:c
  # }
  schedule.update_params({
    :a => 42,
    :b => [1,2,3]
  })
  schedule.params
  # {
  #   "PROCESS_ID"=>"c42c1b82-7d6f-433a-b008-9cdb1d454e01",
  #   "EXECUTABLE"=>"new_main.rb",
  #   :a => 42,
  #   :b=>[1, 2, 3]
  # }
  
  # reschedule
  schedule.reschedule # => 0
  schedule.reschedule = 15
  
  # name
  schedule.name # => "Some Name"
  schedule.name = "Better Name"

  # enable/disable
  schedule.state # => "ENABLED"
  schedule.disable
  schedule.state # => "DISABLED"
  schedule.enable
  schedule.state # => "ENABLED"

  # cron expression
  schedule.cron # => "1 1 1 * *"
  schedule.cron = "1 1 1 1 *"

  # "run after" schedule
  after_schedule = project.schedules('some_id')
  schedule.after = after_schedule

  # Do not foreget to save it
  schedule.save
end
```
