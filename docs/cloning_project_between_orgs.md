---
id: cloning_project_between_orgs
author: GoodData
sidebar_label: Cloning Project across Organizations
title: Cloning Project across Organizations
---

Problem
-------

You would like to clone project to a different organization

Solution
--------

Usually you would be happy using `project.clone` but sometimes you need
more granularity in controlling who is doing what. In this recipe we are
going to explain what is happening when you clone a project and how you
can leverage the lower level API.

When the project clone is done SDK actually orchestrates couple of calls
together

1.  Exports a project, obtaining an export package token. The token is a
    pointer to a package that is stored at GoodData premises.

2.  Creates an empty project

3.  Imports the package (from step 1) into a freshly created project
    from step 2

All these 3 calls are asynchronous by default. SDK makes sure that
things happen in the correct order and exposes it as synchronous
operation.

Sometimes more granular things are need for example when you need to
clone a project to different organization. This means that clone would
not work since you cannot have one user in 2 organizations. We decided
to expose the methods to allow you doing the three steps above so anyone
can mix and match.


```ruby
# encoding: utf-8

require 'gooddata'

user_from_login = 'john@example.com'
user_to_login = 'jane@example.com'

client_from = GoodData.connect(user_from_login, 'password', server: 'https://customer_1_domain.gooddata.com')
client_to = GoodData.connect(user_to_login, 'password', server: 'https://customer_2_domain.gooddata.com')

from_project = client_from.projects('project_pid_1')
to_project = client_to.create_project(:title => "project_title", :auth_token => "TOKEN")

export_token = from_project.export_clone(authorized_users: [user_to_login],
                                         data: true,
                                         exclude_schedules: true,
                                         cross_data_center_export: true)
to_project.import_clone(export_token)
```

Discussion
----------

The options for `Project#export_clone` are the same as for
`Project#clone` with a couple additions. You can specify which users
will be able to import the package using the `authorized_users` option.
If you want to use the export in another data-center, set
`cross_data_center_export` to true.

You can also leverage this more granular interface when you need to
clone one project to multiple target projects.
