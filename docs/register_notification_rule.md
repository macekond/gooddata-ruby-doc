---
id: register_notification_rule
author: GoodData
sidebar_label: Registering a notification email
title: Registering a notification email
---

Goal
-------

When executing a process, obtaining up-to-date information about the
status is difficult.

Solution
--------

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
  client.user.channels.each do |channel|
    channel.to = 'another email'
    channel.save
    channel.delete
  end
end 

```

You can also list all notification rules of a process and re-configure
or delete the existing notification rule

&lt;%= render\_ruby
'src/07\_deployment\_recipes/modify\_notification\_rule.rb' %&gt;

When registering a notification rule, GoodData will automatically create
a channel for each email target if it’s not exist. You can manually
create a channel

&lt;%= render\_ruby
'src/07\_deployment\_recipes/channel\_configuration\_1.rb' %&gt;

You can list all channels, re-configure or delete the existing channel

&lt;%= render\_ruby
'src/07\_deployment\_recipes/channel\_configuration\_2.rb' %&gt;
