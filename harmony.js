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
                try {
                    if (localStorage.harmonyActiveLog) {
                        console.log('H> ' + msg);
                    }
                } catch (err) {
                    // Do nothing if no localStorage.
                }
            }
        },
        enableServices: function () {
            googletag.cmd.push(function () {
                googletag.enableServices();
                Harmony.log('DFP services enabled.');
                Harmony.log('Watching ' + $.waypoints().vertical.length + ' waypoints.');
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
                Harmony.log('Created slot: ' + id + ' inside #' + slotID);

                pubads.addEventListener('slotRenderEnded', function (event) {
                    if (event.slot === slot) {
                        Harmony.log('slotRenderEnded for ' + id);
                        cb(event);
                        $.trigger('harmony/slotRenderEnded/' + id, event);
                    }
                });

                
            });
        }
    };
}());
