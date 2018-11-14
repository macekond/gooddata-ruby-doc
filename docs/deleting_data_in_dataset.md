---
id: deleting_data_in_dataset
author: GoodData
sidebar_label: Removing Data
title: Removing Data
---

Goal
-------

Sometimes you need to delete all data from a dataset.

Solution
--------

SDK calls the MAQL SYNCHRONIZE command on the dataset

    SYNCHRONIZE {dataset.users};

for each dataset you would like to clear. You can achieve the same like
this.


