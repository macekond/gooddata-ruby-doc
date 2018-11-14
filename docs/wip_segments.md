---
id: wip_segments
author: GoodData
sidebar_label: Working with segments
title: Working with segments
---

Goal
-------

You would like to setup and execute a life-cycle management
configuration to distribute new versions of dashboards, reports, and
metrics from a master template to multiple target projects.

How-to

--------

You can use life-cycle management API to create a life-cycle segment,
associate it with its master template project, and populate the segment
with target projects that are going to receive the new versions of
objects from the master template. First let’s align on the terminology.

Organization - Organization is an object that contains all users and
projects that you or your company have provisioned to the GoodData
platform. Organization can also contain white-labeling configuration
(your custom colors, logos, URLs etc.). Lifecycle management segments
and projects are always set up within an organization.

Lifecycle segment represents a group of projects that contain the same
analytical objects. New versions of these objects can be distributed
from so called master template project to the segment’s projects. The
segment’s projects can also contain ad-hoc objects (e.g. reports or
metrics) that are not touched (not updated nor deleted) by the lifecycle
processes. Lifecycle segments are usually used to represent a different
tiers (e.g. bronze/silver/gold) tiers of an analytical solution.

Master template is a project that contains the latest and greatest
versions of objects that are distributed to the segment’s projects. We
recommend to keep the master’s project immutable once it gets associated
with a segment. So a new master template project should be cloned from
the previous master and associated with the segment for each new version
of your solution. Lifecycle segment can be associated with just one
master at any given time.

Client - is user-assigned ID of a segment’s project. The client ID is
associated with a GoodData generated project ID during segment
provisioning operation. The client ID is stable identification of
certain tenant’s project. It can be associated with different project
IDs during it’s lifecycle.

Having defined some terminology we present code that will do several
things.

-   sets up a segment with master project (along with some data and
    dashboard)

-   creates a client within a segment. The client is not yet associated
    with a project at this time.

-   releases new master project

-   provisions new project for the client (this will ensure client’s
    project has the same model, dashboard but no data )

-   changes the dashboard in master

-   makes another release

-   synchronizes the clients with updated version

-   adds a client

-   provisions new project for the second client too


