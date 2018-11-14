---
id: speeding_things_up
author: GoodData
sidebar_label: Parallel Processing
title: Parallel Processing
---

Problem
-------

You created the script. It works but it is slow. Let’s have at one trick
how to possibly make it faster.

Solution
--------

Often if you look at the API the structure is orthogonal to your use
case. For example you might need to invite user to many projects but the
API has only an endpoint to invite a user to a single project. If you do
something like

    projects.map do |project|
      project.invite_user('john@example.com')
    end

it will work but it will create as many requests as there are projects.
The requests will be processed sequentially and this takes time. You can
estimate this easily. Let’s say we have 1000 projects and invitation
request takes 500ms (half a second). This means it will take 500 seconds
therefore almost 10 minutes.

The nice thing is that the requests for inviting user to each project
are totally independent. You don’t need a project invitation to finish
before you invite the user to another project. So you can invoke
multiple invitations at the same time. The following code invokes
multiple invitations in parallel

    projects.pmap do |project|
      project.invite_user('john@example.com')
    end

We’ve just changed single letter. We are using pmap which stands for
parallel map. It behaves exactly the same as map with one difference.
The block for each item of the array runs in a separate thread. You do
not need to think about it, it just happens faster. We have currently 20
threads reserved so it will run 20 times faster. In this case under 0.5
minutes.
