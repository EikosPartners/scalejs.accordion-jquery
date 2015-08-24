define([
    'scalejs!core', 'scalejs!application'
], function(
    core
) {
    var accordion = core.accordion;

    // For deeper testing, log to console
    console.log('core.accordion: ', accordion);

    describe('core.accordion', function() {

        it('is defined', function() {
            expect(accordion).toBeDefined();
        });

    });
});

