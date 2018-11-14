---
id: adding_users_to_project_from_domain
author: GoodData
sidebar_label: Adding Users from Organization to Multiple Projects
title: Adding Users from Organization to Multiple Projects
---

Problem
-------

You would like to add a users to project programmatically. You already
have all the user profiles created in your organization (domain). You
potentially have many projects that you would like to populate.

Prerequisites
-------------

You have to have a user who is an admin of an organization. If you don’t
have the organization admin account, please contact your primary
GoodData contact person or GoodData support (e-mail
<support@gooddata.com>). You have an organization populated with user.
If you don’t take a look at the recipe above (Adding user to
organization)

We assume that you have a file with details which users should be added
to a project. The file has to contain three pieces of information. Who
you would like to add to a project, role that the user should take on in
that project and which project he should be added to. The headers we
used are defaults. If you have different ones you will have to do some
mangling. Example of how to do that can be found in recipe
adding\_users\_to\_domain.

Solution
--------

Sometimes the case might be that you would like to add users to a slew
of projects in one go. Let’s illustrate this on one example. Let’s
imagine that you have a file like this

    pid,login,role
    asl50ejow6bzp97i9pxlbcm3vkuvzQ72,john@example.com,admin


```ruby
# encoding: utf-8

require 'gooddata'
require 'active_support/all'

GoodData.with_connection('user', 'password') do |client|
  domain = client.domain('domain-name')
  users = []
  CSV.foreach('data.csv', :headers => true, :return_headers => false) do |row|
    users << row.to_hash.symbolize_keys.slice(:pid, :login, :role)
  end
  users.group_by {|u| u[:pid]}.map do |project_id, users|
    GoodData.with_project(project_id) do |project|
      project.import_users(users, domain: domain, whitelists: ["svarovsky@gooddata.com"])
    end
  end
end
```

This reads the users, groups them according to a project and then adds
them to the project. It reads all the users into memory. This should be
OK for typical situations of thousands users. Note that we are not
getting a project dynamically for each group of users. All the notes for
whitelist apply as well.
