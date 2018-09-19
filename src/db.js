import Sequelize from 'sequelize';

const db = new Sequelize('database', null, null, {
    dialect: 'sqlite',
    storage: 'market.db'
});

const keyvalModel = db.define('keyval', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    key: {
        type: Sequelize.STRING,
        unique: true
    },
    value: {
        type: Sequelize.TEXT
    }
}, {
    timestamps: false
});

export default async () => {

    await Promise.all([
        keyvalModel
    ].map(model => model.sync()));

    await db.authenticate();

    console.log('!!! dbInitialized');
};
