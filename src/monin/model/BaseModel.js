// Copyright 2012 Dmitry Monin. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
/**
 * @fileoverview Base model class
 * Support event binding for properties changes. Updating properties through update() method forces events fired.
 */
goog.provide('monin.model.BaseModel');

goog.require('goog.events.EventTarget');

/**
 * Abstract Base Model
 *
 * @constructor
 * @extends {goog.events.EventTarget}
 */
monin.model.BaseModel = function()
{
    goog.base(this);
};
goog.inherits(monin.model.BaseModel, goog.events.EventTarget);

/**
 * @param {goog.events.EventHandler} eh
 * @param {Object} data
 */
monin.model.BaseModel.prototype.bind = function(eh, data)
{
    for (var i in data)
    {
        eh.listen(this, i + 'Changed', data[i]);
    }
};

/**
 * @param {goog.events.EventHandler} eh
 * @param {Object} data
 */
monin.model.BaseModel.prototype.unbind = function(eh, data)
{
    for (var i in data)
    {
        eh.unlisten(this, i + 'Changed', data[i]);
    }
};

/**
 * @param {Object} data
 */
monin.model.BaseModel.prototype.update = function(data)
{
    var fireChange = false;
    for (var i in data)
    {
        if (this[i] != data[i])
        {
            this[i] = data[i];
            fireChange = true;
            this.dispatchEvent(i + 'Changed');
        }
    }

    if (fireChange)
    {
        this.dispatchEvent(goog.events.EventType.CHANGE);
    }
};
