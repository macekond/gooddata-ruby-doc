---
author: GoodData
title: What is blueprint
---

Before we delve into examples involving blueprints let’s talk a moment what a blueprint is and what is a difference between blueprint and model when we talk about them at Gooddata.

They mean the same thing but they are representing it in a different way
and they live at different places. Both of them define a model of
analytic application.

The main difference is the fact that when we talk about model we mean a
specific instance of a project which has specific instance of model with
all its attributes and facts that live at GoodData platform. Each field
has a URI and object\_id and you can query it using the platform API.
You can also ask questions like "What object in the model has object\_id
1532?" or "Can you give me a link to dataset 'users' in the model?".

When we talk about blueprint on the other hand we mean the abstract
prescription that tells us how to create the model. A blueprint does not
contain many of the details most prominently object\_ids and URIs and
strictly speaking each time you use a blueprint to create a model those
things might be different. When a model is created from blueprint as a
side effect, all the URIs and ids are created.

So what are the benefits of the blueprint you might ask? Blueprint was
specifically designed so you can have a description of the model that
can live outside of GoodData platform. It has textual representation
which you can commit into git and work with it in a programmatic way.
Second it is intended that the many projects are created from one
blueprint.
