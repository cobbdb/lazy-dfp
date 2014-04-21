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
                if (localStorage.harmony_noisy === 'true') {
                    console.log('H> ' + msg);
                }
            }
        },
        enableServices: function () {
            googletag.cmd.push(function () {
                googletag.enableServices();
                Harmony.log('DFP services enabled.');
                $.beacons({
                    range: 150
                });
                $.beacons('enable');
                Harmony.log('Beacons are enabled.');
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
                var id = 'div-gpt-ad-' + name;
                Harmony.slotIDs.push(id);

                var pubads = googletag.pubads();
                var slot = googletag.defineSlot(adUnitCode, sizes, id);
                slot.setTargeting('ad_slot', name);
                slot.defineSizeMapping(mapping);
                slot.addService(pubads);

                Harmony.slot[name] = slot;
                Harmony.log('Created slot ' + name + ' inside #' + id);

                pubads.addEventListener('slotRenderEnded', function (event) {
                    if (event.slot === slot) {
                        Harmony.log('slotRenderEnded for ' + name);
                        cb(event);
                        $.trigger('harmony/slotRenderEnded/' + name, event);
                    }
                });
                Harmony.log('Listener for slotRenderEnded attached to ' + name);

                var selector = '#' + id;
                $(selector).beacon({
                    handler: function () {
                        Harmony.display(id);
                    },
                    enabled: false,
                    runOnce: true
                });
                Harmony.log('Beacon ' + name + ' created.');
            });
        }
    };
}());
