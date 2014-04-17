/**
 *  Wrapper for DFP api.
 *  @requires gpt.js to be loaded.
 */
var Harmony = (function () {
    var adUnitCode = '/11347122/dev-test';
    var log = '';

    return {
        log: function (msg) {
            if (!msg) {
                console.log(log);
            } else {
                log += '> ' + msg + '\n';
                if (localStorage['harmony_noisy'] == 'on') {
                    console.log('H> ' + msg);
                }
            }
        },
        enableServices: function () {
            googletag.cmd.push(function () {
                googletag.enableServices();
                Harmony.log('DFP services enabled.');
                Harmony.log('Watching ' + $.waypoints().vertical.length + ' waypoints.');
                Harmony.slotIDs.forEach(function (id) {
                    var visible = $('#' + id).visible(true);
                    if (visible) {
                        Harmony.display(id);
                    }
                });
            });
        },
        display: function (target) {
            googletag.cmd.push(function () {
                if (!target) {
                    var idSet = Harmony.slotIDs;
                    Harmony.log('Displaying all slots: ' + idSet);
                    idSet.forEach(function (id) {
                        googletag.display(id);
                    });
                } else {
                    Harmony.log('Displaying id: ' + target);
                    googletag.display(target);
                }
            });
        },
        slot: {},
        slotIDs: [],
        newSlot: function (name, sizes, mapping, cb) {
            mapping = mapping || [];
            cb = cb || $.noop;
            googletag.cmd.push(function () {
                var slotID = 'div-gpt-ad-' + name;
                Harmony.slotIDs.push(slotID);

                var pubads = googletag.pubads();
                var slot = googletag.defineSlot(adUnitCode, sizes, slotID);
                slot.setTargeting('ad_slot', name);
                slot.defineSizeMapping(mapping);
                slot.addService(pubads);

                Harmony.slot[name] = slot;
                Harmony.log('Created slot: ' + name + ' inside #' + slotID);

                pubads.addEventListener('slotRenderEnded', function (event) {
                    if (event.slot === slot) {
                        Harmony.log('slotRenderEnded for ' + name);
                        cb(event);
                        $.trigger('harmony/slotRenderEnded/' + name, event);
                    }
                });

                var selector = '#' + slotID;
                $(selector).waypoint({
                    handler: function () {
                        Harmony.display(slotID);
                    },
                    offset: -10,
                    triggerOnce: true
                });
                $(selector).waypoint({
                    handler: function () {
                        Harmony.display(slotID);
                    },
                    offset: function () {
                        var height = window.innerHeight || $(window).height();
                        return height + 10;
                    },
                    triggerOnce: true
                });
            });
        }
    };
}());
