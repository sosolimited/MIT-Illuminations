module.exports = {
    production: [
        {
            // IP of kinet supply
            ip: '192.0.2.0',
            // kinet port strand is attached to (1-16)
            port: 1,
            // first movie pixel # strand is affected by;
            // pixels read in movie frame L->R, T->B
            start: 0,
            // number of lights in strand (assuming RGB)
            num_lights: 120
        }
    ]
}
