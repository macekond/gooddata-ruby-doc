---
id: jack_in
author: GoodData
sidebar_label: Working with Project Interactively
title: Working with Project Interactively
---

Problem
-------

You want to use SDK on a project but writing a script seems like too
much of a hassle.

Solution
--------

You first need to install gooddata gem using

    gem install gooddata

There are several methods by which you can work with the GoodData Ruby
SDK. Let’s look at the major ones.

### IRB

IRB is an interactive console that is provided with your Ruby
installation. You may use gooddata SDK inside your IRB. Below are some
of the basic steps.

First, launch IRB. In your terminal, execute the following:

    irb

You should receive a message similar to the following, which indicates
that you are inside the interactive Ruby environment:

    2.1-head :001 >

Let’s start playing with gooddata. Enter the following:

    > GoodData

You should receive the following:

    NameError: uninitialized constant GoodData

This error message indicates that irb does not know about the gooddata
SDK. So, let’s tell irb to require the SDK:

    > require 'gooddata'
      => true

OK. Now, repeat the previous command:

    > GoodData
      => GoodData

The response indicates that irb knows about SDK. Let’s try to log in to
the GoodData platform with your credentials through the SDK. \* For
clarity, the &gt; sign is omitted in the irb session from now on.

    client = GoodData.connect("john@example.com", "password")

You should be logged in. Now, you can perform tasks that do not require
you to be inside of a specific project. For example, use the following
to list all of your projects:

    client.projects

To work with a project, you must define the project for the SDK. For
example, suppose you wish to list the reports in a project. You must
tell the SDK the project to review:

    project = client.projects('PROJECT_ID')

To list the reports in this project:

    project.reports

OK. To exit irb, enter:

    exit

### jack\_in

Working with GoodData SDK using irb can be cumbersome. To make things a
bit easier, Gooddata SDK includes a gooddata command line interface. One
of the commands is jack\_in which brings you into a live project where
you can poke and explore.

    gooddata -U john@example.com -P password -p PROJECT_ID project jack_in

In a single command, the above launches the command line interface, logs
you into the platform, and identifies the project to which to connect.
At this point, you may begin entering commands:

    reports = project.reports

**NOTE**: Use the ~/.gooddata file to save your username and password
locally, so you do not have to type it every single time.
