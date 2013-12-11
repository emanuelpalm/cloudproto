define(function(require) {
    QUnit.module("Cloud");
    var Cloud = require("cloud");

    QUnit.test("Cloud creation", function (assert) {

        var cloud = new Cloud.Cloud(0, 16);
        assert.equal(cloud.getParticles().length, 0, "Created cloud is empty.");

        cloud = new Cloud.Cloud(2, 4);
        assert.equal(cloud.getParticles().length, 2, "Created cloud has 2 particles.");
    });

    QUnit.test("Cloud particle creation", function (assert) {

        var PARTICLE_ELEM_AMT = Cloud.Particle.ELEMENT_AMOUNT;

        assert.equal(PARTICLE_ELEM_AMT, 8, "Array elements required to store particle is 8.");

        var cloud = new Cloud.Cloud(1, 2);

        var data = cloud.getData();
        assert.equal(cloud.getParticles().length, 1, "Cloud now has 1 particle.");
        assert.equal(data.length, PARTICLE_ELEM_AMT, "Cloud data array has length is " + PARTICLE_ELEM_AMT);

        assert.ok((Math.abs(data[0]) <= 1.0), "data[0] (X) - Is a valid coordinate.");
        assert.ok((Math.abs(data[1]) <= 1.0), "data[1] (Y) - Is a valid coordinate.");
        assert.ok((Math.abs(data[2]) <= 1.0), "data[2] (Z) - Is a valid coordinate.");
        assert.equal(data[3], 1.0, "data[3] (W) - Is 1.0, but really doesn't matter.");

        assert.ok((data[4] >= 0.0 && data[4] <= 1.0), "data[4] (R) - Is a valid color.");
        assert.ok((data[5] >= 0.0 && data[5] <= 1.0), "data[5] (G) - Is a valid color.");
        assert.ok((data[6] >= 0.0 && data[6] <= 1.0), "data[6] (B) - Is a valid color.");
        assert.ok((data[7] >= 0.0 && data[7] <= 1.0), "data[7] (A) - Is a valid color.");

        cloud.setParticleAmount(2);
        data = cloud.getData();

        assert.equal(cloud.getParticles().length, 2, "Cloud now has 2 particles.");
        assert.equal(data.length, PARTICLE_ELEM_AMT * 2, "Cloud data array has length is " + PARTICLE_ELEM_AMT * 2);
    });
});