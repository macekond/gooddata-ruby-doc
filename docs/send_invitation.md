---
id: send_invitation
author: GoodData
sidebar_label: Inviting Users to Project
title: Inviting Users to Project
---

Goal
-------

You need to invite a user into project.

Prerequisites
-------------

You have to have a user who is an admin of an organization. If you don’t
have the organization admin account, please contact your primary
GoodData contact person or GoodData support (e-mail
<support@gooddata.com>).

Solution
--------


```ruby
# encoding: utf-8

require 'gooddata'

client = GoodData.connect
project = client.projects('project_pid')

project.invite('joe@example.com', 'admin', 'Hey Joe, look at this.')

```

Discussion
----------

Invitation can be sent by any administrator. Invited user receives
invitation e-mail with invitation confirmation. If you want to add user
into a project without the e-mail and confirmation, please consult the
recipe Adding users to Project.
