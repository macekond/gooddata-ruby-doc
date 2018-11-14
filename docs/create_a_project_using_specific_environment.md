---
id: create_a_project_using_specific_environment
author: GoodData
sidebar_label: Creating Empty Project using specific environment.
title: Creating Empty Project using specific environment.
---

Goal
-------

You want to create a project programmatically using specific
environment. The TESTING projects are not backed up and may be discarded
during a platform maintenance.

-   PRODUCTION *(DEFAULT)*

-   DEVELOPMENT

-   TESTING

Note that the environment names are case sensitive.

Solution
--------

    # encoding: utf-8

    require 'gooddata'

    client = GoodData.connect
    project = client.create_project(title: 'My project title', auth_token: 'PROJECT_CREATION_TOKEN', :environment => 'TESTING')

    # after some time the project is created and you can start working with it
    puts project.uri
    puts project.environment # => 'TESTING'
