---
id: create_a_program
author: GoodData
sidebar_label: Scripting
title: Scripting
---

Problem
-------

You created a program by building it up in an interactive manner but now
you would like to put it into a file to be able to run it

Solution
--------

Let’s assume that your fantastic code that you have is fairly simple.
You would like to print the title of the project. So the session looks
something like this

    project_live_session: puts project.title
    "My project Test (2)"
    => nil

Not too fancy but it is enough to help us illustrate couple of points.
First you need to save your code to a file. Go ahead take your favorite
text editor and create a new file and put your code into it so it looks
like this

    puts client.projects

Go ahead and save it and call it 'my\_first\_sdk\_program.rb'. Do not
execute because it would not work now. Let’s add couple more things.

Jack in does couple of things for you so you can be productive quickly
but we have to handle them ourselves in a program.

-   Loads Automation SDK libraries

-   It logs you in and provides you the client as a `client` variable

-   It jacks into a project and provides you the project as a `project`
    variable. If you were wondering why the `project.title` worked in
    the interactive session in the first place since we never defined
    `project` this is why.

We can easily do the same things with these 3 lines of code
respectively. So add them to the file so the end result looks like this.

    require 'gooddata'

    client = GoodData.connect('username', 'pass')
    project = client.projects('project_id')
    puts project.title

Done. Save it.

Now you can run it by using this command

    ruby my_first_sdk_program.rb
