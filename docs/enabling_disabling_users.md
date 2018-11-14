---
id: enabling_disabling_users
author: GoodData
sidebar_label: Enabling and Disabling Users
title: Enabling and Disabling Users
---

Problem
-------

You need to enable or disable users in a project.

Prerequisites
-------------

You have to have a user who is an admin in a project you would like to
disable users in.

Solution
--------

Disable and enable particular user in GoodData project


```ruby
# encoding: utf-8

require 'gooddata'

# Connect to platform using credentials
GoodData.with_connection do |c|
  GoodData.with_project('project_pid') do |project|
    keepers = ['john@example.com', c.user.login]
    # We collect all users and remove those from the keepers array
    users_to_disable = project.users.reject { |u| keepers.include?(u.login) }
    # disable all users
    users_to_disable.pmap { |u| u.disable }
  end
end
```

Disable all users in GoodData project

&lt;%= render\_ruby
'src/02\_working\_with\_users/enable\_disable\_all.rb' %&gt;

If you want to keep more than one user you can do something like this

&lt;%= render\_ruby
'src/02\_working\_with\_users/enable\_disable\_all\_except\_some.rb'
%&gt;

Discussion
----------

As you can see from the above examples possibilities are endless and you
can easily enable or disable users just by correctly prepare the array
of users to work with by using regular methods on arrays.
