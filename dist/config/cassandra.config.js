"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('cassandra', () => ({
    contactPoints: process.env.CASSANDRA_CONTACT_POINTS
        ? JSON.parse(process.env.CASSANDRA_CONTACT_POINTS)
        : ['127.0.0.1'],
    localDataCenter: process.env.CASSANDRA_LOCAL_DATACENTER || 'datacenter1',
    keyspace: process.env.CASSANDRA_KEYSPACE || 'collab_space',
    credentials: {
        username: process.env.CASSANDRA_USERNAME || 'cassandra',
        password: process.env.CASSANDRA_PASSWORD || 'cassandra',
    },
}));
//# sourceMappingURL=cassandra.config.js.map