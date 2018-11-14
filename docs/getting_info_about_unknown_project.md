---
id: getting_info_about_unknown_project
author: GoodData
sidebar_label: Exploring Unknown Project
title: Exploring Unknown Project
---

Goal
-------

You just got invited to this project and just can’t reach the project’s
author. Can’t find any project’s documentation. The following code
snippet may be helpful in such situation

Solution
--------

You want to start with a quick introspection. How many datasets, how
much data is there how many processes etc. Doing this manually is fairly
time consuming. You have to find the primary attributes of each dataset
create a count metric and a lot of other stuff. This can be automated
and it is so useful we actually created a command that does just this.


```ruby
GoodData.with_connection do |c|
  GoodData.with_project('project_pid') do |project|
    project.info
  end
end
```

This might be the hypothetical output. For each dataset you have there
the size. Below is a breakdown of how many different types of objects
there are inside the dataset.

&lt;%= render\_source 'text', 'src/04\_model/output.txt' %&gt;
