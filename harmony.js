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
            }
        },
        enableServices: function () {
            googletag.cmd.push(function () {
                googletag.enableServices();
                Harmony.log('DFP services enabled.');
            });
        },
        display: function () {
            googletag.cmd.push(function () {
                Harmony.slotIDs.forEach(function (id) {
                    Harmony.log('Displaying id: ' + id);
                    googletag.display(id);
                });
            });
        },
        slot: {},
        slotIDs: [],
        newSlot: function (id, sizes, mapping, cb) {
            mapping = mapping || [];
            cb = cb || $.noop;
            googletag.cmd.push(function () {
                var slotID = 'div-gpt-ad-' + id;
                Harmony.slotIDs.push(slotID);

                var pubads = googletag.pubads();
                var slot = googletag.defineSlot(adUnitCode, sizes, slotID);
                slot.setTargeting('ad_slot', id);
                slot.defineSizeMapping(mapping);
                slot.addService(pubads);

                Harmony.slot[id] = slot;
                Harmony.log('Created slot: ' + id);

                pubads.addEventListener('slotRenderEnded', function (event) {
                    if (event.slot === slot) {
                        cb(event);
                        $.trigger('harmony/slotRenderEnded/' + id, event);
                    }
                });
            });
        }
    };
}());
