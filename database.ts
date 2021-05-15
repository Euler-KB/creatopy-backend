import { Sequelize } from 'sequelize-typescript'

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: process.env.DB_STORAGE || 'store.db3'
});

export const initialize = async () => {

    //  add models
    sequelize.addModels([__dirname + '/models']);

    //  synchronize database
    await sequelize.sync();
}

export default sequelize;
