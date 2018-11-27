---
id: working_with_projects
author: GoodData
sidebar_label: Working with Projects
title: Working with Projects
---

Creating Empty Project
-------

If you need to create a project programmatically:


```ruby
# encoding: utf-8

require 'gooddata'

client = GoodData.connect
project = client.create_project(title: 'My project title', auth_token: 'PROJECT_CREATION_TOKEN')

# after some time the project is created and you can start working with it
puts project.uri
puts project.title # => 'My project title'
```

Renaming Project
-------

If you need to rename the project:

```ruby
require 'gooddata'

client = GoodData.connect
project = client.projects('project_id')
project.title = "New and much better title"
project.save
```

Cloning Project
-------

You can create an exact copy of en existing project:

```ruby
# encoding: utf-8

require 'gooddata'

client = GoodData.connect
project = client.projects('project_pid')
cloned_project = project.clone(title: 'New title',
                               auth_token: 'token',
                               users: false,
                               data: true,
                               exclude_schedules: true,
                               cross_data_center_export: true)
```

There are four options that you can specify. You can pick if you want to
clone just metadata (e.g. attributes, facts, metrics reports, dashboards
etc.) or also data (this is default). Also you can choose if you want to
transfer all old project’s users to the new project. No users are
transferred by default. In the example above we explicitly specified the
*users* and *data* optional parameters so you can see how it works.
Setting the exclude\_schedules to true causes scheduled emails to be
omitted from the transfer. The cross\_data\_center\_export specifies
whether the export can be used in any data center.


Cloning Project across Organizations
-------

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

The options for `Project#export_clone` are the same as for
`Project#clone` with a couple additions. You can specify which users
will be able to import the package using the `authorized_users` option.
If you want to use the export in another data-center, set
`cross_data_center_export` to true.

You can also leverage this more granular interface when you need to
clone one project to multiple target projects.

Creating Empty Project using specific environment
-------

You can create a project programmatically using specific environment. The TESTING 
projects are not backed up and may be discarded during a platform maintenance.

-   PRODUCTION *(DEFAULT)*

-   DEVELOPMENT

-   TESTING

Note that the environment names are case sensitive.

```ruby
# encoding: utf-8

require 'gooddata'

client = GoodData.connect
project = client.create_project(title: 'My project title', auth_token: 'PROJECT_CREATION_TOKEN', :environment => 'TESTING')

# after some time the project is created and you can start working with it
puts project.uri
puts project.environment # => 'TESTING'
```

Creating Project from Template
-------

You have a template created for you and you would like to spin a project
from this template.

```ruby
# encoding: utf-8

require 'gooddata'

client = GoodData.connect
project = client.create_project(title: 'New project',
                                template: '/projectTemplates/SuperSoda/1/',
                                auth_token: 'token')
```

Note that people behind SDK do not endorse usage of templates so
consider it being here for legacy purposes.

Migrating objects between projects
-------

If you have metadata objects (reports/metrics/dashboards) you can transfer them between projects:

```ruby
# encoding: UTF-8

require 'gooddata'

GoodData.with_connection do |c|
  target_project = c.projects('target_project_id')

  # Lets log into project you would like to transfer from
  GoodData.with_project('master_project_id') do |master_project|
    # find objects you would like to transfer
    # here we transfer all reports containing word "sales" in the title
    reports = master_project.reports.select { |r| r.title =~ /sales/ }
    begin
      master_project.transfer_objects(reports, project: target_project)
    rescue ObjectsMigrationError
      puts 'Object transfer failed'
    end
  end
end
```

Occasionally you need to transfer objects to multiple projects. To make it easier SDK provides a convenient method for this.

```ruby
# encoding: UTF-8

require 'gooddata'

GoodData.with_connection do |c|
  target_project_1 = c.projects('target_project_id_1')
  target_project_2 = c.projects('target_project_id_2')

  # Lets log into project you would like to transfer from
  GoodData.with_project('master_project_id') do |master_project|
    # find objects you would like to transfer
    # here we transfer all reports containing word "sales" in the title
    reports = master_project.reports.select { |r| r.title =~ /sales/ }
    result = master_project.transfer_objects(reports, project: [target_project_1, target_project_2])

    # If you provided an array of projects the method will not throw an exception on failed
    # imports. It returns an array of results an you have to investigate to know what is up.
    # The shape of results is in shape
    # {
    #   project: target_project,
    #   result: true
    # }
    puts "#{result.select {|r| r[:result] }.count} projects succeeded"
    puts "#{result.reject {|r| r[:result] }.count} projects failed"
  end
end
```

Objects import happen in two stages. First you export objects with an API call. This creates a package on our platform and provides you with a token. You can then use the token to initiate the import. In most cases you do not care about these details and 2 methods above are all what you need. In some cases though you want the low level control. Here is a quick example how to use those lower level methods.


```ruby
# encoding: UTF-8

require 'gooddata'

GoodData.with_connection do |c|
  target_project = c.projects('target_project_id')

  # Lets log into project you would like to transfer from
  GoodData.with_project('master_project_id') do |master_project|
    # find objects you would like to transfer
    # here we transfer all reports containing word "sales" in the title
    reports = master_project.reports.select { |r| r.title =~ /sales/ }
    begin
      token = master_project.objects_export(reports)
    rescue ObjectsExportError
      puts "Export failed"
    end
    begin
      target_project.objects_import(token)
    rescue ObjectsImportError
      puts "Import failed"
    end
  end
end
```

Deleting a Project
-------

You can delete a project programmatically:

```ruby
# encoding: utf-8

require 'gooddata'

GoodData.with_connection do |c|
  GoodData.with_project('project_pid') do |project|
    project.delete
  end
end 
```

Listing Roles
-------

You can list the roles you have available in your project:

```ruby
# encoding: utf-8

require 'gooddata'

GoodData.with_connection do |c|
  GoodData.with_project('project_pid') do |project|
    # Usually what is useful is to see the titles
    pp project.roles.map(&:title)
    # But occassionally you need identifiers and urls as well
    pp project.roles.map(&:identifier)
    pp project.roles.map(&:uri)
  end
end 
```

Setting and Updating Project Metadata Storage
-------

You can use project metadata storage to store some additional information.

Each project has a small API that allows to set some values in a simple
key value manner. This is usually used for storing some information that
do not fit into the data.


```ruby
require 'gooddata'

client = GoodData.connect
project = client.projects('project_id')

# You can set some metadata
p.set_metadata('key', 'value')

# You can access the project metadata in two ways
# 
# First is to get specific key directly
p.metadata('key')
# => 'value
# In case you try to access a nonexisting key you will get 404

# Second is to access all metadata. This will return them as a Hash which you can access as usual
m = p.metadata
# => {"key"=>"value"}
m['key']
# => "value"
```

Create custom color palette
-------

You can create a set of color palette to decorate your reports.

Create custom color palette with your color definitions. You can reset
your project to use the default color palette if needed.


```ruby
# encoding: utf-8

require 'gooddata'

GoodData.with_connection do |client|
  GoodData.with_project('project_id') do |project|
    colors = [
      { r: 25, g: 36, b: 48 },
      { r: 33, g: 36, b: 64 },
      { r: 42, g: 61, b: 81 }
    ]

    project.create_custom_color_palette(colors)

    # get the current color palette
    current_color_palette = project.current_color_palette.colors

    project.reset_color_palette
  end
end
```

Looking up Metadata Objects
-------

If you need to retrieve metadata objects (e.g. metrics, facts,
labels) by numeric ID, string identifier or URI, use `GoodData::MdObject#[]` to 
look up your metadata objects. This method is aliased `#get_by_id`.

```ruby
options = { project: project, client: client }
id = metric.obj_id
# => "2258"
GoodData::MdObject[id, options].class
# => GoodData::Metric

identifier = metric.identifier
# => "metric.total.claim.amount"
GoodData::MdObject[identifier, options].class
# => GoodData::Metric

uri = metric.uri
# => "/gdc/md/zlf5mgyd1txaztohukv8xwv1jjm28zvg/obj/2258"
GoodData::MdObject[uri, options].class
# => GoodData::Metric
```
