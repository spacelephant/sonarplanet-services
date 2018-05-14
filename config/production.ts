import DefaultConfig from './default';

const productionConfig = DefaultConfig;

productionConfig.database.directory = '${BUCKET_FOLDER}/db_storage';

export default productionConfig;
