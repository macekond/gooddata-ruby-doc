---
id: run_after_schedule
author: GoodData
sidebar_label: Run-After Scheduling
title: Run-After Scheduling
---

Goal
-------

You want to schedule a process to run upon successful completion of
another process (schedule). This is also known as run-after triggered
schedule.

Example
--------

If you use an existing schedule object instead of a cron expression in
the create\_schedule method, the scheduled process will be scheduled to
execute upon successful completion of the passed schedule.

    # encoding: utf-8

    require 'gooddata'

    GoodData.with_connection do |client|
      GoodData.with_project('project_id') do |project|
        process = project.deploy_process('./path/to_parent_cloud_connect_directory', name: 'Parent Process')
        parent_schedule = process.create_schedule('0 15 * * *', 'graph/parent_graph.grf', params: { param1: 'a', param2: 'b' })
        # The after_process will run after the parent_schedule successfully finishes
        process = project.deploy_process('./path/to_after_cloud_connect_directory', name: 'After Process')
        # Note passing the parent_schedule instead of a cron expression
        process.create_schedule(parent_schedule, 'graph/after_graph.grf', params: { param1: 'a', param2: 'b' })
      end
    end
