---
id: adding_users_to_project_and_organization_from_csv_file
author: GoodData
sidebar_label: Adding User to Both Organization and Project from CSV
title: Adding User to Both Organization and Project from CSV
---

Goal
-------

You would like to add users from CSV file to a project and domain in one
go. Best practice with automated projects is to add users to domain
(organization) and then to add users from that domain to specific
project(s). This allows you to bypass the invitation process and you can
manipulate users without their consent which is usually what you want in
those cases. Sometimes it could be useful to do this in one go. This is
especially true if you have only one project and one organization.

Before you start
-------------

You have to have a user who is an admin of an organization. If you don’t
have the organization admin account, please contact your primary
GoodData contact person or GoodData support (e-mail
<support@gooddata.com>).

We assume that you have a file with details handy. The file can look for
example like this

    login,first_name,last_name,password,role
    john@example.com,John,Smith,12345678,admin
    john.doe@example.com,John,Doe,87616393,admin

The headers we used are defaults. If you have different ones you will
have to do some mangling (see the recipe Adding user to organization
from CSV file above). Minimal information that you have to provide for
the user creation to be successful is login.

How-to
--------

SDK has a method import\_users that takes care of all the details and
does exactly what is described above. Adds users to domain and then
project.

### Notes

-   Process of adding users is not additive but declarative. What you
    provide on the input is what SDK will strive to have in the project
    at the end. This has some constraints on data preparation but it is
    much more resilient approach.

-   Connected to previous point sometimes you have users that you do not
    want to be touched by this process. ETL developers, admins etc that
    usually do not come from data. You can provide list of whitelist
    expressions as either string or regular expressions. What this means
    is the user that would be added or removed based on the data will be
    ignored by the process. In our example we want to omit user under
    which you are logged in.

-   Be careful that you do not lock yourself (ETL administrator) out of
    the project. Be sure to add the user to the whitelist if they are
    not intrinsically in the data.

-   Note that above data will not work. Currently there is a constraint
    that each user has to have unique login across all users in
    GoodData. It is likely that there already is a `john@example.com`
    somewhere so change the test data accordingly.


```ruby
# encoding: utf-8

require 'gooddata'
require 'active_support/all'

GoodData.with_connection('user', 'password') do |client|
  GoodData.with_project('project_pid') do |project|
    users = []
    CSV.foreach('data.csv', :headers => true, :return_headers => false) do |row|
      users << row.to_hash.symbolize_keys
    end
    domain = client.domain('domain-name') 
    domain.create_users(users)
    project.import_users(users, domain: domain)
  end
end

```
