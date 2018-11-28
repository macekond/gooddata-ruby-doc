---
id: working_with_deployments
author: GoodData
sidebar_label: Deployment How-tos
title: Deployment How-tos
---

Deploying Process
------

You can deploy a CloudConnect or Ruby SDK process to the GoodData platform.

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

Redeploying Existing Process
------

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

Scheduling Process
------

You have a process deployed and you would like to add a schedule to it
so the process is executed regularly

You can easily add a time based schedule to any process. Scheduled
process execution has couple advantages over the ad-hoc process
executions. Scheduled executions are logged and logs are kept around for
some time (~10 days). Also schedule keeps list of parameters so you
create it once and you do not need to care about them anymore.


```ruby
# encoding: utf-8

require 'gooddata'

GoodData.with_connection do |client|
  GoodData.with_project('project_id') do |project|
    process = project.deploy_process('./path/to_cloud_connect_directory', name: 'Test ETL Process')
    process.create_schedule('0 15 * * *', 'graph/my_graph.grf',
      params: {
        param_1: 'a',
        param_2: 'b'
      },
      hidden_params: {
        hidden_param_1: 'a',
        hidden_param_2: 'b'
      }
    )
  end
end
```

### Working with JSON

In many examples in the Appstore, the parameters are specified in JSON.
JSON is language agnostic that is very similar to Ruby format of
representing data but it is not exactly the same. Since here we are
working in Ruby we present a short example how to convert JSON to Ruby
automatically.

Let’s assume we have some JSON parameters that look like this

```json
{
  "param_1" : {
    "deeper_key" : "value_1"
  },
  "param_2" : "value_2"
}
```

We first need to store this in a string and then use one of the ruby
libraries to convert this to the equivalent on Ruby language. Typically
there are problems with the quotes since in many language a string
literal is defined with " and thus the JSON need to be escaped. Another
problem might be caused with the fact that JSON is typically on multiple
lines (as in our example). We use one of the lesser known features of
ruby called HEREDOC to help us. It is basically a way to define a string
that is potentially on multiple lines without worrying about escaping.

```ruby
data = <<JSON_DATA
{
  "param_1" : {
    "deeper_key" : "value_1"
  },
  "param_2" : "value_2"
}
JSON_DATA


# Note that <<JSON_DATA and JSON_DATA marks the beginning and the end of the string. Once we have the JSON string defined we can use JSON libraries to convert it. Here we are using MultiJson which is part fo the Ruby SDK.

params = MultiJson.load(data)
=> {"param_1"=>{"deeper_key"=>"value_1"}, "param_2"=>"value_2"}
```

Then we can use it as in the example above


Disabling Schedules in All Projects
------

You can disable all schedules on all processes on all the
projects you have access to and have sufficient privileges to do so.


```ruby
# encoding: utf-8

require 'gooddata'

client = GoodData.connect
GoodData.with_connection do |client|
  schedules = client.projects.pselect(&:am_i_admin?).pmapcat(&:schedules)
  schedules.pmap do |schedule|
    schedule.disable
    schedule.save
  end
end
```


Executing Schedule
------

If you have a process with a schedule, you would perhaps like to execute it out of
schedule.

Since schedule already have information about executable and parameters
stored it is very easy. You just need to find the schedule and execute
it.

```ruby
# encoding: utf-8

require 'gooddata'

GoodData.with_connection do |client|
  project = GoodData.use('project_id')
  project.processes.first.schedules.first.execute
end
```

Executing Process
------

You can execute a process without a schedule.

SDK allows you to execute a process. This is not something that you
should do regularly since you have to specify the parameters during
execution and logs are not kept for individual executions but it might
be occasionally useful.


```ruby
# encoding: utf-8

require 'gooddata'

GoodData.with_connection do |client|
  GoodData.with_project('project_id') do |project|
    project = GoodData.use('project_id')
    process = project.processes.find { |p| p.name == 'Test ETL Process' }
    process.execute('graph/my_graph.grf', params: { param1: 'a', param2: 'b' })
  end
end 
```

There are also couple of other useful tricks. You might execute
arbitrary process that is already deployed. You just need to get the
process by its id.

```ruby
# encoding: utf-8

require 'gooddata'

GoodData.with_connection do |client|
  GoodData.with_project('project_id') do |project|
    process = project.processes('6a75759f-2a76-49c8-af18-ad3bc58fc65e')
    process.execute('graph/my_graph.grf', params: { param1: 'a', param2: 'b' })
  end
end
```

Or you can get a process by it’s name too.

# encoding: utf-8

```ruby
require 'gooddata'

GoodData.with_connection do |client|
  GoodData.with_project('project_id') do |project|
    project = GoodData.use('project_id')
    process = project.processes.find { |p| p.name == 'Test ETL Process' }
    process.execute('graph/my_graph.grf', params: { param1: 'a', param2: 'b' })
  end
end
```

If you do not know what the executable is you can look it up by using
`process.executables`. We recommend using the same for all processes
like `main.grf` (for CloudConnect) or `main.rb`.


Run-After Scheduling
------

You can schedule a process to run upon successful completion of
another process (schedule). This is also known as run-after triggered
schedule.

If you use an existing schedule object instead of a cron expression in
the create\_schedule method, the scheduled process will be scheduled to
execute upon successful completion of the passed schedule.

```ruby
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
```

Changing an existing schedule
------

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

Investigating Executions
------

If you have a large amount of projects and would like to investigate their
execution, the administration UI is not necessarily helpful as its
overview UI can hide some failures, there is too much too go through by
hand etc.

Let’s have a look at couple of scenarios. First let’s investigate
executions inside one project regardless of which schedule it was
triggered by. Let’s assume first that we are just looking for any
executions that failed for that particular project. We will print the
date when it happened sorted in ascending order.

```ruby
# encoding: utf-8

require 'gooddata'

GoodData.with_connection do |client|
  GoodData.with_project('project_id') do |project|
    results = project.schedules
                     .pmapcat { |s| s.executions.to_a }  # take all their executions (execute in parallel since this goes to API)
                     .select(&:error?) # select only those that failed
    pp results.map(&:started).sort.uniq
  end
end
```

Now imagine that you are looking for executions executed by a particular
schedule.

```ruby
# encoding: utf-8

require 'gooddata'

GoodData.with_connection do |client|
  GoodData.with_project('project_id') do |project|
    results = project.schedules
                     .select { |s| s.name == 'user_filters_schedule' } # filter on those that have particular name
                     .pmapcat { |s| s.executions.to_a } # take all their executions (execute in parallel since this goes to API)
                     .select(&:error?) # select only those that failed
    pp results.map(&:started).sort.uniq
  end
end
```

Lets' make it even more specific and let’s look for a specific term in
the error message. Let’s say that "unsynchronized" is the word we are
looking for.

```ruby
# encoding: utf-8

require 'gooddata'

GoodData.with_connection do |client|
  GoodData.with_project('project_id') do |project|
    results = project.schedules
                     .select { |s| s.name == 'user_filters_schedule' } # filter on those that have particular name
                     .pmapcat { |s| s.executions.to_a } # take all their executions (execute in parallel since this goes to API)
                     .select(&:error?) # select only those that failed
                     .select { |e| e.json['execution']['error']['message'] =~ /unsynchronized/ } # select those that contain particular message in error message
    pp results.map(&:started).sort.uniq
  end
end
```

Sometimes the error does not manifest itself in the error message
directly and you need to look into logs. Take note that in both last
cases we are getting the log and the error message as a string so you
have full power of ruby to process it. Here we are using regular
expressions which by itself gives you significant power but you can go
even deeper if you need.

```ruby
# encoding: utf-8

require 'gooddata'

GoodData.with_connection do |client|
  GoodData.with_project('project_id') do |project|
    results = project.schedules
                     .select { |s| s.name == 'user_filters_schedule' } # filter on those that have particular name
                     .pmapcat { |s| s.executions.to_a } # take all their executions (execute in parallel since this goes to API)
                     .select(&:error?) # select only those that failed
                     .select { |e| e.log =~ /unsynchronized/ } # select those that contain particular message in log
    pp results.map(&:started).sort.uniq
  end
end
```

Last example we will show is just a small extension. Imagine you would
like to perform the same analysis on all projects in your account. This
is usually the case since these type of analysis executions become
exponentially more useful with growing number of executions or projects
you need to investigate.

```ruby
# encoding: utf-8

require 'gooddata'

GoodData.with_connection do |client|
    results = client.projects # take all projects
                    .pmapcat(&:schedules) # take all their schedules (execute in parallel since this goes to API)
                    .select { |s| s.name == 'user_filters_schedule' } # filter on those that have particular name
                    .pmapcat { |s| s.executions.to_a } # take all their executions (execute in parallel since this goes to API)
                    .select(&:error?) # select only those that failed
                    .select { |e| e.log =~ /unsynchronized/ } # select those that contain particular message in log
    pp results.map(&:started).sort.uniq
end
```

Visualizing executions
------

You successfully modularized your ETL into several orchestrated modules.
The problem is that it is hard to visualize the order of execution from
the Data Administration console.

There are plethora of very useful libraries that you can use in
conjunction with GoodData SDK. One of those is Graphviz that is a C
library but it has bindings to almost every language including Ruby.
Graphviz is a visualization library and one of the features allows
visualization of Direct Acyclic Graphs which is exactly what an
execution of several schedules basically is.

As a prerequisite you must install both
[Graphviz](http://www.graphviz.org/) and [Graphviz ruby
bindings](https://github.com/glejeune/Ruby-Graphviz). This is user
dependent as installation is different for every platform. If you
encounter any errors try googling them or shoot us a message on GitHub
or support.

```ruby
# encoding: utf-8

require 'gooddata'
require 'graphviz'

PROJECT_ID = 'PROJECT_ID' # fill_in

GoodData.with_connection do |client|
  GoodData.with_project(PROJECT_ID) do |project|
    schedules = project.schedules

    nodes = project.processes.pmapcat { |p| p.schedules.map { |s| [s, "#{p.name}-#{s.name}"] } }
    edges = schedules.reject(&:time_based?).pmap {|s| ["#{s.after.process.name}-#{s.after.name}", "#{s.process.name}-#{s.name}"]}


    g = GraphViz.new(:G, :type => :digraph , :rankdir => 'TB')
    nodes.each { |s, n|
      node = g.add_nodes(n)
      node[:shape] = 'box'
      node[:label] = n + "\n#{s.cron}"
    }

    edges.each { |a, b| g.add_edges(a, b) }
    g.output(:png => "run_dag.png")

    # Now you can open it for example on mac by running this on terminal
    # open -a Preview run_dag.png
  end
end
```

Registering a notification email
------

Register a notification rule on a process. You can configure
notification rules to send an email whenever the defined conditions are
met.

The basic events are: GoodData::Subscription::PROCESS\_SUCCESS\_EVENT,
GoodData::Subscription::PROCESS\_FAILED\_EVENT,
GoodData::Subscription::PROCESS\_SCHEDULED\_EVENT,
GoodData::Subscription::PROCESS\_STARTED\_EVENT. If you need to define
your own special event, visit [creating custom notification
events](https://developer.gooddata.com/article/creating-custom-notification-events)

You can also add special variables to provide more information in the
email. These can be used in the subject or email body.

```ruby
# encoding: utf-8

require 'gooddata'

GoodData.with_connection do |client|
  GoodData.with_project('project_id') do |project|
    process = project.deploy_process('./path/to_cloud_connect_directory', name: 'Test ETL Process')

    process.create_notification_rule(
      email: 'email you need to get the info',
      subject: 'Get info from project ${params.PROJECT}',
      body: 'This is a log for process ${params.PROCESS_NAME} [${params.PROCESS_ID}]: ${params.LOG}',
      events: GoodData::Subscription::PROCESS_FAILED_EVENT
    )
  end
end
```

You can also list all notification rules of a process and re-configure
or delete the existing notification rule

```ruby
# encoding: utf-8

require 'gooddata'

GoodData.with_connection do |client|
  GoodData.with_project('project_id') do |project|
    project.processes.each do |process|
      process.notification_rules.each do |rule|
        rule.subject = 'Changed subject'
        rule.save
        rule.delete
      end
    end
  end
end
```

When registering a notification rule, GoodData will automatically create
a channel for each email target if it’s not exist. You can manually
create a channel

```ruby
# encoding: utf-8

require 'gooddata'

GoodData.with_connection do |client|
  client.user.create_channel
end
```

You can list all channels, re-configure or delete the existing channel

```ruby
# encoding: utf-8

require 'gooddata'

GoodData.with_connection do |client|
  client.user.channels.each do |channel|
    channel.to = 'another email'
    channel.save
    channel.delete
  end
end 
```

Automated Data Distribution (ADD)
------

You might want to upload data from the Data Warehouse to a workspace.

You must have the output stage associated with the workspace you need to upload data to. An ADD process is created after associating the workspace with the output stage.

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