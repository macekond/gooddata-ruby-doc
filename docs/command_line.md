---
id: command_line 
author: GoodData
sidebar_label: Command line functionality
title: Command line functionality
---


Goal
-------

You would like to easily authenticate to the GoodData API and make a couple of requests

Preamble
-------

The bash tool `jq` is leveraged to parse JSON data in this example. The documentation is available online, at https://stedolan.github.io/jq/

How-to authenticate
--------

There are two principal ways to authenticate - either pass the credentials and server settings with each call as command line parameters:

`gooddata -U username -P password -s https://custom-domain.gooddata.com api get /gdc/md`

Notice how the named parameters are between `gooddata` and the command `api get`

A complete list of the available command line parameters is available by running `gooddata --help`

The other, preferred way to authenticate is to run the authentication wizard, which will store your credentials and server settings at `~/.gooddata`

`gooddata auth store`

After that, making requests is as simple as

`gooddata api get /gdc/md`

Generic API requests
-------

The CL tool currently knows how to make GET, POST and DELETE requests.

GET and DELETE are both straightforward:

`gooddata api get /gdc/md`
`gooddata api delete /gdc/projects/project_id`

POST usually requires a payload, which you should save as a JSON into a file and feed it as a parameter to the CL tool:

`echo '{"name": "gd_ruby_cmd_test", "type" : "etl","component": {"name": "gdc-etl-sql-executor", "version":"1"}}' > process.json`
`gooddata api post /gdc/dataload_path/ process.json`

In case the payload is empty, no parameter needs to be passed

`gooddata api post /gdc/projects/project_id/execute`

Creating a project
-------

To create a project, you will need an Authorization (Project) Token. You can either enter it when using the authentication wizard, or pass it as a command line parameter `-t MYPROJECTTOKEN`

Creating a project is as simple as

`gooddata project create`

You can easily use the new project right away and chain multiple calls to the API using the command line tool and `bash` and `jq`. This line will create a new project and then fetch its featureFlags.

`gooddata api get $(gooddata project create | jq -r '.project.links.projectFeatureFlags') | jq`


Creating a process
-------

To create a process, you'll need a GoodData Project (Workspace) ID.

There are three ways to deploy a process. The first way is to deploy a script that has been uploaded to your GoodData WebDAV directory by passing the script path. This works for Ruby scripts as well as CloudConnect graphs.

`gooddata -p project_id process create from_path ./path/to/script | jq`

The second way is to use a deploy string, which refers to an object in the GoodData Appstore (see https://help.gooddata.com/display/doc/Managing+Projects+via+Appstore+Bricks for more details). For example, this is how you would deploy the latest users brick.

`gooddata -p project_id process create from_path '${PUBLIC_APPSTORE}:tag/3.5.0:/apps/users_brick'`

The third (and most optimal) way is to deploy GoodData Components. The Components are a part of the platform and are managed by GoodData teams, ensuring better cohesion and code quality than custom ETL or LCM scripts.

For example, this is how you would deploy an ETL SQL executor. You'll have to construct the JSON payload yourself, store it in a file and pass it to the Ruby SDK CL tool, as the components often require additional parameters (see their specific documentation for more info).

`echo '{"name": "gd_ruby_cmd_test", "type" : "etl","component": {"name": "gdc-etl-sql-executor", "version":"1"}}' > process.json`
`gooddata -p project_id process create as_component process.json`

