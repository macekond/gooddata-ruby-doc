---
id: visualizing_dag
author: GoodData
sidebar_label: Visualizing executions
title: Visualizing executions
---

Goal
-------

You successfully modularized your ETL into several orchestrated modules.
The problem is that it is hard to visualize the order of execution from
the Data Administration console.

How-to

--------

There are plethora of very useful libraries that you can use in
conjunction with GoodData SDK. One of those is Graphviz that is a C
library but it has bindings to almost every language including Ruby.
Graphviz is a visualization library and one of the features allows
visualization of Direct Acyclic Graphs which is exactly what an
execution of several schedules basically is.

As a prerequisite you must install both
[Graphviz](http://www.graphviz.org/) and [Graphviz ruby
bindings](https://github.com/glejeune/Ruby-Graphviz). This is user
dependent as installation is different for every platform. If you
encounter any errors try googling them or shoot us a message on GitHub
or support.


