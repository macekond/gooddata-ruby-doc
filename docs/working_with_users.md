---
id: working_with_users
author: GoodData
sidebar_label: Working with Users
title: Working with Users
---

You have to have a user who is an admin of an organization. If you don’t
have the organization admin account, please contact your primary
GoodData contact person or GoodData support (e-mail
<support@gooddata.com>).

Listing Project’s Users
-------

You can list users in a given project:

```ruby
# encoding: utf-8

require 'gooddata'

GoodData.with_connection('user', 'password') do |client|
  GoodData.with_project('project_pid') do |project|
    pp project.users
    # You might want to see just name and login
    pp project.users.map {|u| [u.login, u.name]}
  end
end 
```

Checking User Membership in Project
-------

You can check whether a user is part of a project.

```ruby
# encoding: utf-8

require 'gooddata'

GoodData.with_connection('user', 'password') do |client|
  GoodData.with_project('project_pid') do |project|
    project.member?('jane.doe@example.com')
  end
end 
```

You can ask on membership not just by login but also check an object.
This might be useful especially if you check a user from several
projects.

Enabling and Disabling Users
-------

You can enable or disable a particular user in a GoodData project.

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

```ruby
# We collect all users minus current user
# so we do not disable ourselves from the project
users_to_disable = project.users.reject { |u| u.login == c.user.login }
# disable all users
users_to_disable.pmap {|u| u.disable}
```

If you want to keep more than one user you can do something like this

```ruby
# We collect all users and remove those from the keepers array
users_to_disable = project.users.reject { |u| keepers.include?(u.login) }
# disable all users
users_to_disable.pmap { |u| u.disable }
```

As you can see from the above examples possibilities are endless and you
can easily enable or disable users just by correctly prepare the array
of users to work with by using regular methods on arrays.


Invite Users from CSV
-------

If you have a CSV file containing users, their roles and passwords, you can create them in a bulk.

```ruby
# encoding: UTF-8

require 'gooddata'

# Project ID
PROJECT_ID = 'we1vvh4il93r0927r809i3agif50d7iz'

GoodData.with_connection do |c|
  GoodData.with_project(PROJECT_ID) do |project|
    path = File.join(File.dirname(__FILE__), '..', 'data', 'users.csv')
    puts "Loading #{path}"
    CSV.foreach(path, :headers => true, :return_headers => false) do |user|
      email = user[0]
      role = user[1]
      project.invite(email, role)
    end
  end
end
```

Inviting Users to Project
-------

You can invite a user into project.

```ruby
# encoding: utf-8

require 'gooddata'

client = GoodData.connect
project = client.projects('project_pid')

project.invite('joe@example.com', 'admin', 'Hey Joe, look at this.')
```

Invitation can be sent by any administrator. Invited user receives
invitation e-mail with invitation confirmation. If you want to add user
into a project without the e-mail and confirmation, please consult the
recipe Adding users to Project.

Listing Organization’s Users
-------

You can list all users in an organization.

```ruby
# encoding: utf-8

require 'gooddata'

# Connect to platform using credentials
client = GoodData.connect

domain = client.domain('domain_name')
users = domain.users
pp users
```

Adding User to Organization
-------

You can add a user to organization programmatically.

```ruby
# encoding: utf-8

require 'gooddata'

client = GoodData.connect

# Get your domain ..
domain = client.domain('domain_name')

# Generate random password
pass = (0...10).map { ('a'..'z').to_a[rand(26)] }.join

new_user = domain.add_user(
  :login => 'new.user@gooddata.com',
  :password => pass,
  :first_name => 'First',
  :last_name => 'Last',
  :email => 'test@gooddata.com',
  :sso_provider => 'some_sso'
)

pp new_user
```

Adding Multiple Users to Organization from CSV
-------

If you have a CSV file containing information about users, you can add them to organization all at once.

We assume that you have a file with details ready. The file can look for
example like this:

    login,first_name,last_name,password
    john@example.com,John,Doe,12345678

The headers we used are defaults. If you have different ones you will
have to do some mangling. Minimal information that you have to provide
for the user creation to be successful is login.

First let’s have a look how to implement an addition with having the
file as in the example above. This has the advantage that you do not
have to mangle with the headers.

```ruby
# encoding: utf-8

require 'gooddata'
require 'active_support/all'

client = GoodData.connect

domain = client.domain('domain-name')
users = []
CSV.foreach('data.csv', :headers => true, :return_headers => false) do |row|
  users << row.to_hash.symbolize_keys
end

domain.create_users(users)
```

Sometimes though what you have is that the file that comes from the system has different headers than would be ideal. One possible thing you can do is to transform it in a separate ETL process or you can change the code slightly to compensate. In the next code snippet we will show you how to do just that.

Imagine you have a file like this

    UserLogin,FirstName,LastName,UserPassword
    john@example.com,John,Doe,12345678

Notice that it is exactly the same information as before. The only
difference is that you have different headers.

This is the code add those users to a domain.

```ruby
# encoding: utf-8

require 'gooddata'

client = GoodData.connect

headers = ["UserLogin", "FirstName", "LastName", "UserPassword"]
new_headers = [:login, :first_name, :last_name, :password]

domain = client.domain('domain-name')
users = []
CSV.foreach('data.csv', :headers => true, :return_headers => false) do |row|
  new_data = new_headers.zip(row.to_hash.values_at(*headers))
  users << Hash[new_data]
end

domain.create_users(users)
```

Notice that the bulk of the code is the same. The only differences are
that we defined `headers` which contain the values of the headers in the
CSV file provided. Variable `new_headers` provide the corresponding
values for those headers that the SDK expects. Take not that the
position is important and the headers for corresponding columns has to
be in the same order in both variables.

The most important line in the code is this

```ruby
new_headers.zip(row.to_hash.values_at(*headers))
```

What it does is it exchanges the keys from `headers` to those defined in
`new_headers`. This code does not return a Hash but array of key value
pairs. This can be turned into a hash with this

```ruby
Hash[*new_data]
```

The rest of the code is the same as in previous example.

Adding User from Organization to Project
-------

You can take users in organization (domain) and add them into a project.

```ruby
require 'gooddata'

GoodData.with_connection do |client|
  # Get your domain ..
  domain = client.domain('domain_name')
  GoodData.with_project('project_id') do |project|
    # Let's get all users except of ourselves
    users_to_add = domain.users.reject { |u| u.login == client.user.login }
    # Let's add all as viewer
    users_to_add.each { |u| project.add_user(u, 'Viewer', domain: domain) }
  end
end
```

Adding Users from Organization to Multiple Projects
-------

You already have all the user profiles created in your organization (domain). If you
have many projects, youcan add those users to them at once.

We assume that you have a file with details which users should be added
to a project. The file has to contain three pieces of information. Who
you would like to add to a project, role that the user should take on in
that project and which project he should be added to. The headers we
used are defaults. If you have different ones you will have to do some
mangling. Example of how to do that can be found in recipe
adding\_users\_to\_domain.

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

Adding User to Both Organization and Project from CSV
-------

You can add users from CSV file to a project and domain in one
go. Best practice with automated projects is to add users to domain
(organization) and then to add users from that domain to specific
project(s). This allows you to bypass the invitation process and you can
manipulate users without their consent which is usually what you want in
those cases. Sometimes it could be useful to do this in one go. This is
especially true if you have only one project and one organization.

We assume that you have a file with details handy. The file can look for
example like this

    login,first_name,last_name,password,role
    john@example.com,John,Smith,12345678,admin
    john.doe@example.com,John,Doe,87616393,admin

The headers we used are defaults. If you have different ones you will
have to do some mangling (see the recipe Adding user to organization
from CSV file above). Minimal information that you have to provide for
the user creation to be successful is login.

The SDK has a method import\_users that takes care of all the details and
does exactly what is described above. Adds users to domain and then
project.

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

Updating a User in Organization
-------

Some of the users in your organization might have incorrect or
outdated information and need update.

Here we are updating an sso provider but you can update almost any
property of a user.

```ruby
# encoding: utf-8

require 'gooddata'

client = GoodData.connect
domain = client.domain 'organization_name'
u = domain.find_user_by_login('john@gooddata.com')
u.sso_provider = 'a_provider'
domain.update_user(u)
```

Creating Groups
-------

There is a concept of group in GoodData. Member of a group can be either
another group or directly a user. Here we are going to create a group
and assign it some users.

```ruby
# encoding: utf-8

require 'gooddata'

GoodData.with_connection do |client|
  client.with_project('project') do |p|
    group_1 = p.add_user_group(name: 'east')
    group_1.add_members(p.member('john.doe@gooddata.com'))
    pp group_1.members.map(&:uri)
    # ['/gdc/account/profile/4e1e8cacc4989228e0ae531b30853248']

    group_1.member?('/gdc/account/profile/4e1e8cacc4989228e0ae531b30853248')
    # => true
  end
end
```

Deleting Users from All projects
-------

This script should remove user from all projects. There are couple of
things you need to keep in mind though.

-   This deletes user only from projects where you have access to

-   If you are not admin in particular project the user will not be
    deleted from that particular project


```ruby
# encoding: utf-8

require 'gooddata'

login = 'john.doe@gooddata.com'

# Connect to platform using credentials
GoodData.with_connection do |client|
  # first select only projects where you are admin
  # which means you can read users and disable them
  projects = client.projects.pselect(&:am_i_admin?)
  projects.peach do |project|
    project.member(login).disable
  end
end
```
