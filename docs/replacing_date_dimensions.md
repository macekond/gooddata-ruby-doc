---
id: replacing_date_dimensions
author: GoodData
sidebar_label: Substitute Date Dimension for Another One
title: Substitute Date Dimension for Another One
---

Goal
-------

You want to substitute an existing date dimension in your project for
another date dimension. This is particularly handy when you are
consolidating date dimensions (perhaps you want to have only one date
dimension in your project) or replacing your standard date dimension
with a fiscal date dimension.

Solution
--------

The code snippet below substitutes all occurences of a date dimension
objects (attributes and labels) for another date dimension’s objects
(that must obviously exist in the project). The substitution is
performed in following objects:

-   Metrics

-   Report Definitions

-   Reports

-   Report Specific Metrics

-   Dashboards

-   Dashboard Saved Views



Discussion
----------

You need to specify complete mapping between the current and new date
dimensions attributes. This is straightforward in case when both date
dimensions have the same structure (see the commented out *:old* /
*:new* syntax). Full mapping is necessary when the date dimensions have
different structures. For example the *abortdate* date dimension in the
code above doesn’t have any *EU week* attributes. The existing
*closedate*'s *EU week* attributes are mapped to standard week
attributes of the *abortdate* dimension.
