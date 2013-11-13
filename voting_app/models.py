#!/usr/bin/env python
# -*- coding: utf-8 -*-#
# Copyright (C) 2013 GC3, University of Zurich
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program.  If not, see <http://www.gnu.org/licenses/>.
#
__author__ = 'Nicolas Baer <nicolas.baer@uzh.ch>'


from django.db import models


class Topic(models.Model):
    name = models.CharField(max_length=200)
    votes = models.IntegerField(default=0, blank=True)
    hide = models.BooleanField(default=False, blank=True)

    def __unicode__(self):
        return self.name
