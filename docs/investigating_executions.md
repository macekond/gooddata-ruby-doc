---
id: investigating_executions
author: GoodData
sidebar_label: Investigating Executions
title: Investigating Executions
---

Problem
-------

You have large amount of projects and would like to investigate their
execution. The administration UI is not necessarily helpful as its
overview UI can hide some failures, there is too much too go through by
hand etc.

Solution
--------

Let’s have a look at couple of scenarios. First let’s investigate
executions inside one project regardless of which schedule it was
triggered by. Let’s assume first that we are just looking for any
executions that failed for that particular project. We will print the
date when it happened sorted in ascending order.


```ruby
# encoding: utf-8

require 'gooddata'


```ruby
# encoding: utf-8

require 'gooddata'

GoodData.with_connection do |client|

```ruby
# encoding: utf-8

require 'gooddata'

GoodData.with_connection do |client|
    results = client.projects # take all projects
                    .pmapcat(&:schedules) # take all their schedules (execute in parallel since this goes to API)
                    .select { |s| s.name == 'user_filters_schedule' } # filter on those that have particular name

```ruby
# encoding: utf-8

require 'gooddata'

GoodData.with_connection do |client|
    results = client.projects # take all projects
                    .pmapcat(&:schedules) # take all their schedules (execute in parallel since this goes to API)

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
                    .select(&:error?) # select only those that failed
                    .select { |e| e.log =~ /unsynchronized/ } # select those that contain particular message in log
    pp results.map(&:started).sort.uniq
end
```
                    .select { |e| e.log =~ /unsynchronized/ } # select those that contain particular message in log
    pp results.map(&:started).sort.uniq
end
```
                    .select { |s| s.name == 'user_filters_schedule' } # filter on those that have particular name
                    .pmapcat { |s| s.executions.to_a } # take all their executions (execute in parallel since this goes to API)
                    .select(&:error?) # select only those that failed
                    .select { |e| e.log =~ /unsynchronized/ } # select those that contain particular message in log
    pp results.map(&:started).sort.uniq
end
```
                    .pmapcat(&:schedules) # take all their schedules (execute in parallel since this goes to API)
                    .select { |s| s.name == 'user_filters_schedule' } # filter on those that have particular name
                    .pmapcat { |s| s.executions.to_a } # take all their executions (execute in parallel since this goes to API)
                    .select(&:error?) # select only those that failed
                    .select { |e| e.log =~ /unsynchronized/ } # select those that contain particular message in log
    pp results.map(&:started).sort.uniq
end
```

Now imagine that you are looking for executions executed by a particular
schedule.

&lt;%= render\_ruby
'src/07\_deployment\_recipes/schedule\_investigation\_2.rb' %&gt;

Lets' make it even more specific and let’s look for a specific term in
the error message. Let’s say that "unsynchronized" is the word we are
looking for.

&lt;%= render\_ruby
'src/07\_deployment\_recipes/schedule\_investigation\_3.rb' %&gt;

Sometimes the error does not manifest itself in the error message
directly and you need to look into logs. Take note that in both last
cases we are getting the log and the error message as a string so you
have full power of ruby to process it. Here we are using regular
expressions which by itself gives you significant power but you can go
even deeper if you need.

&lt;%= render\_ruby
'src/07\_deployment\_recipes/schedule\_investigation\_4.rb' %&gt;

Last example we will show is just a small extension. Imagine you would
like to perform the same analysis on all projects in your account. This
is usually the case since these type of analysis executions become
exponentially more useful with growing number of executions or projects
you need to investigate.

&lt;%= render\_ruby
'src/07\_deployment\_recipes/schedule\_investigation\_5.rb' %&gt;
