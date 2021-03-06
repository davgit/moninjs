goog.provide('monin.parallax.ui.Element');

goog.require('goog.math.Coordinate');
goog.require('goog.math.Range');
goog.require('goog.style');
goog.require('goog.ui.Component');
goog.require('goog.ui.registry');
goog.require('monin.parallax.model.ElementConfig');

/**
 * @constructor
 * @extends {goog.ui.Component}
 */
monin.parallax.ui.Element = function()
{
    goog.base(this);

    /**
     * @type {monin.parallax.model.ElementConfig}
     * @private
     */
    this.config_ = null;

    /**
     * @type {goog.math.Range}
     * @protected
     */
    this.range = null;

    /**
     * @type {Array.<monin.parallax.effects.Effect>}
     * @private
     */
    this.effects_ = [];

    /**
     * @type {goog.math.Coordinate}
     * @private
     */
    this.position_ = new goog.math.Coordinate(0, 0);


    /**
     * @type {boolean}
     * @protected
     */
    this.isActive = true;

};
goog.inherits(monin.parallax.ui.Element, goog.ui.Component);

/**
 * Adjusts element to viewport size
 *
 * @param {goog.math.Size} size
 */
monin.parallax.ui.Element.prototype.adjustToSize = function(size)
{
    // No default implementation
};

/**
 * @return {Array.<monin.parallax.effects.Effect>}
 */
monin.parallax.ui.Element.prototype.getEffects = function()
{
    return this.effects_;
};

/** @inheritDoc */
monin.parallax.ui.Element.prototype.enterDocument = function()
{
    goog.base(this, 'enterDocument');

    this.position_ = goog.style.getPosition(this.getElement());
};

/**
 * Returns initial position
 *
 * @return {goog.math.Coordinate}
 */
monin.parallax.ui.Element.prototype.getInitialPosition = function()
{
    return this.position_;
};

/**
 * Returns true if element needs to be loaded
 *
 * @return {boolean}
 */
monin.parallax.ui.Element.prototype.isLoadable = function()
{
    return false;
};

/**
 * @param  {number} offset
 */
monin.parallax.ui.Element.prototype.isVisible = function(offset)
{
    return !this.range || goog.math.Range.containsPoint(this.range, offset);
};

/**
 * Sets whether element is currently active / inactive
 *
 * @param {boolean} isActive
 */
monin.parallax.ui.Element.prototype.setActive = function(isActive)
{
    this.isActive = isActive;

    for (var i = 0; i < this.effects_.length; i++)
    {
        this.effects_[i].setActive(isActive);
    }
};

/**
 * Sets element configuration
 *
 * @param {Object} config
 * @param {monin.parallax.effects.EffectFactory} effectFactory
 */
monin.parallax.ui.Element.prototype.setConfig = function(config, effectFactory)
{
    this.config_ = monin.parallax.model.ElementConfig.factory(config);

    if (config['range'])
    {
        this.range = new goog.math.Range(config['range'][0], config['range'][1]);
    }

    if (config['effects'])
    {
        var effect;
        for (var i = 0; i < config['effects'].length; i++)
        {
            effect = effectFactory.getEffect(config['effects'][i]);
            if (!effect)
            {
                if (goog.DEBUG)
                {
                    console.error('Effect could\'nt be found. %o', config['effects'][i]);
                }
                throw new Error('Effect not found.');
            }
            this.effects_.push(effect);
        }
    }
};


/**
 * Updates parallax properties
 *
 * @param {number} offset
 * @param {goog.math.Size} size
 * @param {number} position
 */
monin.parallax.ui.Element.prototype.update = function(offset, size, position)
{
    if (goog.DEBUG && this.config_ && this.config_.logOffset)
    {
        console.info('Element offset %o, %f', this, offset);
    }

    for (var i = 0; i < this.effects_.length; i++)
    {
        this.effects_[i].apply(this, offset, size, position);
    }

    // return this.effects_.length;
};

/**
 * Enumiration for event types
 *
 * @enum {string}
 */
monin.parallax.ui.Element.EventType = {
    LOAD: 'elementload'
};


/**
 * Register this control so it can be created from markup.
 */
goog.ui.registry.setDecoratorByClassName(
    'prlx-default-element',
    function() {
      return new monin.parallax.ui.Element();
    }
);
